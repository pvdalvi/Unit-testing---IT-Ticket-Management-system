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
  Bell
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

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

const ManagerL2Dashboard = () => {
  const { state, actions } = useAppState();
  const { currentUser: user, tickets, filters } = state;
  const location = useLocation();
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Get all tickets for L2 manager
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
    const teamMembers = 12; // L1 managers under L2
    const avgResolution = "4.2h";
    const slaCompliance = 95;

    return [
      {
        title: 'Total Tickets',
        value: totalTickets,
        icon: FileText,
        color: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      {
        title: 'Team Members',
        value: teamMembers,
        icon: Users,
        color: 'bg-green-100',
        iconColor: 'text-green-600'
      },
      {
        title: 'Avg Resolution',
        value: avgResolution,
        icon: Clock,
        color: 'bg-orange-100',
        iconColor: 'text-orange-600'
      },
      {
        title: 'SLA Compliance',
        value: `${slaCompliance}%`,
        icon: CheckCircle,
        color: 'bg-green-100',
        iconColor: 'text-green-600'
      }
    ];
  }, [allTickets]);

  // Department-wise ticket data
  const departmentData = useMemo(() => {
    const deptCounts = allTickets.reduce((acc, ticket) => {
      acc[ticket.department] = (acc[ticket.department] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(deptCounts).map(([department, count]) => ({
      department,
      tickets: count
    }));
  }, [allTickets]);

  // Monthly trend data
  const monthlyTrendData = useMemo(() => {
    return [
      { month: 'Jul', tickets: 45 },
      { month: 'Aug', tickets: 52 },
      { month: 'Sep', tickets: 48 },
      { month: 'Oct', tickets: 55 }
    ];
  }, []);

  // L1 Managers performance data
  const l1ManagersData = useMemo(() => {
    return [
      {
        name: 'Deepak Kumar',
        department: 'IT',
        totalTickets: 45,
        resolved: 38,
        slaCompliance: 94,
        performance: 92
      },
      {
        name: 'Kavita Verma',
        department: 'HR',
        totalTickets: 42,
        resolved: 39,
        slaCompliance: 93,
        performance: 88
      },
      {
        name: 'Simran Patel',
        department: 'Finance',
        totalTickets: 28,
        resolved: 25,
        slaCompliance: 96,
        performance: 95
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
              <p className="text-lg text-gray-600 mb-1">Line Manager L2 - IT Department</p>
              <h2 className="text-2xl font-semibold text-gray-800">Line Manager L2 Dashboard</h2>
              <p className="text-gray-600">Monitor team performance and department metrics.</p>
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
              {/* Department-wise Tickets */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Department-wise Tickets</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="tickets" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Ticket Trend */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Ticket Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="tickets" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Team Overview - L1 Managers */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Team Overview - L1 Managers</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Tickets</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolved</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SLA Compliance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {l1ManagersData.map((manager, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {manager.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {manager.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {manager.totalTickets}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {manager.resolved}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                          {manager.slaCompliance}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${manager.performance}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-500">{manager.performance}%</span>
                          </div>
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
              <p className="text-lg text-gray-600 mb-1">Line Manager L2 - IT Department</p>
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

  if (currentPage === 'settings') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="ml-64">
          <Header title={`Welcome, ${user.name}`} />
          
          <main className="p-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-blue-600 mb-2">Welcome, {user.name}</h1>
              <p className="text-lg text-gray-600 mb-1">Line Manager L2 - IT Department</p>
              <h2 className="text-2xl font-semibold text-gray-800">Settings</h2>
              <p className="text-gray-600">Manage departments, categories, and statuses for your ticket system.</p>
            </div>

            {/* Settings Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Departments</h3>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1">
                      <Plus className="h-4 w-4" />
                      <span>Add</span>
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Filter className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">No departments added yet</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Categories</h3>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1">
                      <Plus className="h-4 w-4" />
                      <span>Add</span>
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Filter className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">No categories added yet</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Statuses</h3>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1">
                      <Plus className="h-4 w-4" />
                      <span>Add</span>
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Filter className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">No statuses added yet</p>
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
              <p className="text-lg text-gray-600 mb-1">Line Manager L2</p>
            </div>

            {/* Profile Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Information</h3>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  AV
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">{user.name}</h4>
                  <p className="text-gray-600">Line Manager L2</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <p className="text-gray-900">Line Manager L2</p>
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
                  <span className="text-gray-900">Rachna (COO)</span>
                </li>
                <li className="flex items-center space-x-2 ml-8">
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-900">{user.name} (MD) (Line Manager L2)</span>
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
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to L2 Manager Dashboard</h1>
            <p className="text-gray-600">Select a section from the sidebar to get started.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerL2Dashboard;

