import React, { useState } from 'react';
import { useAppState } from '../../contexts/AppStateContext';
import { 
  X, 
  Clock, 
  User, 
  MessageSquare, 
  Paperclip, 
  CheckCircle, 
  XCircle,
  UserPlus,
  Clock as ClockIcon,
  AlertTriangle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const EnhancedTicketModal = ({ ticket, isOpen, onClose }) => {
  const { state, actions } = useAppState();
  const { currentUser } = state;
  const [activeTab, setActiveTab] = useState('details');
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [comment, setComment] = useState('');
  const [hours, setHours] = useState('');
  const [teamMember, setTeamMember] = useState('');

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
      assigned: 'status-pending',
      in_progress: 'status-pending',
      resolved: 'status-approved',
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

  const canPerformAction = (action) => {
    if (!currentUser) return false;
    
    switch (action) {
      case 'assign':
        return ['it_person', 'manager_l1', 'manager_l2', 'coo', 'ceo'].includes(currentUser.role);
      case 'escalate':
        return ['it_person', 'manager_l1', 'manager_l2', 'coo', 'ceo'].includes(currentUser.role);
      case 'resolve':
        return ['it_person', 'manager_l1', 'manager_l2', 'coo', 'ceo'].includes(currentUser.role);
      case 'reject':
        return ['it_person', 'manager_l1', 'manager_l2', 'coo', 'ceo'].includes(currentUser.role);
      case 'close':
        return ['employee', 'it_person', 'manager_l1', 'manager_l2', 'coo', 'ceo'].includes(currentUser.role);
      case 'add_comment':
        return true;
      case 'log_hours':
        return ['it_person', 'manager_l1', 'manager_l2', 'coo', 'ceo'].includes(currentUser.role);
      case 'add_team':
        return ['it_person', 'manager_l1', 'manager_l2', 'coo', 'ceo'].includes(currentUser.role);
      default:
        return false;
    }
  };

  const handleAction = (action) => {
    setActionType(action);
    setShowActionModal(true);
  };

  const confirmAction = () => {
    if (!comment.trim() && ['reject', 'resolve', 'close'].includes(actionType)) {
      alert('Please provide a comment for this action.');
      return;
    }

    switch (actionType) {
      case 'assign':
        actions.assignTicket(ticket.id, teamMember, currentUser.name, comment);
        break;
      case 'escalate':
        actions.escalateTicket(ticket.id, teamMember, currentUser.name, comment);
        break;
      case 'resolve':
        actions.resolveTicket(ticket.id, currentUser.name, comment);
        break;
      case 'reject':
        actions.rejectTicket(ticket.id, currentUser.name, comment);
        break;
      case 'close':
        actions.closeTicket(ticket.id, currentUser.name, comment);
        break;
      case 'add_comment':
        actions.addComment(ticket.id, currentUser.name, comment);
        break;
      case 'log_hours':
        if (!hours || isNaN(hours) || hours <= 0) {
          alert('Please enter valid hours.');
          return;
        }
        actions.logHours(ticket.id, parseFloat(hours), currentUser.name);
        break;
      case 'add_team':
        if (!teamMember.trim()) {
          alert('Please select a team member.');
          return;
        }
        actions.addToTeam(ticket.id, teamMember);
        break;
    }

    setShowActionModal(false);
    setComment('');
    setHours('');
    setTeamMember('');
  };

  const getAvailableUsers = () => {
    return state.users.filter(user => 
      ['it_person', 'manager_l1', 'manager_l2', 'coo', 'ceo'].includes(user.role)
    );
  };

  const renderActionModal = () => {
    if (!showActionModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {actionType === 'assign' && 'Assign Ticket'}
              {actionType === 'escalate' && 'Escalate Ticket'}
              {actionType === 'resolve' && 'Resolve Ticket'}
              {actionType === 'reject' && 'Reject Ticket'}
              {actionType === 'close' && 'Close Ticket'}
              {actionType === 'add_comment' && 'Add Comment'}
              {actionType === 'log_hours' && 'Log Hours'}
              {actionType === 'add_team' && 'Add Team Member'}
            </h3>
          </div>
          
          <div className="p-6 space-y-4">
            {(actionType === 'assign' || actionType === 'escalate' || actionType === 'add_team') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {actionType === 'add_team' ? 'Team Member' : 'Assign To'}
                </label>
                <select
                  value={teamMember}
                  onChange={(e) => setTeamMember(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select User</option>
                  {getAvailableUsers().map(user => (
                    <option key={user.id} value={user.name}>
                      {user.name} ({user.role.replace('_', ' ')})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {actionType === 'log_hours' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hours Logged
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="input-field"
                  placeholder="Enter hours"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comment {['reject', 'resolve', 'close'].includes(actionType) && '*'}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="input-field"
                placeholder="Enter comment..."
                required={['reject', 'resolve', 'close'].includes(actionType)}
              />
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={() => setShowActionModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={confirmAction}
              className="btn-primary"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
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

          <div className="p-6">
            {/* Tab Navigation */}
            <div className="mb-6">
              <nav className="flex space-x-8">
                {[
                  { id: 'details', label: 'Details', icon: User },
                  { id: 'timeline', label: 'Timeline', icon: Clock },
                  { id: 'comments', label: 'Comments', icon: MessageSquare },
                  { id: 'actions', label: 'Actions', icon: CheckCircle }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-3 py-2 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Ticket Header Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <p className="mt-1 text-sm text-gray-900 font-medium">{ticket.title}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Created By</label>
                      <p className="mt-1 text-sm text-gray-900">{ticket.createdBy}</p>
                      <p className="text-xs text-gray-500">{ticket.createdByEmail}</p>
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
                      <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                      <p className="mt-1 text-sm text-gray-900">{ticket.assignedTo || 'Unassigned'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Working Team</label>
                      <div className="mt-1">
                        {ticket.workingTeam.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {ticket.workingTeam.map((member, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {member}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">No team members</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Hours Logged</label>
                      <p className="mt-1 text-sm text-gray-900">{ticket.hoursLogged} / {ticket.estimatedHours}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-900">{ticket.description}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
                <div className="space-y-4">
                  {ticket.historyLog.map((entry, index) => (
                    <div key={entry.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          entry.action === 'Ticket Created' ? 'bg-blue-100' :
                          entry.action === 'Assigned' ? 'bg-green-100' :
                          entry.action === 'Escalated' ? 'bg-yellow-100' :
                          entry.action === 'Resolved' ? 'bg-green-100' :
                          entry.action === 'Rejected' ? 'bg-red-100' :
                          entry.action === 'Closed' ? 'bg-gray-100' :
                          'bg-purple-100'
                        }`}>
                          {entry.action === 'Ticket Created' && <User className="h-4 w-4 text-blue-600" />}
                          {entry.action === 'Assigned' && <UserPlus className="h-4 w-4 text-green-600" />}
                          {entry.action === 'Escalated' && <ArrowUp className="h-4 w-4 text-yellow-600" />}
                          {entry.action === 'Resolved' && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {entry.action === 'Rejected' && <XCircle className="h-4 w-4 text-red-600" />}
                          {entry.action === 'Closed' && <ClockIcon className="h-4 w-4 text-gray-600" />}
                          {entry.action === 'Hours Logged' && <ClockIcon className="h-4 w-4 text-purple-600" />}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">{entry.action}</span> by {entry.user}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">{entry.comment}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(entry.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Comments</h3>
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

            {activeTab === 'actions' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Available Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {canPerformAction('assign') && ticket.status === 'open' && (
                    <button
                      onClick={() => handleAction('assign')}
                      className="btn-primary flex items-center justify-center space-x-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Assign</span>
                    </button>
                  )}
                  
                  {canPerformAction('escalate') && ['assigned', 'in_progress'].includes(ticket.status) && (
                    <button
                      onClick={() => handleAction('escalate')}
                      className="btn-secondary flex items-center justify-center space-x-2"
                    >
                      <ArrowUp className="h-4 w-4" />
                      <span>Escalate</span>
                    </button>
                  )}
                  
                  {canPerformAction('resolve') && ['assigned', 'in_progress'].includes(ticket.status) && (
                    <button
                      onClick={() => handleAction('resolve')}
                      className="btn-success flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Resolve</span>
                    </button>
                  )}
                  
                  {canPerformAction('reject') && ['open', 'assigned', 'in_progress'].includes(ticket.status) && (
                    <button
                      onClick={() => handleAction('reject')}
                      className="btn-danger flex items-center justify-center space-x-2"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                  )}
                  
                  {canPerformAction('close') && ticket.status === 'resolved' && (
                    <button
                      onClick={() => handleAction('close')}
                      className="btn-secondary flex items-center justify-center space-x-2"
                    >
                      <ClockIcon className="h-4 w-4" />
                      <span>Close</span>
                    </button>
                  )}
                  
                  {canPerformAction('add_comment') && (
                    <button
                      onClick={() => handleAction('add_comment')}
                      className="btn-secondary flex items-center justify-center space-x-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Add Comment</span>
                    </button>
                  )}
                  
                  {canPerformAction('log_hours') && (
                    <button
                      onClick={() => handleAction('log_hours')}
                      className="btn-secondary flex items-center justify-center space-x-2"
                    >
                      <ClockIcon className="h-4 w-4" />
                      <span>Log Hours</span>
                    </button>
                  )}
                  
                  {canPerformAction('add_team') && (
                    <button
                      onClick={() => handleAction('add_team')}
                      className="btn-secondary flex items-center justify-center space-x-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Add Team</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {renderActionModal()}
    </>
  );
};

export default EnhancedTicketModal;
