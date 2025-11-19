using System.ComponentModel.DataAnnotations;

namespace ITTicketing.Backend.DTOs
{
    public class TicketCreationDto
    {
        [Required]
        public int RequesterId { get; set; }

        [Required]
        [StringLength(255)]
        public required string Subject { get; set; }

        [Required]
        public required string Description { get; set; }

        [Required]
        [StringLength(100)]
        public required string MainIssue { get; set; }

        [Required]
        [StringLength(100)]
        public required string SubIssue { get; set; }

        [Required]
        [StringLength(50)]
        public required string Priority { get; set; }
    }
}
