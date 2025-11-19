using ITTicketing.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace ITTicketing.Backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<TicketComment> TicketComments { get; set; }
        public DbSet<TicketAttachment> TicketAttachments { get; set; }
        public DbSet<TicketApprovalLog> TicketApprovalLogs { get; set; }
        public DbSet<TicketAuditLog> TicketAuditLogs { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //  User Model Relationships
            modelBuilder.Entity<User>()
                .HasOne(u => u.Manager)               // A User has ONE Manager (the FK is ManagerId)
                .WithMany(u => u.DirectReports)       // The Manager has MANY DirectReports
                .HasForeignKey(u => u.ManagerId)      // The FK is ManagerId on the User table
                .IsRequired(false)                    // ManagerId is nullable
                .OnDelete(DeleteBehavior.Restrict);   // Prevent cascading deletes (important for hierarchy)

            // -- Ticket Model Relationships (Multiple relationships to User) ---

            // Requester relationship (Required)
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Requester)
                .WithMany(u => u.RequestedTickets)
                .HasForeignKey(t => t.RequesterId)
                .OnDelete(DeleteBehavior.Restrict);

            // AssignedTo relationship (Optional - IT Person)
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.AssignedTo)
                .WithMany(u => u.AssignedTickets)
                .HasForeignKey(t => t.AssignedToId)
                .IsRequired(false) // AssignedToId is nullable
                .OnDelete(DeleteBehavior.Restrict);

            // CurrentApprover relationship (Optional - Manager)
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.CurrentApprover)
                .WithMany(u => u.ApprovedTickets)
                .HasForeignKey(t => t.CurrentApproverId)
                .IsRequired(false) // CurrentApproverId is nullable
                .OnDelete(DeleteBehavior.Restrict);


            // --- 3. Enforcing Data Type Mapping (For text fields) ---
            // EF Core sometimes defaults to varchar(max). Explicitly map to 'text' for larger fields.
            modelBuilder.Entity<TicketComment>()
                .Property(tc => tc.CommentText)
                .HasColumnType("text");

            modelBuilder.Entity<TicketApprovalLog>()
                .Property(tal => tal.Comments)
                .HasColumnType("text");

            // --------------------------------------------------------------------------------
            // --- 3. DATA SEEDING (Hierarchy and Roles) ---
            // --------------------------------------------------------------------------------

            // FIX: Use a static DateTime value for seeding consistency
            var seedTime = new DateTime(2025, 01, 01, 12, 0, 0, DateTimeKind.Utc);

            // Placeholder HASH for all users
            const string defaultHashedPassword = "HASHED_DEFAULT_PASSWORD";

            // 1. Seed Roles
            modelBuilder.Entity<Role>().HasData(
                new Role { RoleId = 1, RoleCode = "EMPLOYEE" },
                new Role { RoleId = 2, RoleCode = "IT_PERSON" },
                new Role { RoleId = 3, RoleCode = "L1_MANAGER" },
                new Role { RoleId = 4, RoleCode = "L2_HEAD" },
                new Role { RoleId = 5, RoleCode = "COO" }
            );

            // 2. Core Hierarchy Users (Using seedTime)
            var users = new List<User>
            {
                // Executive Leadership
                new User { UserId = 100, Username = "minan.ceo", FullName = "Minan (CEO)", Email = "minan@abstractgroup.com", Password = defaultHashedPassword, RoleId = 5, ManagerId = null, Department = "Executive", UpdatedAt = seedTime },
                new User { UserId = 101, Username = "rashmi.coo", FullName = "Rashmi (COO)", Email = "rashmi@abstractgroup.com", Password = defaultHashedPassword, RoleId = 5, ManagerId = 100, Department = "Executive", UpdatedAt = seedTime },

                // L2 Heads (Managers: 101)
                new User { UserId = 201, Username = "anjali.l2", FullName = "Anjali (L2 Head)", Email = "anjali@abstractgroup.com", Password = defaultHashedPassword, RoleId = 4, ManagerId = 101, Department = "Operations", UpdatedAt = seedTime },
                new User { UserId = 202, Username = "rohan.l2", FullName = "Rohan (L2 Head)", Email = "rohan@abstractgroup.com", Password = defaultHashedPassword, RoleId = 4, ManagerId = 101, Department = "Operations", UpdatedAt = seedTime },

                // L1 Managers (Managers: 201, 202)
                new User { UserId = 301, Username = "deepak.l1", FullName = "Deepak (L1 Manager)", Email = "deepak@abstractgroup.com", Password = defaultHashedPassword, RoleId = 3, ManagerId = 201, Department = "Operations", UpdatedAt = seedTime },
                new User { UserId = 302, Username = "kavita.l1", FullName = "Kavita (L1 Manager)", Email = "kavita@abstractgroup.com", Password = defaultHashedPassword, RoleId = 3, ManagerId = 201, Department = "Finance", UpdatedAt = seedTime },
                new User { UserId = 303, Username = "simran.l1", FullName = "Simran (L1 Manager)", Email = "simran@abstractgroup.com", Password = defaultHashedPassword, RoleId = 3, ManagerId = 202, Department = "Marketing", UpdatedAt = seedTime },

                // IT Personnel
                new User { UserId = 401, Username = "rahul.it", FullName = "Rahul (IT Person)", Email = "rahul@abstractgroup.com", Password = defaultHashedPassword, RoleId = 2, ManagerId = 301, Department = "IT Support", UpdatedAt = seedTime },
                new User { UserId = 402, Username = "sneha.it", FullName = "Sneha (IT Person)", Email = "sneha@abstractgroup.com", Password = defaultHashedPassword, RoleId = 2, ManagerId = 301, Department = "IT Support", UpdatedAt = seedTime },
                new User { UserId = 403, Username = "amit.it", FullName = "Amit (IT Person)", Email = "amit@abstractgroup.com", Password = defaultHashedPassword, RoleId = 2, ManagerId = 302, Department = "IT Support", UpdatedAt = seedTime },
                new User { UserId = 404, Username = "vikas.it", FullName = "Vikas (IT Person)", Email = "vikas@abstractgroup.com", Password = defaultHashedPassword, RoleId = 2, ManagerId = 303, Department = "IT Support", UpdatedAt = seedTime },

                // Initial Employees
                new User { UserId = 501, Username = "tara.emp", FullName = "Tara (Employee)", Email = "tara@abstractgroup.com", Password = defaultHashedPassword, RoleId = 1, ManagerId = 401, Department = "Marketing", UpdatedAt = seedTime },
                new User { UserId = 502, Username = "alex.emp", FullName = "Alex (Employee)", Email = "alex@abstractgroup.com", Password = defaultHashedPassword, RoleId = 1, ManagerId = 401, Department = "Marketing", UpdatedAt = seedTime },
                new User { UserId = 503, Username = "radha.emp", FullName = "Radha (Employee)", Email = "radha@abstractgroup.com", Password = defaultHashedPassword, RoleId = 1, ManagerId = 402, Department = "HR", UpdatedAt = seedTime },
                new User { UserId = 504, Username = "neha.emp", FullName = "Neha (Employee)", Email = "neha@abstractgroup.com", Password = defaultHashedPassword, RoleId = 1, ManagerId = 403, Department = "Finance", UpdatedAt = seedTime },
                new User { UserId = 505, Username = "priya.emp", FullName = "Priya (Employee)", Email = "priya@abstractgroup.com", Password = defaultHashedPassword, RoleId = 1, ManagerId = 404, Department = "Sales", UpdatedAt = seedTime }
            };

            // 3. Add 25 Additional Employees
            int startId = 506;
            int endId = 530;
            int[] itManagers = { 401, 402, 403, 404 };

            for (int i = startId; i <= endId; i++)
            {
                int managerId = itManagers[(i - startId) % itManagers.Length];

                users.Add(new User
                {
                    UserId = i,
                    Username = $"emp_test_{i}",
                    FullName = $"Test Employee {i}",
                    Email = $"employee_{i}@abstractgroup.com",
                    Password = defaultHashedPassword,
                    RoleId = 1,
                    ManagerId = managerId,
                    Department = $"Dept {(i % 5 + 1)}",
                    UpdatedAt = seedTime // FIX: Using static seedTime
                });
            }

            // 4. Seed all Users
            modelBuilder.Entity<User>().HasData(users);
        }
    }
}
