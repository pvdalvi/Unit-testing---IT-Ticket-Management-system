using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ITTicketing.Backend.Models
{
    public class TicketApprovalLog
    {
        [Key]
        public Guid ApprovalLogId { get; set; } = Guid.NewGuid();

        [Required]
        public Guid TicketId { get; set; }

        [ForeignKey("TicketId")]
        public Ticket? Ticket { get; set; }

        [Required]
        public int ApproverId { get; set; }

        [ForeignKey("ApproverId")]
        public User? Approver { get; set; }

        [Required]
        public int RequiredLevel { get; set; }

        [Required]
        [MaxLength(50)]
        public required string ApprovalStatus { get; set; }

        [Column(TypeName = "text")]
        public string? Comments { get; set; }

        public DateTime ActionAt { get; set; } = DateTime.UtcNow;
    }
}