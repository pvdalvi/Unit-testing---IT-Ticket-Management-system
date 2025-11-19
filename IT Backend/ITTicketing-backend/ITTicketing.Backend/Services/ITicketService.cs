using ITTicketing.Backend.DTOs;

namespace ITTicketing.Backend.Services
{
    public interface ITicketService
    {
        // --- Core CRUD Operations ---

        /// <summary>
        /// Creates a new ticket from an employee request.
        /// Handles unique ticket number generation, initial status, and SLA assignment.
        /// </summary>
        Task<TicketResponseDto> CreateTicketAsync(TicketCreationDto ticketDto);

        /// <summary>
        /// Retrieves a single ticket and all its related details (requester, assignee, comments, etc.).
        /// </summary>
        Task<TicketResponseDto?> GetTicketByIdAsync(Guid ticketId);

        /// <summary>
        /// Retrieves a list of tickets based on user role and filters (e.g., all tickets requested by a user, 
        /// or all tickets assigned to an IT Person).
        /// </summary>
        Task<IEnumerable<TicketResponseDto>> GetTicketsByFilterAsync(int userId, string roleCode);


        // --- Workflow Management Operations ---

        /// <summary>
        /// Updates the status code (e.g., NEW to WIP, RESOLVED to CLOSED) and logs the change.
        /// </summary>
        Task<TicketResponseDto> UpdateTicketStatusAsync(Guid ticketId, int userId, string newStatusCode, string? comment = null);

        /// <summary>
        /// Handles assignment to an IT Person or team lead.
        /// </summary>
        Task<TicketResponseDto> AssignTicketAsync(Guid ticketId, int changingUserId, int newAssigneeId);

        /// <summary>
        /// Handles priority change (usually done by IT or Manager).
        /// </summary>
        Task<TicketResponseDto> UpdateTicketPriorityAsync(Guid ticketId, int changingUserId, string newPriority);

        /// <summary>
        /// Allows a user to add a comment or note (internal/external) to a ticket.
        /// </summary>
        Task<TicketResponseDto> AddCommentAsync(Guid ticketId, AddCommentDto commentDto);

        /// <summary>
        /// Records the path/URL of a file attachment for a ticket.
        /// </summary>
        Task<TicketResponseDto> AddAttachmentAsync(Guid ticketId, AddAttachmentDto attachmentDto);

        /// <summary>
        /// Handles the manager approval/rejection process.
        /// </summary>
        Task<TicketResponseDto> HandleApprovalAsync(Guid ticketId, TicketApprovalDto approvalDto);
    }
}
