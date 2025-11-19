    using System.ComponentModel.DataAnnotations;

    namespace ITTicketing.Backend.DTOs
    {
    public class TicketUpdatePriorityDto
    {
        [Required]
        public int ChangingUserId { get; set; }

        [Required]
        [StringLength(50)]
        public required string NewPriority { get; set; }
    }
}
