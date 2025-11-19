using ITTicketing.Backend.Data;
using ITTicketing.Backend.DTOs;
using ITTicketing.Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System;
using System.Threading.Tasks;

namespace ITTicketing.Backend.Services
{
    public class TicketService : ITicketService
    {
        private readonly ApplicationDbContext _context;

        public TicketService(ApplicationDbContext context)
        {
            _context = context;
        }

        // --- Core CRUD Operations ---

        public async Task<TicketResponseDto> CreateTicketAsync(TicketCreationDto ticketDto)
        {
            // 1. Validation & System Lookups
            if (string.IsNullOrWhiteSpace(ticketDto.MainIssue) || string.IsNullOrWhiteSpace(ticketDto.SubIssue))
            {
                throw new ArgumentException("Main Issue and Sub Issue cannot be empty.");
            }

            int slaHours = DetermineSlaHours(ticketDto.MainIssue!, ticketDto.SubIssue!);
            string newTicketNumber = await GenerateUniqueTicketNumberAsync();

            var defaultAssignee = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Role!.RoleCode == "IT_PERSON");

            if (defaultAssignee == null)
            {
                throw new InvalidOperationException("System setup error: No default IT person found for assignment.");
            }

            var requester = await _context.Users.FindAsync(ticketDto.RequesterId);
            if (requester == null)
            {
                throw new KeyNotFoundException("Requester ID not found.");
            }

            // 2. Map DTO to Model
            var newTicket = new Ticket
            {
                RequesterId = ticketDto.RequesterId,
                Subject = ticketDto.Subject!,
                Description = ticketDto.Description!,
                MainIssue = ticketDto.MainIssue!,
                SubIssue = ticketDto.SubIssue!,
                Priority = ticketDto.Priority!,
                SlaHours = slaHours,
                TicketNumber = newTicketNumber,
                StatusCode = "NEW",
                AssignedToId = defaultAssignee.UserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };

            // 3. Save to Database
            _context.Tickets.Add(newTicket);
            await _context.SaveChangesAsync();

            // 4. Return Response DTO
            return MapToResponseDto(newTicket, requester, defaultAssignee);
        }

        public async Task<TicketResponseDto?> GetTicketByIdAsync(Guid ticketId)
        {
            var ticket = await GetTicketForResponseMapping(ticketId);

            if (ticket == null) return null;

            return MapToResponseDto(ticket, ticket.Requester, ticket.AssignedTo, ticket.CurrentApprover);
        }

        public async Task<IEnumerable<TicketResponseDto>> GetTicketsByFilterAsync(int userId, string roleCode)
        {
            IQueryable<Ticket> query = _context.Tickets
                .Include(t => t.Requester)
                .Include(t => t.AssignedTo);

            switch (roleCode)
            {
                case "EMPLOYEE":
                    query = query.Where(t => t.RequesterId == userId);
                    break;
                case "IT_PERSON":
                    query = query.Where(t => t.AssignedToId == userId || t.StatusCode == "NEW");
                    break;
                case "L1_MANAGER":
                case "L2_HEAD":
                case "COO":
                    query = query.Where(t => t.CurrentApproverId == userId || t.Requester!.ManagerId == userId);
                    break;
                default:
                    return Enumerable.Empty<TicketResponseDto>();
            }

            var tickets = await query.OrderByDescending(t => t.CreatedAt).ToListAsync();

            return tickets.Select(t => MapToResponseDto(t, t.Requester, t.AssignedTo, t.CurrentApprover)).ToList();
        }


        // --- Workflow Management Implementations ---
                                                                                                                                    
        public async Task<TicketResponseDto> UpdateTicketStatusAsync(Guid ticketId, int userId, string newStatusCode, string? comment = null)
        {
            var ticket = await GetTicketForResponseMapping(ticketId);

            if (ticket == null)
            {
                throw new KeyNotFoundException($"Ticket with ID {ticketId} not found.");
            }

            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null)
            {
                throw new UnauthorizedAccessException("User performing the action not found.");
            }

            var oldStatusCode = ticket.StatusCode;

            if (oldStatusCode == newStatusCode)
            {
                throw new ArgumentException("New status code is the same as the current status.");
            }

            // Apply Status Change
            ticket.StatusCode = newStatusCode;
            ticket.UpdatedAt = DateTime.UtcNow;

