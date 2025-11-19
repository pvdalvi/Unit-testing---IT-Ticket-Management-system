import React, { useState, useMemo } from 'react';

  
import { useLocation } from 'react-router-dom';
import api from "../../Connection/Api";
import { useAppState } from '../../contexts/AppStateContext';
import Header from '../shared/Header';
import Sidebar from '../shared/Sidebar';
import TicketTable from '../shared/TicketTable';
import EnhancedTicketModal from '../shared/EnhancedTicketModal';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  BarChart3, 
  Download,
  Plus,
  Search,
  Filter,
  Eye,
  Settings,
  User,
  Bell,
  TrendingUp,
  Target
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export const getStatusColor = (status) => {
  switch ((status || '').toString()) {
    case 'New': return 'bg-orange-100 text-orange-800';
    case 'Open': return 'bg-yellow-100 text-yellow-800';
    case 'In Progress': return 'bg-blue-100 text-blue-800';
    case 'Solved': return 'bg-green-100 text-green-800';
    case 'Closed': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getPriorityColor = (priority) => {
  switch ((priority || '').toString().toLowerCase()) {
    case 'high': return 'text-red-600';
    case 'medium': return 'text-yellow-600';
    case 'low': return 'text-green-600';
    default: return 'text-gray-600';
  }
};

const ManagerL1Dashboard = () => {
  const { state, actions } = useAppState();
  const { currentUser: user, tickets, filters } = state;
  const location = useLocation();
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Get all tickets for L1 manager
  const allTickets = useMemo(() => {
    return tickets;
  }, [tickets]);

  // Apply filters
  const filteredTickets = useMemo(() => {
    return allTickets.filter(ticket => {
      const searchMatch = !searchTerm || 
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());
      
      const departmentMatch = departmentFilter === 'All Departments' || 
        ticket.department === departmentFilter;
      
      const statusMatch = statusFilter === 'All Status' || 
        ticket.status === statusFilter;
      
      return searchMatch && departmentMatch && statusMatch;
    });
  }, [allTickets, searchTerm, departmentFilter, statusFilter]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalTickets = allTickets.length;
    const openTickets = allTickets.filter(t => t.status === 'Open' || t.status === 'New').length;
    const inProgressTickets = allTickets.filter(t => t.status === 'In Progress').length;
    const resolvedTickets = allTickets.filter(t => t.status === 'Solved' || t.status === 'Closed').length;
    const avgResolution = "2.3h";

    return [
      {
        title: 'Total Tickets',
        value: totalTickets,
        icon: FileText,
        color: 'bg-blue-100',
        iconColor: 'text-blue-600',
        trend: '+12%',
        trendColor: 'text-green-600'
      },
      {
        title: 'Open Tickets',
        value: openTickets,
        icon: Clock,
        color: 'bg-orange-100',
        iconColor: 'text-orange-600',
        trend: '+3',
        trendColor: 'text-red-600'
      },
      {
        title: 'In Progress',
        value: inProgressTickets,
        icon: AlertTriangle,
        color: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        trend: 'Stable',
        trendColor: 'text-gray-600'
      },
      {
        title: 'Avg Resolution',
        value: avgResolution,
        icon: CheckCircle,
        color: 'bg-green-100',
        iconColor: 'text-green-600',
        trend: '-0.5h',
        trendColor: 'text-green-600'
      }
    ];
  }, [allTickets]);

  // Category distribution data
  const categoryData = useMemo(() => {
    const categoryCounts = allTickets.reduce((acc, ticket) => {
      acc[ticket.category] = (acc[ticket.category] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / allTickets.length) * 100)
    }));
  }, [allTickets]);

  // Priority distribution data
  const priorityData = useMemo(() => {
    const priorityCounts = allTickets.reduce((acc, ticket) => {
      acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(priorityCounts).map(([priority, count]) => ({
      priority: priority.charAt(0).toUpperCase() + priority.slice(1),
      count,
      color: priority === 'high' ? '#EF4444' : priority === 'medium' ? '#F59E0B' : '#10B981'
    }));
  }, [allTickets]);

  // Team performance data
  const teamPerformanceData = useMemo(() => {
    return [
      {
        name: 'Rahul',
        tickets: 15,
        resolved: 12,
        performance: 85,
        slaCompliance: 92
      },
      {
        name: 'Sneha',
        tickets: 18,
        resolved: 16,
        performance: 90,
        slaCompliance: 95
      },
      {
        name: 'Amit',
        tickets: 12,
        resolved: 10,
        performance: 88,
        slaCompliance: 89
      },
      {
        name: 'Vikas',
        tickets: 14,
        resolved: 13,
        performance: 92,
        slaCompliance: 94
      }
    ];
  }, []);

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const handleExportCSV = () => {
    console.log('Exporting CSV...');
  };

  const handleExportPDF = () => {
    console.log('Exporting PDF...');
  };

  

  // Determine current page based on route
  const currentPage = location.pathname.split('/').pop();

  if (currentPage === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="ml-64">
          <Header title={`Welcome, ${user.name}`} />
          
          <main className="p-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-blue-600 mb-2">Welcome, {user.name}</h1>
              <p className="text-lg text-gray-600 mb-1">Line Manager L1 - IT Department</p>
              <h2 className="text-2xl font-semibold text-gray-800">Line Manager L1 Dashboard</h2>
              <p className="text-gray-600">Monitor team performance and ticket metrics.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {kpis.map((kpi, index) => {
                const Icon = kpi.icon;
                return (
                  <div key={kpi.title} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                        <p className={`text-xs mt-1 ${kpi.trendColor}`}>{kpi.trend}</p>
                      </div>
                      <div className={`p-3 rounded-full ${kpi.color}`}>
                        <Icon className={`h-6 w-6 ${kpi.iconColor}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end mb-6 space-x-3">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={handleExportPDF}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export PDF</span>
              </button>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Category Distribution */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Priority Distribution */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Priority Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ priority, percentage }) => `${priority}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Team Performance Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Team Performance</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Member</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Tickets</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolved</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SLA Compliance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teamPerformanceData.map((member, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {member.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {member.tickets}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {member.resolved}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${member.performance}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-500">{member.performance}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                          {member.slaCompliance}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (currentPage === 'tickets') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="ml-64">
          <Header title={`Welcome, ${user.name}`} />
          
          <main className="p-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-blue-600 mb-2">Welcome, {user.name}</h1>
              <p className="text-lg text-gray-600 mb-1">Line Manager L1 - IT Department</p>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search by ID, name, or subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-4">
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All Departments">All Departments</option>
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All Status">All Status</option>
                    <option value="New">New</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Solved">Solved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tickets Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dept</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTickets.map((ticket, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {ticket.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ticket.employee}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ticket.employeeEmail}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ticket.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ticket.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ticket.subject}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ticket.assigned}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(ticket.dateCreated).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleViewDetails(ticket)}
                            className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                          >
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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
  }

  if (currentPage === 'approvals') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="ml-64">
          <Header title={`Welcome, ${user.name}`} />
          
          <main className="p-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-blue-600 mb-2">Welcome, {user.name}</h1>
              <p className="text-lg text-gray-600 mb-1">Line Manager L1 - IT Department</p>
              <h2 className="text-2xl font-semibold text-gray-800">Approvals</h2>
              <p className="text-gray-600">Review and approve pending requests.</p>
            </div>

            {/* Pending Approvals */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Pending Approvals</h3>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending approvals</h3>
                  <p className="text-gray-500">All requests have been processed.</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (currentPage === 'reports') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="ml-64">
          <Header title={`Welcome, ${user.name}`} />
          
          <main className="p-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-blue-600 mb-2">Welcome, {user.name}</h1>
              <p className="text-lg text-gray-600 mb-1">Line Manager L1 - IT Department</p>
              <h2 className="text-2xl font-semibold text-gray-800">Reports</h2>
              <p className="text-gray-600">View detailed reports and analytics.</p>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Performance Report</h3>
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-gray-600 text-sm mb-4">Team performance metrics and trends</p>
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Generate Report
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">SLA Report</h3>
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-gray-600 text-sm mb-4">Service level agreement compliance</p>
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Generate Report
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Ticket Summary</h3>
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-gray-600 text-sm mb-4">Comprehensive ticket analysis</p>
                <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Generate Report
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (currentPage === 'profile') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="ml-64">
          <Header title={`Welcome, ${user.name}`} />
          
          <main className="p-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-blue-600 mb-2">Hello, {user.name} 👋</h1>
              <p className="text-lg text-gray-600 mb-1">Line Manager L1</p>
            </div>

            {/* Profile Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Information</h3>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">{user.name}</h4>
                  <p className="text-gray-600">Line Manager L1</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <p className="text-gray-900">Line Manager L1</p>
                  <p className="text-xs text-gray-500">Role is assigned by admin</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <p className="text-gray-900">{user.department}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{user.phone}</p>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Change Password
                </button>
              </div>
            </div>

            {/* Reporting Hierarchy */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Reporting Hierarchy</h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-900">Vikas (CEO)</span>
                </li>
                <li className="flex items-center space-x-2 ml-4">
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-900">Rashmi Desai (COO)</span>
                </li>
                <li className="flex items-center space-x-2 ml-8">
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-900">Anjali Verma (L2 Manager)</span>
                </li>
                <li className="flex items-center space-x-2 ml-12">
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-900">{user.name} (L1 Manager)</span>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                </li>
              </ul>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Default dashboard view
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Header title={`Welcome, ${user.name}`} />
        
        <main className="p-6">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to L1 Manager Dashboard</h1>
            <p className="text-gray-600">Select a section from the sidebar to get started.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerL1Dashboard;

