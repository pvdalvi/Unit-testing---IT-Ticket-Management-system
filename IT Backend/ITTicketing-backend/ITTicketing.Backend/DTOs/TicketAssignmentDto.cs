using System.ComponentModel.DataAnnotations;

namespace ITTicketing.Backend.DTOs
{
    public class TicketAssignmentDto
    {
        [Required]
        public int ChangingUserId { get; set; }

        [Required]
        public int NewAssigneeId { get; set; }
    }

}
