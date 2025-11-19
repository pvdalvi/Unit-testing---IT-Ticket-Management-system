import React, { useState, useMemo } from 'react';

export const getEmployeeGreeting = (name) => `Welcome, ${name}`;
import { useAppState } from '../../contexts/AppStateContext';
import api from "../../Connection/Api";
import { useLocation } from 'react-router-dom';
import Header from '../shared/Header';
import Sidebar from '../shared/Sidebar';
import TicketTable from '../shared/TicketTable';
import CreateTicketModal from '../shared/CreateTicketModal';
import EnhancedTicketModal from '../shared/EnhancedTicketModal';
import { Plus, Ticket, Clock, CheckCircle } from 'lucide-react';

const EmployeeDashboard = () => {
  const { state, actions } = useAppState();
  const { currentUser: user, tickets, filters } = state;
  const location = useLocation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Determine current view based on route
  const currentView = location.pathname.split('/').pop();

  // Filter tickets for current user
  const userTickets = useMemo(() => {
    return tickets.filter(ticket => ticket.createdByEmail === user.email);
  }, [tickets, user.email]);

  // Apply filters
  const filteredTickets = useMemo(() => {
    return userTickets.filter(ticket => {
      const categoryMatch =
        !filters.category ||
        ticket.category.toLowerCase().includes(filters.category.toLowerCase()) ||
        ticket.subcategory.toLowerCase().includes(filters.category.toLowerCase());

      // ⭐ FIXED DATE MATCH — RELIABLE ISO MATCHING ⭐
      const ticketDateISO = ticket.dateCreated.slice(0, 10); // "2025-01-15"
      const dateMatch =
        !filters.date ||
        ticketDateISO === filters.date;

      return categoryMatch && dateMatch;
    });
  }, [userTickets, filters]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalTickets = userTickets.length;
    const openTickets = userTickets.filter(t => t.status === 'open').length;
    const pendingTickets = userTickets.filter(t => t.status === 'pending').length;
    const closedTickets = userTickets.filter(t => t.status === 'closed').length;

    return [
      {
        title: 'Total Tickets',
        value: totalTickets,
        icon: Ticket,
        trend: 'up',
        trendValue: '+2 this week'
      },
      {
        title: 'Open Tickets',
        value: openTickets,
        icon: Clock,
        trend: openTickets > 0 ? 'up' : 'down',
        trendValue: openTickets > 0 ? `${openTickets} pending` : 'All resolved'
      },
      {
        title: 'Pending Tickets',
        value: pendingTickets,
        icon: Clock,
        trend: 'neutral',
        trendValue: 'In progress'
      },
      {
        title: 'Closed Tickets',
        value: closedTickets,
        icon: CheckCircle,
        trend: 'up',
        trendValue: `${Math.round((closedTickets / totalTickets) * 100)}% resolved`
      }
    ];
  }, [userTickets]);

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'subcategory', label: 'Subcategory', sortable: true },
    { key: 'dateCreated', label: 'Date', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'priority', label: 'Priority', sortable: true }
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

  const handleCreateTicket = () => {
    setShowCreateModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Header title={`Welcome, ${user.name}`} />

        <main className="p-6">
          {currentView === 'dashboard' && (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                        <div className="p-3 rounded-full bg-employee-primary bg-opacity-10 hover:bg-opacity-20 transition-all duration-300">
                          <Icon className="h-6 w-6 text-employee-primary" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent Tickets Preview */}
              <div className="card">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Tickets</h3>
                </div>
                <div className="p-6">
                  <TicketTable
                    tickets={filteredTickets.slice(0, 5)}
                    columns={columns}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onSort={handleSort}
                    onViewDetails={handleViewDetails}
                    showActions={false}
                  />
                </div>
              </div>
            </>
          )}

          {currentView === 'tickets' && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Tickets</h2>
              </div>
              <TicketTable
                tickets={filteredTickets}
                columns={columns}
                filters={filters}
                onFilterChange={handleFilterChange}
                onSort={handleSort}
                onViewDetails={handleViewDetails}
                showActions={false}
              />
            </>
          )}

          {currentView === 'create-ticket' && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New Ticket</h2>
              </div>
              <div className="max-w-2xl">
                <CreateTicketModal
                  isOpen={true}
                  onClose={() => window.history.back()}
                />
              </div>
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <CreateTicketModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <EnhancedTicketModal
        ticket={selectedTicket}
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
      />
    </div>
  );
};

export default EmployeeDashboard;
