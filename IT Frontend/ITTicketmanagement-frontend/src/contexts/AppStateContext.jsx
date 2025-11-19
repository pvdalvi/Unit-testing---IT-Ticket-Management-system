import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state with comprehensive data
const initialState = {
  // Authentication
  currentUser: null,
  isAuthenticated: false,
  
  // Users data
  users: [
    // CEO
    {
      id: 1,
      name: "Minan",
      email: "minan@abstractgroup.com",
      password: "123",
      role: "ceo",
      department: "Executive",
      avatar: "M"
    },
    // COO
    {
      id: 2,
      name: "Rashmi",
      email: "rashmi@abstractgroup.com",
      password: "123",
      role: "coo",
      department: "Executive",
      avatar: "R"
    },
    // L2 Managers
    {
      id: 3,
      name: "Anjali",
      email: "anjali@abstractgroup.com",
      password: "123",
      role: "manager_l2",
      department: "Management",
      avatar: "A"
    },
    {
      id: 4,
      name: "Rohan",
      email: "rohan@abstractgroup.com",
      password: "123",
      role: "manager_l2",
      department: "Management",
      avatar: "R"
    },
    // L1 Managers
    {
      id: 5,
      name: "Deepak",
      email: "deepak@abstractgroup.com",
      password: "123",
      role: "manager_l1",
      department: "Management",
      avatar: "D"
    },
    {
      id: 6,
      name: "Kavita",
      email: "kavita@abstractgroup.com",
      password: "123",
      role: "manager_l1",
      department: "Management",
      avatar: "K"
    },
    {
      id: 7,
      name: "Simran",
      email: "simran@abstractgroup.com",
      password: "123",
      role: "manager_l1",
      department: "Management",
      avatar: "S"
    },
    // IT Persons
    {
      id: 8,
      name: "Rahul",
      email: "rahul@abstractgroup.com",
      password: "123",
      role: "it_person",
      department: "IT",
      avatar: "R"
    },
    {
      id: 9,
      name: "Sneha",
      email: "sneha@abstractgroup.com",
      password: "123",
      role: "it_person",
      department: "IT",
      avatar: "S"
    },
    {
      id: 10,
      name: "Amit",
      email: "amit@abstractgroup.com",
      password: "123",
      role: "it_person",
      department: "IT",
      avatar: "A"
    },
    {
      id: 11,
      name: "Vikas",
      email: "vikas@abstractgroup.com",
      password: "123",
      role: "it_person",
      department: "IT",
      avatar: "V"
    },
    // Employees
    {
      id: 12,
      name: "Tara",
      email: "tara@abstractgroup.com",
      password: "123",
      role: "employee",
      department: "Operations",
      avatar: "T"
    },
    {
      id: 13,
      name: "Alex",
      email: "alex@abstractgroup.com",
      password: "123",
      role: "employee",
      department: "Operations",
      avatar: "A"
    },
    {
      id: 14,
      name: "Radha",
      email: "radha@abstractgroup.com",
      password: "123",
      role: "employee",
      department: "Operations",
      avatar: "R"
    },
    {
      id: 15,
      name: "Neha",
      email: "neha@abstractgroup.com",
      password: "123",
      role: "employee",
      department: "Operations",
      avatar: "N"
    },
    {
      id: 16,
      name: "Priya",
      email: "priya@abstractgroup.com",
      password: "123",
      role: "employee",
      department: "Operations",
      avatar: "P"
    }
  ],

  // Tickets data with comprehensive workflow
  tickets: [
    {
      id: "TKT-001",
      title: "Laptop Performance Issues",
      description: "My laptop is running very slowly and keeps freezing. Need urgent help.",
      category: "Hardware",
      subcategory: "Laptop Issues",
      priority: "high",
      status: "open",
      createdBy: "Tara",
      createdByEmail: "tara@abstractgroup.com",
      assignedTo: null,
      assignedL1: "Rahul",
      assignedL2: "Deepak",
      department: "Operations",
      dateCreated: "2024-01-15T09:30:00Z",
      lastUpdated: "2024-01-15T09:30:00Z",
      slaStatus: "on-track",
      slaDeadline: "2024-01-17T09:30:00Z",
      workingTeam: [],
      hoursLogged: 0,
      estimatedHours: 4,
      historyLog: [
        {
          id: 1,
          action: "Ticket Created",
          user: "Tara",
          timestamp: "2024-01-15T09:30:00Z",
          comment: "Initial ticket creation",
          status: "open"
        }
      ],
      comments: [],
      attachments: []
    },
    {
      id: "TKT-002",
      title: "Excel Application Issues",
      description: "Excel is not opening properly. Getting error messages.",
      category: "Software",
      subcategory: "Application Issues",
      priority: "medium",
      status: "assigned",
      createdBy: "Alex",
      createdByEmail: "alex@abstractgroup.com",
      assignedTo: "Rahul",
      assignedL1: "Rahul",
      assignedL2: null,
      department: "Operations",
      dateCreated: "2024-01-14T14:20:00Z",
      lastUpdated: "2024-01-14T16:45:00Z",
      slaStatus: "on-track",
      slaDeadline: "2024-01-16T14:20:00Z",
      workingTeam: ["Rahul"],
      hoursLogged: 1.5,
      estimatedHours: 2,
      historyLog: [
        {
          id: 1,
          action: "Ticket Created",
          user: "Alex",
          timestamp: "2024-01-14T14:20:00Z",
          comment: "Initial ticket creation",
          status: "open"
        },
        {
          id: 2,
          action: "Assigned",
          user: "Rahul",
          timestamp: "2024-01-14T16:45:00Z",
          comment: "Looking into the issue. Will update soon.",
          status: "assigned"
        }
      ],
      comments: [
        {
          id: 1,
          author: "Alex",
          timestamp: "2024-01-14T14:20:00Z",
          content: "Initial ticket creation"
        },
        {
          id: 2,
          author: "Rahul",
          timestamp: "2024-01-14T16:45:00Z",
          content: "Looking into the issue. Will update soon."
        }
      ],
      attachments: []
    },
    {
      id: "TKT-003",
      title: "Network Connectivity Issues",
      description: "Cannot access company website from office network.",
      category: "Network",
      subcategory: "Internet Connectivity",
      priority: "high",
      status: "resolved",
      createdBy: "Radha",
      createdByEmail: "radha@abstractgroup.com",
      assignedTo: "Sneha",
      assignedL1: "Sneha",
      assignedL2: "Kavita",
      department: "Operations",
      dateCreated: "2024-01-13T11:15:00Z",
      lastUpdated: "2024-01-13T15:30:00Z",
      slaStatus: "breached",
      slaDeadline: "2024-01-13T14:15:00Z",
      workingTeam: ["Sneha", "Kavita"],
      hoursLogged: 3.5,
      estimatedHours: 2,
      historyLog: [
        {
          id: 1,
          action: "Ticket Created",
          user: "Radha",
          timestamp: "2024-01-13T11:15:00Z",
          comment: "Initial ticket creation",
          status: "open"
        },
        {
          id: 2,
          action: "Assigned",
          user: "Sneha",
          timestamp: "2024-01-13T12:00:00Z",
          comment: "Assigned to network team",
          status: "assigned"
        },
        {
          id: 3,
          action: "Escalated",
          user: "Sneha",
          timestamp: "2024-01-13T13:30:00Z",
          comment: "Escalated to L2 for complex network issue",
          status: "in_progress"
        },
        {
          id: 4,
          action: "Resolved",
          user: "Kavita",
          timestamp: "2024-01-13T15:30:00Z",
          comment: "Issue resolved. Network configuration updated.",
          status: "resolved"
        }
      ],
      comments: [
        {
          id: 1,
          author: "Radha",
          timestamp: "2024-01-13T11:15:00Z",
          content: "Initial ticket creation"
        },
        {
          id: 2,
          author: "Sneha",
          timestamp: "2024-01-13T12:00:00Z",
          content: "Assigned to network team"
        },
        {
          id: 3,
          author: "Kavita",
          timestamp: "2024-01-13T15:30:00Z",
          content: "Issue resolved. Network configuration updated."
        }
      ],
      attachments: []
    },
    {
      id: "TKT-004",
      title: "Password Reset Request",
      description: "Need to reset my password for the system.",
      category: "Security",
      subcategory: "Password Reset",
      priority: "low",
      status: "closed",
      createdBy: "Neha",
      createdByEmail: "neha@abstractgroup.com",
      assignedTo: "Amit",
      assignedL1: "Amit",
      assignedL2: null,
      department: "Operations",
      dateCreated: "2024-01-12T08:45:00Z",
      lastUpdated: "2024-01-12T10:20:00Z",
      slaStatus: "on-track",
      slaDeadline: "2024-01-12T12:45:00Z",
      workingTeam: ["Amit"],
      hoursLogged: 0.5,
      estimatedHours: 0.5,
      historyLog: [
        {
          id: 1,
          action: "Ticket Created",
          user: "Neha",
          timestamp: "2024-01-12T08:45:00Z",
          comment: "Initial ticket creation",
          status: "open"
        },
        {
          id: 2,
          action: "Resolved",
          user: "Amit",
          timestamp: "2024-01-12T10:20:00Z",
          comment: "Password reset completed. Please check your email.",
          status: "resolved"
        },
        {
          id: 3,
          action: "Closed",
          user: "Neha",
          timestamp: "2024-01-12T10:25:00Z",
          comment: "Issue resolved successfully",
          status: "closed"
        }
      ],
      comments: [
        {
          id: 1,
          author: "Neha",
          timestamp: "2024-01-12T08:45:00Z",
          content: "Initial ticket creation"
        },
        {
          id: 2,
          author: "Amit",
          timestamp: "2024-01-12T10:20:00Z",
          content: "Password reset completed. Please check your email."
        }
      ],
      attachments: []
    },
    {
      id: "TKT-005",
      title: "Printer Paper Jam Error",
      description: "Office printer is not working. Shows paper jam error.",
      category: "Hardware",
      subcategory: "Printer Issues",
      priority: "medium",
      status: "rejected",
      createdBy: "Priya",
      createdByEmail: "priya@abstractgroup.com",
      assignedTo: "Vikas",
      assignedL1: "Vikas",
      assignedL2: null,
      department: "Operations",
      dateCreated: "2024-01-11T16:30:00Z",
      lastUpdated: "2024-01-11T17:00:00Z",
      slaStatus: "on-track",
      slaDeadline: "2024-01-12T16:30:00Z",
      workingTeam: ["Vikas"],
      hoursLogged: 0.5,
      estimatedHours: 1,
      historyLog: [
        {
          id: 1,
          action: "Ticket Created",
          user: "Priya",
          timestamp: "2024-01-11T16:30:00Z",
          comment: "Initial ticket creation",
          status: "open"
        },
        {
          id: 2,
          action: "Rejected",
          user: "Vikas",
          timestamp: "2024-01-11T17:00:00Z",
          comment: "Issue resolved by maintenance team. Ticket closed.",
          status: "rejected"
        }
      ],
      comments: [
        {
          id: 1,
          author: "Priya",
          timestamp: "2024-01-11T16:30:00Z",
          content: "Initial ticket creation"
        },
        {
          id: 2,
          author: "Vikas",
          timestamp: "2024-01-11T17:00:00Z",
          content: "Issue resolved by maintenance team. Ticket closed."
        }
      ],
      attachments: []
    }
  ],

  // Categories and subcategories
  categories: {
    "Hardware": ["Laptop Issues", "Desktop Problems", "Printer Issues", "Network Equipment"],
    "Software": ["Application Issues", "System Updates", "License Problems", "Performance Issues"],
    "Network": ["Internet Connectivity", "VPN Issues", "Email Problems", "Server Issues"],
    "Security": ["Password Reset", "Access Issues", "Security Alerts", "Compliance"]
  },

  // Notifications
  notifications: [
    {
      id: 1,
      title: "SLA Breach Alert",
      message: "Ticket TKT-003 has breached SLA",
      timestamp: "2024-01-13T15:30:00Z",
      type: "warning",
      read: false
    },
    {
      id: 2,
      title: "High Priority Ticket",
      message: "New high priority ticket TKT-001 created",
      timestamp: "2024-01-15T09:30:00Z",
      type: "info",
      read: false
    },
    {
      id: 3,
      title: "System Maintenance",
      message: "Scheduled maintenance tonight at 2 AM",
      timestamp: "2024-01-14T10:00:00Z",
      type: "info",
      read: true
    }
  ],

  // UI State
  activeTab: 'overview',
  showCreateModal: false,
  showTicketModal: false,
  selectedTicket: null,
  filters: {
    category: '',
    status: '',
    priority: '',
    date: '',
    department: ''
  }
};

