import React, { useState, useMemo } from 'react';
import { useAppState } from '../../contexts/AppStateContext';
import Header from '../shared/Header';
import api from "../../Connection/Api";
import Sidebar from '../shared/Sidebar';
import TicketTable from '../shared/TicketTable';
import EnhancedTicketModal from '../shared/EnhancedTicketModal';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  Download,
  FileText,
  BarChart3
} from 'lucide-react';

const CEODashboard = () => {
  const { state, actions } = useAppState();
  const { currentUser: user, tickets, filters } = state;
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // ✅ FIX: Added definition for notifications to prevent ReferenceError
  const notifications = []; // you can later replace with real notification data if needed

  // Apply filters
  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const departmentMatch = !filters.department || 
        ticket.department.toLowerCase().includes(filters.department.toLowerCase());
      
      const statusMatch = !filters.status || 
        ticket.status.toLowerCase().includes(filters.status.toLowerCase());
      
      const priorityMatch = !filters.priority || 
        ticket.priority.toLowerCase().includes(filters.priority.toLowerCase());
      
      const dateMatch = !filters.date || 
        new Date(ticket.dateCreated).toLocaleDateString().includes(filters.date);
      
      return departmentMatch && statusMatch && priorityMatch && dateMatch;
    });
  }, [filters]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalTickets = tickets.length;
    const pendingTickets = tickets.filter(t => t.status === 'pending' || t.status === 'open').length;
    const closedTickets = tickets.filter(t => t.status === 'closed').length;
    const breachedTickets = tickets.filter(t => t.slaStatus === 'breached').length;
    const slaCompliance = Math.round(((totalTickets - breachedTickets) / totalTickets) * 100);

    return [
      {
        title: 'Total Tickets',
        value: totalTickets,
        icon: Users,
        trend: 'up',
        trendValue: '+15 this week'
      },
      {
        title: 'Pending Tickets',
        value: pendingTickets,
        icon: Clock,
        trend: pendingTickets > 20 ? 'up' : 'down',
        trendValue: pendingTickets > 20 ? 'High workload' : 'Manageable'
      },
      {
        title: 'Closed Tickets',
        value: closedTickets,
        icon: CheckCircle,
        trend: 'up',
        trendValue: `${Math.round((closedTickets / totalTickets) * 100)}% resolved`
      },
      {
        title: 'SLA Compliance',
        value: `${slaCompliance}%`,
        icon: AlertTriangle,
        trend: slaCompliance > 90 ? 'up' : 'down',
        trendValue: slaCompliance > 90 ? 'Excellent' : 'Needs attention'
      }
    ];
  }, []);

  // Department-wise SLA data
  const departmentSLA = useMemo(() => {
    const departments = [...new Set(tickets.map(t => t.department))];
    return departments.map(dept => {
      const deptTickets = tickets.filter(t => t.department === dept);
      const breached = deptTickets.filter(t => t.slaStatus === 'breached').length;
      const avgClosureTime = "2.3 days"; // This would be calculated from actual data
      
      return {
        department: dept,
        totalTickets: deptTickets.length,
        breachedTickets: breached,
        avgClosureTime,
        slaCompliance: Math.round(((deptTickets.length - breached) / deptTickets.length) * 100)
      };
    });
  }, []);

  const overviewColumns = [
    { key: 'id', label: 'Ticket ID', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'subcategory', label: 'Issue Type', sortable: true },
    { key: 'priority', label: 'Priority', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'assignedL1', label: 'Assigned Level', sortable: true },
    { key: 'slaStatus', label: 'SLA Status', sortable: true },
    { key: 'lastUpdated', label: 'Last Updated', sortable: true }
  ];

  const approvalColumns = [
    { key: 'id', label: 'Ticket ID', sortable: true },
    { key: 'employee', label: 'Raised By', sortable: true },
    { key: 'assignedL1', label: 'Current Handler', sortable: true },
    { key: 'subcategory', label: 'Summary', sortable: true }
  ];

  const handleFilterChange = (key, value) => {
    actions.updateFilters({ [key]: value });
  };

  const handleSort = (field, direction) => {
    console.log('Sort by:', field, direction);
  };

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const handleApprove = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const handleReject = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const handleModalApprove = (ticket) => {
    console.log('Approving ticket:', ticket.id);
    alert(`Ticket ${ticket.id} approved successfully!`);
    setShowTicketModal(false);
  };

  const handleModalReject = (ticket) => {
    console.log('Rejecting ticket:', ticket.id);
    alert(`Ticket ${ticket.id} rejected.`);
    setShowTicketModal(false);
  };

  const handleExport = (format) => {
    console.log(`Exporting data as ${format}`);
    alert(`Data exported as ${format.toUpperCase()} successfully!`);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.title} className="card p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{kpi.trendValue}</p>
                </div>
                <div className="p-3 rounded-full bg-coo-primary bg-opacity-10 hover:bg-opacity-20 transition-all duration-300">
                  <Icon className="h-6 w-6 text-coo-primary" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ticket Overview Table */}
      <TicketTable
        tickets={filteredTickets}
        columns={overviewColumns}
        filters={filters}
        onFilterChange={handleFilterChange}
        onSort={handleSort}
        onViewDetails={handleViewDetails}
        showActions={false}
      />
    </div>
  );

  const renderApprovalQueue = () => {
    const pendingTickets = tickets.filter(t => t.status === 'pending' || t.status === 'open');
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Approval Queue</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => handleExport('pdf')}
              className="btn-secondary flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <TicketTable
          tickets={pendingTickets}
          columns={approvalColumns}
          filters={{}}
          onFilterChange={() => {}}
          onSort={handleSort}
          onViewDetails={handleViewDetails}
          onApprove={handleApprove}
          onReject={handleReject}
          showActions={true}
        />
      </div>
    );
  };

  const renderSLACompliance = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">SLA & Performance Summary</h3>
      
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Department</th>
                <th className="table-header">Total Tickets</th>
                <th className="table-header">SLA Compliance</th>
                <th className="table-header">Avg Closure Time</th>
                <th className="table-header">Tickets Breached</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departmentSLA.map((dept) => (
                <tr key={dept.department} className="hover:bg-gray-50">
                  <td className="table-cell font-medium">{dept.department}</td>
                  <td className="table-cell">{dept.totalTickets}</td>
                  <td className="table-cell">
                    <span className={`status-badge ${
                      dept.slaCompliance >= 90 ? 'bg-green-100 text-green-800' :
                      dept.slaCompliance >= 80 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {dept.slaCompliance}%
                    </span>
                  </td>
                  <td className="table-cell">{dept.avgClosureTime}</td>
                  <td className="table-cell">
                    <span className={`status-badge ${
                      dept.breachedTickets === 0 ? 'bg-green-100 text-green-800' :
                      dept.breachedTickets <= 2 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {dept.breachedTickets}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Reports & Metrics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Resolution Time</span>
              <span className="font-semibold">{kpiData.avgClosureTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">SLA Compliance Rate</span>
              <span className="font-semibold">{kpiData.slaCompliance}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Tickets Processed</span>
              <span className="font-semibold">{kpiData.totalTickets}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tickets Breached SLA</span>
              <span className="font-semibold text-red-600">{kpiData.ticketsBreached}</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h4>
          <div className="space-y-3">
            <button
              onClick={() => handleExport('pdf')}
              className="w-full btn-secondary flex items-center justify-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Generate Report</span>
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="w-full btn-secondary flex items-center justify-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Header 
          title="Welcome, Minan" 
          showNotifications={true}
          notifications={notifications.slice(0, 3)} // ✅ now defined safely
        />
        
        <main className="p-6">
          {/* Tab Navigation */}
          <div className="mb-6">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Dashboard Overview', icon: BarChart3 },
                { id: 'approvals', label: 'Approval Queue', icon: CheckCircle },
                { id: 'sla', label: 'SLA Compliance', icon: AlertTriangle },
                { id: 'reports', label: 'Reports & Metrics', icon: TrendingUp }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-3 py-2 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-coo-primary text-coo-primary'
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
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'approvals' && renderApprovalQueue()}
          {activeTab === 'sla' && renderSLACompliance()}
          {activeTab === 'reports' && renderReports()}
        </main>
      </div>

      {/* Ticket Modal */}
      <EnhancedTicketModal
        ticket={selectedTicket}
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
      />
    </div>
  );
};

export default CEODashboard;
