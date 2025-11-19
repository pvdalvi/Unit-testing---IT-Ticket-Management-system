import React, { useState, useMemo } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Filter, 
  RotateCcw,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';

const TicketTable = ({ 
  tickets, 
  columns, 
  filters, 
  onFilterChange, 
  onSort, 
  onViewDetails, 
  onApprove, 
  onReject,
  showActions = false 
}) => {
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    onSort(field, sortDirection);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

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

  const resetFilters = () => {
    Object.keys(filters).forEach(key => {
      onFilterChange(key, '');
    });
  };

  return (
    <div className="card">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Tickets</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
            <button
              onClick={resetFilters}
              className="btn-secondary flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(filters).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onFilterChange(key, e.target.value)}
                  className="input-field"
                  placeholder={`Filter by ${key}`}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="table-header cursor-pointer hover:bg-gray-100"
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
              {showActions && (
                <th className="table-header">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="table-cell">
                    {column.key === 'priority' ? getPriorityBadge(ticket[column.key]) :
                     column.key === 'status' ? getStatusBadge(ticket[column.key]) :
                     column.key === 'dateCreated' ? new Date(ticket[column.key]).toLocaleDateString() :
                     column.key === 'lastUpdated' ? new Date(ticket[column.key]).toLocaleDateString() :
                     ticket[column.key]}
                  </td>
                ))}
                {showActions && (
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onViewDetails(ticket)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {onApprove && (
                        <button
                          onClick={() => onApprove(ticket)}
                          className="text-green-600 hover:text-green-800 p-1"
                          title="Approve"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      {onReject && (
                        <button
                          onClick={() => onReject(ticket)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Reject"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {tickets.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No tickets found
        </div>
      )}
    </div>
  );
};

export default TicketTable;