// Action types
const ActionTypes = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  CREATE_TICKET: 'CREATE_TICKET',
  UPDATE_TICKET: 'UPDATE_TICKET',
  ASSIGN_TICKET: 'ASSIGN_TICKET',
  ESCALATE_TICKET: 'ESCALATE_TICKET',
  RESOLVE_TICKET: 'RESOLVE_TICKET',
  REJECT_TICKET: 'REJECT_TICKET',
  CLOSE_TICKET: 'CLOSE_TICKET',
  ADD_COMMENT: 'ADD_COMMENT',
  LOG_HOURS: 'LOG_HOURS',
  ADD_TO_TEAM: 'ADD_TO_TEAM',
  UPDATE_FILTERS: 'UPDATE_FILTERS',
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  SET_MODAL_STATE: 'SET_MODAL_STATE',
  SET_SELECTED_TICKET: 'SET_SELECTED_TICKET',
  MARK_NOTIFICATION_READ: 'MARK_NOTIFICATION_READ'
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN:
      return {
        ...state,
        currentUser: action.payload,
        isAuthenticated: true
      };

    case ActionTypes.LOGOUT:
      return {
        ...state,
        currentUser: null,
        isAuthenticated: false
      };

    case ActionTypes.CREATE_TICKET:
      const newTicket = {
        ...action.payload,
        id: `TKT-${String(Date.now()).slice(-6)}`,
        dateCreated: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        status: 'open',
        assignedTo: null,
        workingTeam: [],
        hoursLogged: 0,
        historyLog: [
          {
            id: 1,
            action: "Ticket Created",
            user: action.payload.createdBy,
            timestamp: new Date().toISOString(),
            comment: "Initial ticket creation",
            status: "open"
          }
        ],
        comments: [],
        attachments: []
      };
      return {
        ...state,
        tickets: [...state.tickets, newTicket]
      };

    case ActionTypes.UPDATE_TICKET:
      return {
        ...state,
        tickets: state.tickets.map(ticket =>
          ticket.id === action.payload.id
            ? { ...ticket, ...action.payload.updates, lastUpdated: new Date().toISOString() }
            : ticket
        )
      };

    case ActionTypes.ASSIGN_TICKET:
      return {
        ...state,
        tickets: state.tickets.map(ticket =>
          ticket.id === action.payload.ticketId
            ? {
                ...ticket,
                assignedTo: action.payload.assignedTo,
                status: 'assigned',
                lastUpdated: new Date().toISOString(),
                historyLog: [
                  ...ticket.historyLog,
                  {
                    id: ticket.historyLog.length + 1,
                    action: "Assigned",
                    user: action.payload.assignedBy,
                    timestamp: new Date().toISOString(),
                    comment: action.payload.comment || `Assigned to ${action.payload.assignedTo}`,
                    status: "assigned"
                  }
                ]
              }
            : ticket
        )
      };

    case ActionTypes.ESCALATE_TICKET:
      return {
        ...state,
        tickets: state.tickets.map(ticket =>
          ticket.id === action.payload.ticketId
            ? {
                ...ticket,
                status: 'in_progress',
                assignedL2: action.payload.escalatedTo,
                lastUpdated: new Date().toISOString(),
                historyLog: [
                  ...ticket.historyLog,
                  {
                    id: ticket.historyLog.length + 1,
                    action: "Escalated",
                    user: action.payload.escalatedBy,
                    timestamp: new Date().toISOString(),
                    comment: action.payload.comment || `Escalated to ${action.payload.escalatedTo}`,
                    status: "in_progress"
                  }
                ]
              }
            : ticket
        )
      };

    case ActionTypes.RESOLVE_TICKET:
      return {
        ...state,
        tickets: state.tickets.map(ticket =>
          ticket.id === action.payload.ticketId
            ? {
                ...ticket,
                status: 'resolved',
                lastUpdated: new Date().toISOString(),
                historyLog: [
                  ...ticket.historyLog,
                  {
                    id: ticket.historyLog.length + 1,
                    action: "Resolved",
                    user: action.payload.resolvedBy,
                    timestamp: new Date().toISOString(),
                    comment: action.payload.comment || "Ticket resolved",
                    status: "resolved"
                  }
                ]
              }
            : ticket
        )
      };

    case ActionTypes.REJECT_TICKET:
      return {
        ...state,
        tickets: state.tickets.map(ticket =>
          ticket.id === action.payload.ticketId
            ? {
                ...ticket,
                status: 'rejected',
                lastUpdated: new Date().toISOString(),
                historyLog: [
                  ...ticket.historyLog,
                  {
                    id: ticket.historyLog.length + 1,
                    action: "Rejected",
                    user: action.payload.rejectedBy,
                    timestamp: new Date().toISOString(),
                    comment: action.payload.comment || "Ticket rejected",
                    status: "rejected"
                  }
                ]
              }
            : ticket
        )
      };

    case ActionTypes.CLOSE_TICKET:
      return {
        ...state,
        tickets: state.tickets.map(ticket =>
          ticket.id === action.payload.ticketId
            ? {
                ...ticket,
                status: 'closed',
                lastUpdated: new Date().toISOString(),
                historyLog: [
                  ...ticket.historyLog,
                  {
                    id: ticket.historyLog.length + 1,
                    action: "Closed",
                    user: action.payload.closedBy,
                    timestamp: new Date().toISOString(),
                    comment: action.payload.comment || "Ticket closed",
                    status: "closed"
                  }
                ]
              }
            : ticket
        )
      };

    case ActionTypes.ADD_COMMENT:
      return {
        ...state,
        tickets: state.tickets.map(ticket =>
          ticket.id === action.payload.ticketId
            ? {
                ...ticket,
                comments: [
                  ...ticket.comments,
                  {
                    id: ticket.comments.length + 1,
                    author: action.payload.author,
                    timestamp: new Date().toISOString(),
                    content: action.payload.content
                  }
                ],
                lastUpdated: new Date().toISOString()
              }
            : ticket
        )
      };

    case ActionTypes.LOG_HOURS:
      return {
        ...state,
        tickets: state.tickets.map(ticket =>
          ticket.id === action.payload.ticketId
            ? {
                ...ticket,
                hoursLogged: ticket.hoursLogged + action.payload.hours,
                lastUpdated: new Date().toISOString(),
                historyLog: [
                  ...ticket.historyLog,
                  {
                    id: ticket.historyLog.length + 1,
                    action: "Hours Logged",
                    user: action.payload.loggedBy,
                    timestamp: new Date().toISOString(),
                    comment: `Logged ${action.payload.hours} hours`,
                    status: ticket.status
                  }
                ]
              }
            : ticket
        )
      };

    case ActionTypes.ADD_TO_TEAM:
      return {
        ...state,
        tickets: state.tickets.map(ticket =>
          ticket.id === action.payload.ticketId
            ? {
                ...ticket,
                workingTeam: [...new Set([...ticket.workingTeam, action.payload.member])],
                lastUpdated: new Date().toISOString()
              }
            : ticket
        )
      };

    case ActionTypes.UPDATE_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };

    case ActionTypes.SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.payload
      };

    case ActionTypes.SET_MODAL_STATE:
      return {
        ...state,
        [action.payload.modal]: action.payload.show
      };

    case ActionTypes.SET_SELECTED_TICKET:
      return {
        ...state,
        selectedTicket: action.payload
      };

    case ActionTypes.MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        )
      };

    /* istanbul ignore next */
    default:
      return state;
  }
};

