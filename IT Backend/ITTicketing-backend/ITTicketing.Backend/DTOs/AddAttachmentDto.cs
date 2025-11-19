using System.ComponentModel.DataAnnotations;

namespace ITTicketing.Backend.DTOs
{
    public class AddAttachmentDto
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        [StringLength(500)]
        public required string FilePath { get; set; }
    }
}
