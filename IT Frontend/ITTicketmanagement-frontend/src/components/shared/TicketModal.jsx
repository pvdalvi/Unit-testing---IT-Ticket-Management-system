import React from 'react';
import { X, Clock, User, MessageSquare, Paperclip, CheckCircle, XCircle } from 'lucide-react';

const TicketModal = ({ ticket, isOpen, onClose, onApprove, onReject, showActions = false }) => {
  if (!isOpen || !ticket) return null;

  const getPriorityBadge = (priority) => {
    const classes = {
      high: 'priority-high',
      medium: 'priority-medium',
      low: 'priority-low'
    };
    return (
      <span className={`status-badge ${classes[priority] || 'priority-medium'}`}>
        {priority?.toUpperCase()}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const classes = {
      open: 'status-open',
      pending: 'status-pending',
      approved: 'status-approved',
      rejected: 'status-rejected',
      closed: 'status-closed'
    };
    return (
      <span className={`status-badge ${classes[status] || 'status-open'}`}>
        {status?.toUpperCase()}
      </span>
    );
  };

  const getSLAStatusBadge = (slaStatus) => {
    const classes = {
      'on-track': 'bg-green-100 text-green-800',
      'at-risk': 'bg-yellow-100 text-yellow-800',
      'breached': 'bg-red-100 text-red-800'
    };
    return (
      <span className={`status-badge ${classes[slaStatus] || 'bg-gray-100 text-gray-800'}`}>
        {slaStatus?.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Ticket Details - {ticket.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Ticket Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Employee</label>
                <p className="mt-1 text-sm text-gray-900">{ticket.employee}</p>
                <p className="text-xs text-gray-500">{ticket.employeeEmail}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <p className="mt-1 text-sm text-gray-900">{ticket.department}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <p className="mt-1 text-sm text-gray-900">{ticket.category}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subcategory</label>
                <p className="mt-1 text-sm text-gray-900">{ticket.subcategory}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <div className="mt-1">{getPriorityBadge(ticket.priority)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">{getStatusBadge(ticket.status)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">SLA Status</label>
                <div className="mt-1">{getSLAStatusBadge(ticket.slaStatus)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Assigned L1</label>
                <p className="mt-1 text-sm text-gray-900">{ticket.assignedL1 || 'Unassigned'}</p>
              </div>
              {ticket.assignedL2 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assigned L2</label>
                  <p className="mt-1 text-sm text-gray-900">{ticket.assignedL2}</p>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-900">{ticket.description}</p>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Timeline
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Ticket Created</span> by {ticket.employee}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(ticket.dateCreated).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              
              {ticket.lastUpdated !== ticket.dateCreated && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Last Updated</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(ticket.lastUpdated).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comments */}
          {ticket.comments && ticket.comments.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Comments
              </h3>
              <div className="space-y-4">
                {ticket.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-gray-900">{comment.author}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Paperclip className="h-5 w-5 mr-2" />
                Attachments
              </h3>
              <div className="space-y-2">
                {ticket.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                    <Paperclip className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-900">{attachment.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="btn-secondary"
              >
                Close
              </button>
              {onReject && (
                <button
                  onClick={() => onReject(ticket)}
                  className="btn-danger flex items-center space-x-2"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Reject</span>
                </button>
              )}
              {onApprove && (
                <button
                  onClick={() => onApprove(ticket)}
                  className="btn-success flex items-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Approve</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketModal;

