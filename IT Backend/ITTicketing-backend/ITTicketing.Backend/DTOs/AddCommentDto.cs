using System.ComponentModel.DataAnnotations;

namespace ITTicketing.Backend.DTOs
{
    public class AddCommentDto
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        [MinLength(1)]
        public required string CommentText { get; set; }

        public bool IsInternal { get; set; } = false;
    }
}