// Create context
const AppStateContext = createContext();

// Provider component
export const AppStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('appState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      if (parsedState.currentUser) {
        dispatch({ type: ActionTypes.LOGIN, payload: parsedState.currentUser });
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('appState', JSON.stringify({
      currentUser: state.currentUser,
      tickets: state.tickets,
      notifications: state.notifications
    }));
  }, [state.currentUser, state.tickets, state.notifications]);

  // Action creators
  const actions = {
    login: (email, password) => {
      const user = state.users.find(u => u.email === email && u.password === password);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        dispatch({ type: ActionTypes.LOGIN, payload: userWithoutPassword });
        return { success: true, user: userWithoutPassword };
      }
      return { success: false, error: 'Invalid credentials' };
    },

    logout: () => {
      dispatch({ type: ActionTypes.LOGOUT });
    },

    createTicket: (ticketData) => {
      dispatch({ type: ActionTypes.CREATE_TICKET, payload: ticketData });
    },

    updateTicket: (ticketId, updates) => {
      dispatch({ type: ActionTypes.UPDATE_TICKET, payload: { id: ticketId, updates } });
    },

    assignTicket: (ticketId, assignedTo, assignedBy, comment) => {
      dispatch({ 
        type: ActionTypes.ASSIGN_TICKET, 
        payload: { ticketId, assignedTo, assignedBy, comment } 
      });
    },

    escalateTicket: (ticketId, escalatedTo, escalatedBy, comment) => {
      dispatch({ 
        type: ActionTypes.ESCALATE_TICKET, 
        payload: { ticketId, escalatedTo, escalatedBy, comment } 
      });
    },

    resolveTicket: (ticketId, resolvedBy, comment) => {
      dispatch({ 
        type: ActionTypes.RESOLVE_TICKET, 
        payload: { ticketId, resolvedBy, comment } 
      });
    },

    rejectTicket: (ticketId, rejectedBy, comment) => {
      dispatch({ 
        type: ActionTypes.REJECT_TICKET, 
        payload: { ticketId, rejectedBy, comment } 
      });
    },

    closeTicket: (ticketId, closedBy, comment) => {
      dispatch({ 
        type: ActionTypes.CLOSE_TICKET, 
        payload: { ticketId, closedBy, comment } 
      });
    },

    addComment: (ticketId, author, content) => {
      dispatch({ 
        type: ActionTypes.ADD_COMMENT, 
        payload: { ticketId, author, content } 
      });
    },

    logHours: (ticketId, hours, loggedBy) => {
      dispatch({ 
        type: ActionTypes.LOG_HOURS, 
        payload: { ticketId, hours, loggedBy } 
      });
    },

    addToTeam: (ticketId, member) => {
      dispatch({ 
        type: ActionTypes.ADD_TO_TEAM, 
        payload: { ticketId, member } 
      });
    },

    updateFilters: (filters) => {
      dispatch({ type: ActionTypes.UPDATE_FILTERS, payload: filters });
    },

    setActiveTab: (tab) => {
      dispatch({ type: ActionTypes.SET_ACTIVE_TAB, payload: tab });
    },

    setModalState: (modal, show) => {
      dispatch({ type: ActionTypes.SET_MODAL_STATE, payload: { modal, show } });
    },

    setSelectedTicket: (ticket) => {
      dispatch({ type: ActionTypes.SET_SELECTED_TICKET, payload: ticket });
    },

    markNotificationRead: (notificationId) => {
      dispatch({ type: ActionTypes.MARK_NOTIFICATION_READ, payload: notificationId });
    }
  };

  return (
    <AppStateContext.Provider value={{ state, actions }}>
      {children}
    </AppStateContext.Provider>
  );
};

// Custom hook to use the context
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

export { ActionTypes };
