using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ITTicketing.Backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    RoleId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RoleCode = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.RoleId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Username = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    RoleId = table.Column<int>(type: "integer", nullable: false),
                    ManagerId = table.Column<int>(type: "integer", nullable: true),
                    Email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    FullName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Department = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Password = table.Column<string>(type: "text", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_Users_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "RoleId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Users_Users_ManagerId",
                        column: x => x.ManagerId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Tickets",
                columns: table => new
                {
                    TicketId = table.Column<Guid>(type: "uuid", nullable: false),
                    TicketNumber = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    RequesterId = table.Column<int>(type: "integer", nullable: false),
                    MainIssue = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    SubIssue = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    SlaHours = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Subject = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Priority = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    StatusCode = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    AssignedToId = table.Column<int>(type: "integer", nullable: true),
                    CurrentApproverId = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ClosedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tickets", x => x.TicketId);
                    table.ForeignKey(
                        name: "FK_Tickets_Users_AssignedToId",
                        column: x => x.AssignedToId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Tickets_Users_CurrentApproverId",
                        column: x => x.CurrentApproverId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Tickets_Users_RequesterId",
                        column: x => x.RequesterId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TicketApprovalLogs",
                columns: table => new
                {
                    ApprovalLogId = table.Column<Guid>(type: "uuid", nullable: false),
                    TicketId = table.Column<Guid>(type: "uuid", nullable: false),
                    ApproverId = table.Column<int>(type: "integer", nullable: false),
                    RequiredLevel = table.Column<int>(type: "integer", nullable: false),
                    ApprovalStatus = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Comments = table.Column<string>(type: "text", nullable: true),
                    ActionAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TicketApprovalLogs", x => x.ApprovalLogId);
                    table.ForeignKey(
                        name: "FK_TicketApprovalLogs_Tickets_TicketId",
                        column: x => x.TicketId,
                        principalTable: "Tickets",
                        principalColumn: "TicketId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TicketApprovalLogs_Users_ApproverId",
                        column: x => x.ApproverId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TicketAttachments",
                columns: table => new
                {
                    AttachmentId = table.Column<Guid>(type: "uuid", nullable: false),
                    TicketId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    FilePath = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TicketAttachments", x => x.AttachmentId);
                    table.ForeignKey(
                        name: "FK_TicketAttachments_Tickets_TicketId",
                        column: x => x.TicketId,
                        principalTable: "Tickets",
                        principalColumn: "TicketId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TicketAttachments_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TicketAuditLogs",
                columns: table => new
                {
                    ActivityId = table.Column<Guid>(type: "uuid", nullable: false),
                    TicketId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: true),
                    ActionType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    OldValue = table.Column<string>(type: "text", nullable: true),
                    NewValue = table.Column<string>(type: "text", nullable: true),
                    LoggedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TicketAuditLogs", x => x.ActivityId);
                    table.ForeignKey(
                        name: "FK_TicketAuditLogs_Tickets_TicketId",
                        column: x => x.TicketId,
                        principalTable: "Tickets",
                        principalColumn: "TicketId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TicketAuditLogs_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "TicketComments",
                columns: table => new
                {
                    CommentId = table.Column<Guid>(type: "uuid", nullable: false),
                    TicketId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    CommentText = table.Column<string>(type: "text", nullable: false),
                    IsInternal = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TicketComments", x => x.CommentId);
                    table.ForeignKey(
                        name: "FK_TicketComments_Tickets_TicketId",
                        column: x => x.TicketId,
                        principalTable: "Tickets",
                        principalColumn: "TicketId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TicketComments_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "RoleId", "RoleCode" },
                values: new object[,]
                {
                    { 1, "EMPLOYEE" },
                    { 2, "IT_PERSON" },
                    { 3, "L1_MANAGER" },
                    { 4, "L2_HEAD" },
                    { 5, "COO" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "Department", "Email", "FullName", "ManagerId", "Password", "RoleId", "UpdatedAt", "Username" },
                values: new object[,]
                {
                    { 100, "Executive", "minan@abstractgroup.com", "Minan (CEO)", null, "HASHED_DEFAULT_PASSWORD", 5, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "minan.ceo" },
                    { 101, "Executive", "rashmi@abstractgroup.com", "Rashmi (COO)", 100, "HASHED_DEFAULT_PASSWORD", 5, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "rashmi.coo" },
                    { 201, "Operations", "anjali@abstractgroup.com", "Anjali (L2 Head)", 101, "HASHED_DEFAULT_PASSWORD", 4, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "anjali.l2" },
                    { 202, "Operations", "rohan@abstractgroup.com", "Rohan (L2 Head)", 101, "HASHED_DEFAULT_PASSWORD", 4, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "rohan.l2" },
                    { 301, "Operations", "deepak@abstractgroup.com", "Deepak (L1 Manager)", 201, "HASHED_DEFAULT_PASSWORD", 3, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "deepak.l1" },
                    { 302, "Finance", "kavita@abstractgroup.com", "Kavita (L1 Manager)", 201, "HASHED_DEFAULT_PASSWORD", 3, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "kavita.l1" },
                    { 303, "Marketing", "simran@abstractgroup.com", "Simran (L1 Manager)", 202, "HASHED_DEFAULT_PASSWORD", 3, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "simran.l1" },
                    { 401, "IT Support", "rahul@abstractgroup.com", "Rahul (IT Person)", 301, "HASHED_DEFAULT_PASSWORD", 2, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "rahul.it" },
                    { 402, "IT Support", "sneha@abstractgroup.com", "Sneha (IT Person)", 301, "HASHED_DEFAULT_PASSWORD", 2, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "sneha.it" },
                    { 403, "IT Support", "amit@abstractgroup.com", "Amit (IT Person)", 302, "HASHED_DEFAULT_PASSWORD", 2, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "amit.it" },
                    { 404, "IT Support", "vikas@abstractgroup.com", "Vikas (IT Person)", 303, "HASHED_DEFAULT_PASSWORD", 2, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "vikas.it" },
                    { 501, "Marketing", "tara@abstractgroup.com", "Tara (Employee)", 401, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "tara.emp" },
                    { 502, "Marketing", "alex@abstractgroup.com", "Alex (Employee)", 401, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "alex.emp" },
                    { 503, "HR", "radha@abstractgroup.com", "Radha (Employee)", 402, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "radha.emp" },
                    { 504, "Finance", "neha@abstractgroup.com", "Neha (Employee)", 403, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "neha.emp" },
                    { 505, "Sales", "priya@abstractgroup.com", "Priya (Employee)", 404, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "priya.emp" },
                    { 506, "Dept 2", "employee_506@abstractgroup.com", "Test Employee 506", 401, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "emp_test_506" },
                    { 507, "Dept 3", "employee_507@abstractgroup.com", "Test Employee 507", 402, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "emp_test_507" },
                    { 508, "Dept 4", "employee_508@abstractgroup.com", "Test Employee 508", 403, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "emp_test_508" },
                    { 509, "Dept 5", "employee_509@abstractgroup.com", "Test Employee 509", 404, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "emp_test_509" },
                    { 510, "Dept 1", "employee_510@abstractgroup.com", "Test Employee 510", 401, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "emp_test_510" },
                    { 511, "Dept 2", "employee_511@abstractgroup.com", "Test Employee 511", 402, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "emp_test_511" },
                    { 512, "Dept 3", "employee_512@abstractgroup.com", "Test Employee 512", 403, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "emp_test_512" },
                    { 513, "Dept 4", "employee_513@abstractgroup.com", "Test Employee 513", 404, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "emp_test_513" },
                    { 514, "Dept 5", "employee_514@abstractgroup.com", "Test Employee 514", 401, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "emp_test_514" },
                    { 515, "Dept 1", "employee_515@abstractgroup.com", "Test Employee 515", 402, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "emp_test_515" },
                    { 516, "Dept 2", "employee_516@abstractgroup.com", "Test Employee 516", 403, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "emp_test_516" },
                    { 517, "Dept 3", "employee_517@abstractgroup.com", "Test Employee 517", 404, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "emp_test_517" },
                    { 518, "Dept 4", "employee_518@abstractgroup.com", "Test Employee 518", 401, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "emp_test_518" },
                    { 519, "Dept 5", "employee_519@abstractgroup.com", "Test Employee 519", 402, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "emp_test_519" },
                    { 520, "Dept 1", "employee_520@abstractgroup.com", "Test Employee 520", 403, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "emp_test_520" },
                    { 521, "Dept 2", "employee_521@abstractgroup.com", "Test Employee 521", 404, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "emp_test_521" },
                    { 522, "Dept 3", "employee_522@abstractgroup.com", "Test Employee 522", 401, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "emp_test_522" },
                    { 523, "Dept 4", "employee_523@abstractgroup.com", "Test Employee 523", 402, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "emp_test_523" },
                    { 524, "Dept 5", "employee_524@abstractgroup.com", "Test Employee 524", 403, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "emp_test_524" },
                    { 525, "Dept 1", "employee_525@abstractgroup.com", "Test Employee 525", 404, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "emp_test_525" },
                    { 526, "Dept 2", "employee_526@abstractgroup.com", "Test Employee 526", 401, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "emp_test_526" },
                    { 527, "Dept 3", "employee_527@abstractgroup.com", "Test Employee 527", 402, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "emp_test_527" },
                    { 528, "Dept 4", "employee_528@abstractgroup.com", "Test Employee 528", 403, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "emp_test_528" },
                    { 529, "Dept 5", "employee_529@abstractgroup.com", "Test Employee 529", 404, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "emp_test_529" },
                    { 530, "Dept 1", "employee_530@abstractgroup.com", "Test Employee 530", 401, "HASHED_DEFAULT_PASSWORD", 1, new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "emp_test_530" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_TicketApprovalLogs_ApproverId",
                table: "TicketApprovalLogs",
                column: "ApproverId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketApprovalLogs_TicketId",
                table: "TicketApprovalLogs",
                column: "TicketId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketAttachments_TicketId",
                table: "TicketAttachments",
                column: "TicketId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketAttachments_UserId",
                table: "TicketAttachments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketAuditLogs_TicketId",
                table: "TicketAuditLogs",
                column: "TicketId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketAuditLogs_UserId",
                table: "TicketAuditLogs",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketComments_TicketId",
                table: "TicketComments",
                column: "TicketId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketComments_UserId",
                table: "TicketComments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_AssignedToId",
                table: "Tickets",
                column: "AssignedToId");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_CurrentApproverId",
                table: "Tickets",
                column: "CurrentApproverId");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_RequesterId",
                table: "Tickets",
                column: "RequesterId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_ManagerId",
                table: "Users",
                column: "ManagerId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_RoleId",
                table: "Users",
                column: "RoleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TicketApprovalLogs");

            migrationBuilder.DropTable(
                name: "TicketAttachments");

            migrationBuilder.DropTable(
                name: "TicketAuditLogs");

            migrationBuilder.DropTable(
                name: "TicketComments");

            migrationBuilder.DropTable(
                name: "Tickets");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Roles");
        }
    }
}
