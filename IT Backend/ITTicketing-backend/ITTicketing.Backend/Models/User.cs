using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ITTicketing.Backend.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }

        [Required]
        [MaxLength(100)]
        public required string Username { get; set; }

        [Required]
        public int RoleId { get; set; }

        [ForeignKey("RoleId")]
        public Role? Role { get; set; }

        public int? ManagerId { get; set; }

        [ForeignKey("ManagerId")]
        public User? Manager { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public required string Email { get; set; }

        [Required]
        [MaxLength(255)]
        public required string FullName { get; set; }

        [MaxLength(100)]
        public string? Department { get; set; }

        [Required]
        public required string Password { get; set; }

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Collections (always initialized)
        public ICollection<User> DirectReports { get; set; } = new List<User>();

        public ICollection<Ticket> RequestedTickets { get; set; } = new List<Ticket>();

        public ICollection<Ticket> AssignedTickets { get; set; } = new List<Ticket>();

        public ICollection<Ticket> ApprovedTickets { get; set; } = new List<Ticket>();
    }
}