            // Handle Closed Statuses
            if (newStatusCode == "RESOLVED" || newStatusCode == "CLOSED")
            {
                if (ticket.ClosedAt == null)
                {
                    ticket.ClosedAt = DateTime.UtcNow;
                }
            }
            else
            {
                ticket.ClosedAt = null;
            }

            // Add Audit Log Entry
            _context.TicketAuditLogs.Add(new TicketAuditLog
            {
                TicketId = ticket.TicketId,
                UserId = userId,
                ActionType = "STATUS_CHANGE",
                OldValue = oldStatusCode,
                NewValue = newStatusCode,
                LoggedAt = DateTime.UtcNow
            });

            // Add Comment (if provided)
            if (!string.IsNullOrWhiteSpace(comment))
            {
                var ticketComment = new TicketComment
                {
                    TicketId = ticket.TicketId,
                    UserId = userId,
                    CommentText = $"Status changed from {oldStatusCode} to {newStatusCode}. Note: {comment}",
                    IsInternal = user.Role!.RoleCode != "EMPLOYEE",
                    CreatedAt = DateTime.UtcNow
                };
                _context.TicketComments.Add(ticketComment);
            }

            await _context.SaveChangesAsync();

            return MapToResponseDto(ticket, ticket.Requester, ticket.AssignedTo, ticket.CurrentApprover);
        }

        public async Task<TicketResponseDto> AssignTicketAsync(Guid ticketId, int changingUserId, int newAssigneeId)
        {
            var ticket = await GetTicketForResponseMapping(ticketId);
            if (ticket == null)
            {
                throw new KeyNotFoundException($"Ticket with ID {ticketId} not found.");
            }

            var newAssignee = await _context.Users.FindAsync(newAssigneeId);
            if (newAssignee == null)
            {
                throw new ArgumentException("New assignee user ID not found.");
            }

            var changingUser = await _context.Users.FindAsync(changingUserId);
            if (changingUser == null)
            {
                throw new UnauthorizedAccessException("User performing the assignment not found.");
            }

            var assigneeRole = await _context.Roles
                .Where(r => r.RoleId == newAssignee.RoleId)
                .Select(r => r.RoleCode)
                .FirstOrDefaultAsync();

            if (assigneeRole != "IT_PERSON" && assigneeRole != "L1_MANAGER")
            {
                throw new ArgumentException("Cannot assign ticket to a user who is not an IT person or Manager.");
            }

            var oldAssigneeName = ticket.AssignedTo?.FullName ?? "Unassigned";

            ticket.AssignedToId = newAssigneeId;
            ticket.UpdatedAt = DateTime.UtcNow;

            if (ticket.StatusCode == "NEW")
            {
                ticket.StatusCode = "WIP";
            }

            _context.TicketAuditLogs.Add(new TicketAuditLog
            {
                TicketId = ticket.TicketId,
                UserId = changingUserId,
                ActionType = "ASSIGNMENT",
                OldValue = oldAssigneeName,
                NewValue = newAssignee.FullName,
                LoggedAt = DateTime.UtcNow
            });

            _context.TicketComments.Add(new TicketComment
            {
                TicketId = ticket.TicketId,
                UserId = changingUserId,
                CommentText = $"Ticket assigned to {newAssignee.FullName}. Status updated to {ticket.StatusCode}.",
                IsInternal = true,
                CreatedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();

            var updatedTicket = await GetTicketForResponseMapping(ticketId);
            return MapToResponseDto(updatedTicket!, updatedTicket!.Requester, updatedTicket!.AssignedTo, updatedTicket!.CurrentApprover);
        }

        public async Task<TicketResponseDto> UpdateTicketPriorityAsync(Guid ticketId, int changingUserId, string newPriority)
        {
            var ticket = await GetTicketForResponseMapping(ticketId);
            if (ticket == null)
            {
                throw new KeyNotFoundException($"Ticket with ID {ticketId} not found.");
            }

            var changingUser = await _context.Users.FindAsync(changingUserId);
            if (changingUser == null)
            {
                throw new UnauthorizedAccessException("User performing the priority change not found.");
            }

            var oldPriority = ticket.Priority;

            if (oldPriority == newPriority)
            {
                throw new ArgumentException("New priority is the same as the current priority.");
            }

            var validPriorities = new List<string> { "LOW", "MEDIUM", "HIGH", "CRITICAL" };
            if (!validPriorities.Contains(newPriority.ToUpper()))
            {
                throw new ArgumentException($"Invalid priority value: {newPriority}.");
            }

            ticket.Priority = newPriority;
            ticket.UpdatedAt = DateTime.UtcNow;

            _context.TicketAuditLogs.Add(new TicketAuditLog
            {
                TicketId = ticket.TicketId,
                UserId = changingUserId,
                ActionType = "PRIORITY_CHANGE",
                OldValue = oldPriority,
                NewValue = newPriority,
                LoggedAt = DateTime.UtcNow
            });

            _context.TicketComments.Add(new TicketComment
            {
                TicketId = ticket.TicketId,
                UserId = changingUserId,
                CommentText = $"Priority changed from {oldPriority} to {newPriority}.",
                IsInternal = true,
                CreatedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();

            return MapToResponseDto(ticket, ticket.Requester, ticket.AssignedTo, ticket.CurrentApprover);
        }

        public async Task<TicketResponseDto> AddCommentAsync(Guid ticketId, AddCommentDto commentDto)
        {
            var ticket = await GetTicketForResponseMapping(ticketId);
            if (ticket == null)
            {
                throw new KeyNotFoundException($"Ticket with ID {ticketId} not found.");
            }

            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserId == commentDto.UserId);
            if (user == null)
            {
                throw new UnauthorizedAccessException("User making the comment not found.");
            }

            bool isUserInternalRole = user.Role!.RoleCode != "EMPLOYEE";
            bool isInternal = commentDto.IsInternal || isUserInternalRole;

            var newComment = new TicketComment
            {
                TicketId = ticket.TicketId,
                UserId = commentDto.UserId,
                CommentText = commentDto.CommentText!,
                IsInternal = isInternal,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.TicketComments.Add(newComment);

            ticket.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return MapToResponseDto(ticket, ticket.Requester, ticket.AssignedTo, ticket.CurrentApprover);
        }

        public async Task<TicketResponseDto> AddAttachmentAsync(Guid ticketId, AddAttachmentDto attachmentDto)
        {
            var ticket = await GetTicketForResponseMapping(ticketId);
            if (ticket == null)
            {
                throw new KeyNotFoundException($"Ticket with ID {ticketId} not found.");
            }

            var newAttachment = new TicketAttachment
            {
                TicketId = ticket.TicketId,
                UserId = attachmentDto.UserId,
                FilePath = attachmentDto.FilePath!,
                UploadedAt = DateTime.UtcNow
            };

            _context.TicketAttachments.Add(newAttachment);

            ticket.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return MapToResponseDto(ticket, ticket.Requester, ticket.AssignedTo, ticket.CurrentApprover);
        }

        public async Task<TicketResponseDto> HandleApprovalAsync(Guid ticketId, TicketApprovalDto approvalDto)
        {
            var ticket = await GetTicketForResponseMapping(ticketId);
            if (ticket == null)
            {
                throw new KeyNotFoundException($"Ticket with ID {ticketId} not found.");
            }

            var approver = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserId == approvalDto.ApproverId);
            if (approver == null)
            {
                throw new UnauthorizedAccessException("Approver user not found.");
            }

            if (approver.Role!.RoleCode != "L1_MANAGER" && approver.Role.RoleCode != "L2_HEAD" && approver.Role.RoleCode != "COO")
            {
                throw new UnauthorizedAccessException("Only managers can perform approval actions.");
            }

            var status = approvalDto.ApprovalStatus.ToUpper();

            int requiredLevel = approver.Role.RoleCode switch
            {
                "L1_MANAGER" => 1,
                "L2_HEAD" => 2,
                "COO" => 3,
                _ => 0
            };

            _context.TicketApprovalLogs.Add(new TicketApprovalLog
            {
                TicketId = ticket.TicketId,
                ApproverId = approvalDto.ApproverId,
                RequiredLevel = requiredLevel,
                ApprovalStatus = status,
                Comments = approvalDto.Comments,
                ActionAt = DateTime.UtcNow
            });

            var oldStatus = ticket.StatusCode;
            string newTicketStatus = ticket.StatusCode;
            string auditAction = "APPROVAL_ACTION";

            if (status == "APPROVED")
            {
                newTicketStatus = "WIP";
                ticket.CurrentApproverId = null;
                auditAction = "APPROVAL_GRANTED";
            }
            else if (status == "REJECTED")
            {
                newTicketStatus = "REJECTED";
                ticket.ClosedAt = DateTime.UtcNow;
                ticket.CurrentApproverId = null;
                auditAction = "APPROVAL_REJECTED";
            }
            else if (status == "FORWARD")
            {
                if (!approvalDto.ForwardToUserId.HasValue)
                {
                    throw new ArgumentException("Forward action requires a 'ForwardToUserId'.");
                }

                var forwardUser = await _context.Users.FindAsync(approvalDto.ForwardToUserId.Value);
                if (forwardUser == null)
                {
                    throw new ArgumentException("User to forward the ticket to was not found.");
                }

                ticket.CurrentApproverId = approvalDto.ForwardToUserId.Value;
                newTicketStatus = "PENDING_MGR";
                auditAction = "APPROVAL_FORWARDED";
            }

            ticket.StatusCode = newTicketStatus;
            ticket.UpdatedAt = DateTime.UtcNow;

            _context.TicketAuditLogs.Add(new TicketAuditLog
            {
                TicketId = ticket.TicketId,
                UserId = approvalDto.ApproverId,
                ActionType = auditAction,
                OldValue = $"Previous Status: {oldStatus}",
                NewValue = status == "FORWARD" ? $"Forwarded to User ID {ticket.CurrentApproverId}" : $"New Status: {newTicketStatus}",
                LoggedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();

            return MapToResponseDto(ticket, ticket.Requester, ticket.AssignedTo, ticket.CurrentApprover);
        }


        // --- Helper Methods ---

        private async Task<Ticket?> GetTicketForResponseMapping(Guid ticketId)
        {
            return await _context.Tickets
                .Include(t => t.Requester)
                .Include(t => t.AssignedTo)
                .Include(t => t.CurrentApprover)
                .FirstOrDefaultAsync(t => t.TicketId == ticketId);
        }

        private int DetermineSlaHours(string mainIssue, string subIssue)
        {
            if (mainIssue == "Hardware" && subIssue == "Laptop") return 8;
            if (mainIssue == "Network" && subIssue == "No Connectivity") return 4;
            if (mainIssue == "Account" && subIssue == "Password Reset") return 1;
            return 24;
        }

        private async Task<string> GenerateUniqueTicketNumberAsync()
        {
            var latestTicketNumber = await _context.Tickets
                .OrderByDescending(t => t.TicketNumber)
                .Select(t => t.TicketNumber)
                .FirstOrDefaultAsync();

            int sequentialNumber = 1;
            if (!string.IsNullOrEmpty(latestTicketNumber) && latestTicketNumber.Length > 5)
            {
                var last = latestTicketNumber.Split('-').Last();
                if (int.TryParse(last, out int lastNumber))
                {
                    sequentialNumber = lastNumber + 1;
                }
            }

            return $"IT-{DateTime.UtcNow.Year}-{sequentialNumber:D5}";
        }

        private TicketResponseDto MapToResponseDto(Ticket ticket, User? requester, User? assignedTo = null, User? currentApprover = null)
        {
            // Map with null-safety (use sensible defaults when navigation props are missing)
            return new TicketResponseDto
            {
                TicketId = ticket.TicketId,
                TicketNumber = ticket.TicketNumber ?? string.Empty,

                RequesterId = ticket.RequesterId,
                RequesterFullName = requester?.FullName ?? "Unknown Requester",

                Subject = ticket.Subject ?? string.Empty,
                Description = ticket.Description ?? string.Empty,

                MainIssue = ticket.MainIssue ?? string.Empty,
                SubIssue = ticket.SubIssue ?? string.Empty,
                SlaHours = ticket.SlaHours,

                Priority = ticket.Priority ?? "UNKNOWN",
                StatusCode = ticket.StatusCode ?? "UNKNOWN",

                AssignedToId = ticket.AssignedToId,
                AssignedToName = assignedTo?.FullName,

                CurrentApproverId = ticket.CurrentApproverId,

                CreatedAt = ticket.CreatedAt,
                UpdatedAt = ticket.UpdatedAt
            };
        }
    }
}
