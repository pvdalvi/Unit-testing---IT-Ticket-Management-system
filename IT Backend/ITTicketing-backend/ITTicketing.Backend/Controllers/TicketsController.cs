using ITTicketing.Backend.DTOs;
using ITTicketing.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace ITTicketing.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketsController : ControllerBase
    {
        private readonly ITicketService _ticketService;

        public TicketsController(ITicketService ticketService)
        {
            _ticketService = ticketService;
        }

        // --- 1. POST: Create Ticket (Employee Action) ---

        /// <summary>
        /// Endpoint for an employee to create a new support ticket.
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<TicketResponseDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateTicket([FromBody] TicketCreationDto ticketDto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<TicketResponseDto>.ErrorResponse("Validation failed.", StatusCodes.Status400BadRequest, errors));
            }

            try
            {
                var newTicket = await _ticketService.CreateTicketAsync(ticketDto);

                var response = ApiResponse<TicketResponseDto>.SuccessResponse(
                    newTicket,
                    $"Ticket {newTicket.TicketNumber} created successfully and assigned to IT.",
                    StatusCodes.Status201Created
                );

                // Use CreatedAtAction for HTTP 201 response
                return CreatedAtAction(
                    nameof(GetTicketById),
                    new { ticketId = newTicket.TicketId },
                    response
                );
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ApiResponse<TicketResponseDto>.ErrorResponse(ex.Message, StatusCodes.Status400BadRequest));
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ApiResponse<TicketResponseDto>.ErrorResponse($"System error: {ex.Message}", StatusCodes.Status500InternalServerError));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResponse<TicketResponseDto>.ErrorResponse(ex.Message, StatusCodes.Status404NotFound));
            }
        }

        // --- 2. GET: Get Ticket By ID ---

        /// <summary>
        /// Retrieves a single ticket by its unique ID.
        /// </summary>
        [HttpGet("{ticketId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<TicketResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetTicketById(Guid ticketId)
        {
            var ticket = await _ticketService.GetTicketByIdAsync(ticketId);

            if (ticket == null)
            {
                return NotFound(ApiResponse<TicketResponseDto>.ErrorResponse($"Ticket ID {ticketId} not found.", StatusCodes.Status404NotFound));
            }

            return Ok(ApiResponse<TicketResponseDto>.SuccessResponse(ticket));
        }

        // --- 3. GET: Filtered Ticket List ---

        /// <summary>
        /// Retrieves a list of tickets filtered by user context (e.g., Assigned, Requested, or Pending Approval).
        /// Note: Requires both UserId and RoleCode to determine view permissions.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<TicketResponseDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetTickets([FromQuery] int userId, [FromQuery] string roleCode)
        {
            if (userId <= 0 || string.IsNullOrWhiteSpace(roleCode))
            {
                return BadRequest(ApiResponse<object>.ErrorResponse("UserId and RoleCode are required query parameters.", StatusCodes.Status400BadRequest));
            }

            try
            {
                var tickets = await _ticketService.GetTicketsByFilterAsync(userId, roleCode.ToUpper());

                return Ok(ApiResponse<IEnumerable<TicketResponseDto>>.SuccessResponse(tickets));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ApiResponse<object>.ErrorResponse(
                    "Error fetching tickets.", StatusCodes.Status500InternalServerError, new List<string> { ex.Message }
                ));
            }
        }

        // --- 4. PUT: Update Ticket Status (IT/Manager Action) ---

        /// <summary>
        /// Allows IT or Manager to update the status of an existing ticket (e.g., WIP, RESOLVED).
        /// </summary>
        [HttpPut("{ticketId:guid}/status")]
        [ProducesResponseType(typeof(ApiResponse<TicketResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateStatus(Guid ticketId, [FromBody] TicketUpdateStatusDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse("Validation failed.", StatusCodes.Status400BadRequest));
            }

            try
            {
                var updatedTicket = await _ticketService.UpdateTicketStatusAsync(
                    ticketId,
                    dto.UserId,
                    dto.NewStatusCode.ToUpper(),
                    dto.Comment
                );

                return Ok(ApiResponse<TicketResponseDto>.SuccessResponse(
                    updatedTicket,
                    $"Ticket {updatedTicket.TicketNumber} status updated to {updatedTicket.StatusCode}.",
                    StatusCodes.Status200OK
                ));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<object>.ErrorResponse($"Ticket or User not found.", StatusCodes.Status404NotFound));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message, StatusCodes.Status400BadRequest));
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, ApiResponse<object>.ErrorResponse(ex.Message, StatusCodes.Status403Forbidden));
            }
        }

        // --- 5. PUT: Assign Ticket (IT Lead/Manager Action) ---

        /// <summary>
        /// Allows an IT Lead or Manager to assign the ticket to a specific IT Person.
        /// </summary>
        [HttpPut("{ticketId:guid}/assign")]
        [ProducesResponseType(typeof(ApiResponse<TicketResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> AssignTicket(Guid ticketId, [FromBody] TicketAssignmentDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse("Validation failed.", StatusCodes.Status400BadRequest));
            }

            try
            {
                var updatedTicket = await _ticketService.AssignTicketAsync(
                    ticketId,
                    dto.ChangingUserId,
                    dto.NewAssigneeId
                );

                return Ok(ApiResponse<TicketResponseDto>.SuccessResponse(
                    updatedTicket,
                    $"Ticket {updatedTicket.TicketNumber} successfully assigned.",
                    StatusCodes.Status200OK
                ));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<object>.ErrorResponse($"Ticket or User not found.", StatusCodes.Status404NotFound));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message, StatusCodes.Status400BadRequest));
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, ApiResponse<object>.ErrorResponse(ex.Message, StatusCodes.Status403Forbidden));
            }
        }

        // --- 6. PUT: Update Ticket Priority (IT/Manager Action) ---

        /// <summary>
        /// Allows IT or Manager to change the priority of an existing ticket.
        /// </summary>
        [HttpPut("{ticketId:guid}/priority")]
        [ProducesResponseType(typeof(ApiResponse<TicketResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdatePriority(Guid ticketId, [FromBody] TicketUpdatePriorityDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse("Validation failed.", StatusCodes.Status400BadRequest));
            }

            try
            {
                var updatedTicket = await _ticketService.UpdateTicketPriorityAsync(
                    ticketId,
                    dto.ChangingUserId,
                    dto.NewPriority.ToUpper()
                );

                return Ok(ApiResponse<TicketResponseDto>.SuccessResponse(
                    updatedTicket,
                    $"Ticket {updatedTicket.TicketNumber} priority updated to {updatedTicket.Priority}.",
                    StatusCodes.Status200OK
                ));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<object>.ErrorResponse($"Ticket or User not found.", StatusCodes.Status404NotFound));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message, StatusCodes.Status400BadRequest));
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, ApiResponse<object>.ErrorResponse(ex.Message, StatusCodes.Status403Forbidden));
            }
        }


        // --- 7. POST: Add Comment to Ticket ---

        /// <summary>
        /// Allows any user to add a comment or note to an existing ticket.
        /// </summary>
        [HttpPost("{ticketId:guid}/comments")]
        [ProducesResponseType(typeof(ApiResponse<TicketResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> AddComment(Guid ticketId, [FromBody] AddCommentDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse("Validation failed.", StatusCodes.Status400BadRequest));
            }

            try
            {
                var updatedTicket = await _ticketService.AddCommentAsync(ticketId, dto);

                return Ok(ApiResponse<TicketResponseDto>.SuccessResponse(
                    updatedTicket,
                    "Comment added successfully.",
                    StatusCodes.Status200OK
                ));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<object>.ErrorResponse($"Ticket or User not found.", StatusCodes.Status404NotFound));
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, ApiResponse<object>.ErrorResponse(ex.Message, StatusCodes.Status403Forbidden));
            }
        }

        // --- 8. POST: Add Attachment to Ticket ---

        /// <summary>
        /// Records the path/URL of a file attachment for a ticket.
        /// </summary>
        [HttpPost("{ticketId:guid}/attachments")]
        [ProducesResponseType(typeof(ApiResponse<TicketResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> AddAttachment(Guid ticketId, [FromBody] AddAttachmentDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse("Validation failed.", StatusCodes.Status400BadRequest));
            }

            try
            {
                var updatedTicket = await _ticketService.AddAttachmentAsync(ticketId, dto);

                return Ok(ApiResponse<TicketResponseDto>.SuccessResponse(
                    updatedTicket,
                    "Attachment recorded successfully.",
                    StatusCodes.Status200OK
                ));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<object>.ErrorResponse($"Ticket or User not found.", StatusCodes.Status404NotFound));
            }
        }

        // --- 9. POST: Handle Manager Approval (Approval/Reject/Forward) ---

        /// <summary>
        /// Handles manager actions: approving, rejecting, or forwarding a ticket.
        /// </summary>
        [HttpPost("{ticketId:guid}/approval")]
        [ProducesResponseType(typeof(ApiResponse<TicketResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> HandleApproval(Guid ticketId, [FromBody] TicketApprovalDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse("Validation failed.", StatusCodes.Status400BadRequest));
            }

            try
            {
                var updatedTicket = await _ticketService.HandleApprovalAsync(
                    ticketId,
                    dto
                );

                return Ok(ApiResponse<TicketResponseDto>.SuccessResponse(
                    updatedTicket,
                    $"Approval action '{dto.ApprovalStatus}' recorded successfully.",
                    StatusCodes.Status200OK
                ));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<object>.ErrorResponse($"Ticket or User not found.", StatusCodes.Status404NotFound));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message, StatusCodes.Status400BadRequest));
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, ApiResponse<object>.ErrorResponse(ex.Message, StatusCodes.Status403Forbidden));
            }
        }
    }
}
