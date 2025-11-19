using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ITTicketing.Backend.Models
{
    public class TicketAuditLog
    {
        [Key]
        public Guid ActivityId { get; set; } = Guid.NewGuid();

        [Required]
        public Guid TicketId { get; set; }

        [ForeignKey("TicketId")]
        public Ticket? Ticket { get; set; }

        public int? UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        [Required]
        [MaxLength(50)]
        public required string ActionType { get; set; }

        [Column(TypeName = "text")]
        public string? OldValue { get; set; }

        [Column(TypeName = "text")]
        public string? NewValue { get; set; }

        public DateTime LoggedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}