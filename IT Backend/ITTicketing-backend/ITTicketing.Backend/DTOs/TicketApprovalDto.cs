using System.ComponentModel.DataAnnotations;

namespace ITTicketing.Backend.DTOs
{
    public class TicketApprovalDto
    {
        [Required]
        public int ApproverId { get; set; }

        [Required]
        [StringLength(50)]
        public required string ApprovalStatus { get; set; }

        public string? Comments { get; set; }

        public int? ForwardToUserId { get; set; }
    }
}
