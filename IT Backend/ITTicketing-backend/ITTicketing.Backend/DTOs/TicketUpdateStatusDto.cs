using System.ComponentModel.DataAnnotations;

namespace ITTicketing.Backend.DTOs
{
    public class TicketUpdateStatusDto
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        [StringLength(50)]
        public required string NewStatusCode { get; set; }

        public string? Comment { get; set; }
    }
}
