using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ITTicketing.Backend.Models
{
    public class Ticket
    {
        [Key]
        public Guid TicketId { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(20)]
        public required string TicketNumber { get; set; }

        [Required]
        public int RequesterId { get; set; }

        [ForeignKey("RequesterId")]
        public User? Requester { get; set; }

        [Required]
        [MaxLength(100)]
        public required string MainIssue { get; set; }

        [Required]
        [MaxLength(100)]
        public required string SubIssue { get; set; }

        [Required]
        public int SlaHours { get; set; }

        [Required]
        public required string Description { get; set; }

        [Required]
        [MaxLength(255)]
        public required string Subject { get; set; }

        [Required]
        [MaxLength(50)]
        public required string Priority { get; set; }

        [Required]
        [MaxLength(50)]
        public required string StatusCode { get; set; }

        public int? AssignedToId { get; set; }

        [ForeignKey("AssignedToId")]
        public User? AssignedTo { get; set; }

        public int? CurrentApproverId { get; set; }

        [ForeignKey("CurrentApproverId")]
        public User? CurrentApprover { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ClosedAt { get; set; }

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Collections (always initialized)
        public ICollection<TicketComment> Comments { get; set; } = new List<TicketComment>();

        public ICollection<TicketAttachment> Attachments { get; set; } = new List<TicketAttachment>();

        public ICollection<TicketApprovalLog> ApprovalLogs { get; set; } = new List<TicketApprovalLog>();

        public ICollection<TicketAuditLog> AuditLogs { get; set; } = new List<TicketAuditLog>();
    }
}