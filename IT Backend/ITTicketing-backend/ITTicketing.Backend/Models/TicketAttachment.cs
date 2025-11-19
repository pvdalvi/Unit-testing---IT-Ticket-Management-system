using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ITTicketing.Backend.Models
{
    public class TicketAttachment
    {
        [Key]
        public Guid AttachmentId { get; set; } = Guid.NewGuid();

        [Required]
        public Guid TicketId { get; set; }

        [ForeignKey("TicketId")]
        public Ticket? Ticket { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        [Required]
        [MaxLength(500)]
        public required string FilePath { get; set; }

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}