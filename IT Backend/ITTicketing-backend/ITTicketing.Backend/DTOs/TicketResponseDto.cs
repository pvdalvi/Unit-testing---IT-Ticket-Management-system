namespace ITTicketing.Backend.DTOs
{
    public class TicketResponseDto
    {
        public Guid TicketId { get; set; }
        public required string TicketNumber { get; set; }
        public int RequesterId { get; set; }
        public required string RequesterFullName { get; set; }
        public required string Subject { get; set; }
        public required string Description { get; set; }
        public required string MainIssue { get; set; }
        public required string SubIssue { get; set; }
        public int SlaHours { get; set; }
        public required string Priority { get; set; }
        public required string StatusCode { get; set; }
        public int? AssignedToId { get; set; }
        public string? AssignedToName { get; set; }
        public int? CurrentApproverId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
