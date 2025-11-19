import React, { useState, useMemo, useEffect, useRef } from 'react';

export const getStatusColor = (status) => {
  switch ((status || '').toString()) {
    case 'open':
    case 'Open':
      return 'status-open';
    case 'assigned':
    case 'assigned':
      return 'status-pending';
    case 'in_progress':
    case 'in_progress':
      return 'status-pending';
    case 'resolved':
      return 'status-approved';
    case 'rejected':
      return 'status-rejected';
    case 'closed':
      return 'status-closed';
    default:
      return 'status-open';
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
import { useAppState } from '../../contexts/AppStateContext';
import api from "../../Connection/Api";
import Header from '../shared/Header';
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
  BarChart3,
  Home,
  PieChart,
  Bell,
  User,
  Eye,
  X,
  Plus,
  Search,
  Filter,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Lock,
  Save,
  Hash,
  ArrowUpDown,
  LogOut
} from 'lucide-react';

const COODashboard = () => {
  const { state, actions } = useAppState();
  const { currentUser: user, tickets, filters } = state;
  const [activeView, setActiveView] = useState('reports');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // Filter states
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  
  // Approval states
  const [selectedApprovalTicket, setSelectedApprovalTicket] = useState(null);
  const [showApprovalDetails, setShowApprovalDetails] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvalQueueData, setApprovalQueueData] = useState([]);
  
  // Ref for profile dropdown
  const profileDropdownRef = useRef(null);
  
  // Form states
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [profileData, setProfileData] = useState({
    email: 'rashmi.patel@abstractgroup.com',
    department: 'Operations',
    phone: '+91 98765 43210',
    employeeId: 'EMP-2019-0042',
    location: 'Mumbai, India',
    lastLogin: '17 Oct 2025, 9:30 AM'
  });

  // Mock notifications
  const notifications = [
    { id: 1, title: 'New ticket escalation from Deepak', message: 'TCK-2025-0301', time: '30m ago', unread: true },
    { id: 2, title: 'SLA breach reported in HR department', message: 'Multiple tickets at risk', time: '1h ago', unread: true },
    { id: 3, title: 'Approval request pending for VPN setup', message: 'TCK-2025-0272', time: '2h ago', unread: true },
    { id: 4, title: 'Budget approval required', message: 'TCK-2025-0303', time: '45m ago', unread: true },
    { id: 5, title: 'Hardware request pending', message: 'TCK-2025-0304', time: '1h 15m ago', unread: true },
    { id: 6, title: 'Network issue escalation', message: 'TCK-2025-0305', time: '2h 30m ago', unread: true },
    { id: 7, title: 'Access request approved', message: 'TCK-2025-0306', time: '3h ago', unread: false },
    { id: 8, title: 'Software license renewal', message: 'TCK-2025-0307', time: '4h ago', unread: false },
    { id: 9, title: 'VPN setup completed', message: 'TCK-2025-0308', time: '5h ago', unread: false },
    { id: 10, title: 'System maintenance scheduled', message: 'Tonight at 2 AM', time: '6h ago', unread: false },
    { id: 11, title: 'Monthly report generated', message: 'October 2025 report ready', time: '1 day ago', unread: false },
    { id: 12, title: 'Security audit completed', message: 'All systems secure', time: '2 days ago', unread: false }
  ];

  // Navigation items
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: Home },
    { id: 'reports', label: 'Reports and Metrics', icon: BarChart3 },
    { id: 'sla', label: 'SLA Compliance', icon: TrendingUp },
    { id: 'approvals', label: 'Approval Queue', icon: Clock },
    { id: 'export', label: 'Export Data', icon: Download },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  // Calculate comprehensive KPIs
  const kpis = useMemo(() => {
    const pendingApprovals = 12;
    const closedThisWeek = 326;
    const slaCompliance = 92;
    const avgResolutionTime = '12h 48m';

    return [
      {
        title: 'Tickets Closed This Week',
        value: closedThisWeek,
        icon: CheckCircle,
        trend: '+115%',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        cardBgColor: 'bg-green-50'
      },
      {
        title: 'Pending Approvals',
        value: pendingApprovals,
        icon: Bell,
        trend: null,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        cardBgColor: 'bg-orange-50'
      },
      {
        title: 'SLA Compliance',
        value: `${slaCompliance}%`,
        icon: CheckCircle,
        trend: null,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        cardBgColor: 'bg-blue-50'
      },
      {
        title: 'Avg Resolution Time',
        value: avgResolutionTime,
        icon: Clock,
        trend: null,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        cardBgColor: 'bg-purple-50'
      }
    ];
  }, []);

  // Updated ticket data matching the image with enhanced details for modal
  const ticketData = [
    {
      id: 'TCK-2025-0305',
      title: 'Software Access Request - CRM System',
      department: 'IT',
      issueType: 'Software Access',
      category: 'Software',
      subcategory: 'Access Request',
      priority: 'High',
      status: 'Awaiting Approval',
      assignedLevel: 'L2 Manager',
      assignedTo: 'Deepak Sharma',
      slaStatus: 'On Track',
      lastUpdated: '2025-10-18 09:15',
      createdBy: 'Tara Singh',
      createdByEmail: 'tara.singh@abstractgroup.com',
      description: 'Request for CRM system access for 5 new employees in the sales department. This requires approval for software licensing and user account creation.',
      workingTeam: ['Deepak Sharma', 'Amit Patel'],
      hoursLogged: 2.5,
      estimatedHours: 8,
      historyLog: [
        {
          id: 1,
          action: 'Ticket Created',
          user: 'Tara Singh',
          comment: 'Created ticket for CRM access request',
          timestamp: '2025-10-16T09:00:00Z'
        },
        {
          id: 2,
          action: 'Assigned',
          user: 'Deepak Sharma',
          comment: 'Assigned to L2 Manager for review',
          timestamp: '2025-10-16T10:30:00Z'
        }
      ],
      comments: [
        {
          id: 1,
          author: 'Tara Singh',
          content: 'Need access for 5 new sales team members',
          timestamp: '2025-10-16T09:00:00Z'
        },
        {
          id: 2,
          author: 'Deepak Sharma',
          content: 'Reviewing licensing requirements',
          timestamp: '2025-10-16T10:30:00Z'
        }
      ]
    },
    {
      id: 'TCK-2025-0304',
      title: 'HR Policy Change Request',
      department: 'HR',
      issueType: 'Policy Change',
      category: 'Policy',
      subcategory: 'HR Policy',
      priority: 'Medium',
      status: 'In Progress',
      assignedLevel: 'L1 Manager',
      assignedTo: 'Kavita Desai',
      slaStatus: 'On Track',
      lastUpdated: '2025-10-17 16:30',
      createdBy: 'Neha Gupta',
      createdByEmail: 'neha.gupta@abstractgroup.com',
      description: 'Request to update remote work policy to include new guidelines for hybrid work arrangements.',
      workingTeam: ['Kavita Desai'],
      hoursLogged: 4,
      estimatedHours: 12,
      historyLog: [
        {
          id: 1,
          action: 'Ticket Created',
          user: 'Neha Gupta',
          comment: 'Created policy change request',
          timestamp: '2025-10-15T14:00:00Z'
        },
        {
          id: 2,
          action: 'Assigned',
          user: 'Kavita Desai',
          comment: 'Assigned to HR Manager for review',
          timestamp: '2025-10-15T15:00:00Z'
        }
      ],
      comments: [
        {
          id: 1,
          author: 'Neha Gupta',
          content: 'Need to update policy for hybrid work',
          timestamp: '2025-10-15T14:00:00Z'
        }
      ]
    },
    {
      id: 'TCK-2025-0303',
      title: 'Budget Approval for Hardware Purchase',
      department: 'Finance',
      issueType: 'Budget Approval',
      category: 'Finance',
      subcategory: 'Budget Request',
      priority: 'Critical',
      status: 'Awaiting Approval',
      assignedLevel: 'COO',
      assignedTo: 'Rashmi Desai',
      slaStatus: 'At Risk',
      lastUpdated: '2025-10-17 11:20',
      createdBy: 'Raj Kumar',
      createdByEmail: 'raj.kumar@abstractgroup.com',
      description: 'Budget approval needed for $25,000 hardware purchase for design team laptops with high-end graphics cards.',
      workingTeam: ['Rashmi Desai'],
      hoursLogged: 1,
      estimatedHours: 4,
      historyLog: [
        {
          id: 1,
          action: 'Ticket Created',
          user: 'Raj Kumar',
          comment: 'Created budget approval request',
          timestamp: '2025-10-14T11:00:00Z'
        },
        {
          id: 2,
          action: 'Escalated',
          user: 'Amit Patel',
          comment: 'Escalated to COO for budget approval',
          timestamp: '2025-10-14T16:00:00Z'
        }
      ],
      comments: [
        {
          id: 1,
          author: 'Raj Kumar',
          content: 'Urgent budget approval needed for design team',
          timestamp: '2025-10-14T11:00:00Z'
        }
      ]
    },
    {
      id: 'TCK-2025-0302',
      title: 'Network Infrastructure Issue',
      department: 'IT',
      issueType: 'Network Issue',
      category: 'Infrastructure',
      subcategory: 'Network',
      priority: 'High',
      status: 'In Progress',
      assignedLevel: 'IT Manager',
      assignedTo: 'Suresh Kumar',
      slaStatus: 'On Track',
      lastUpdated: '2025-10-17 10:45',
      createdBy: 'Priya Sharma',
      createdByEmail: 'priya.sharma@abstractgroup.com',
      description: 'Network connectivity issues affecting multiple departments. Intermittent connection drops reported.',
      workingTeam: ['Suresh Kumar', 'Amit Patel'],
      hoursLogged: 6,
      estimatedHours: 16,
      historyLog: [
        {
          id: 1,
          action: 'Ticket Created',
          user: 'Priya Sharma',
          comment: 'Reported network connectivity issues',
          timestamp: '2025-10-16T08:00:00Z'
        },
        {
          id: 2,
          action: 'Assigned',
          user: 'Suresh Kumar',
          comment: 'Assigned to IT Manager for investigation',
          timestamp: '2025-10-16T09:00:00Z'
        }
      ],
      comments: [
        {
          id: 1,
          author: 'Priya Sharma',
          content: 'Network keeps dropping every few minutes',
          timestamp: '2025-10-16T08:00:00Z'
        }
      ]
    },
    {
      id: 'TCK-2025-0301',
      title: 'Employee Access Request',
      department: 'Admin',
      issueType: 'Access Request',
      category: 'Access',
      subcategory: 'User Access',
      priority: 'Low',
      status: 'Resolved',
      assignedLevel: 'L1 Manager',
      assignedTo: 'Kavita Desai',
      slaStatus: 'Completed',
      lastUpdated: '2025-10-16 17:00',
      createdBy: 'Amit Singh',
      createdByEmail: 'amit.singh@abstractgroup.com',
      description: 'New employee needs access to company systems and shared drives.',
      workingTeam: ['Kavita Desai'],
      hoursLogged: 3,
      estimatedHours: 4,
      historyLog: [
        {
          id: 1,
          action: 'Ticket Created',
          user: 'Amit Singh',
          comment: 'Created access request for new employee',
          timestamp: '2025-10-15T10:00:00Z'
        },
        {
          id: 2,
          action: 'Assigned',
          user: 'Kavita Desai',
          comment: 'Assigned to Admin Manager',
          timestamp: '2025-10-15T11:00:00Z'
        },
        {
          id: 3,
          action: 'Resolved',
          user: 'Kavita Desai',
          comment: 'Access granted successfully',
          timestamp: '2025-10-16T17:00:00Z'
        }
      ],
      comments: [
        {
          id: 1,
          author: 'Amit Singh',
          content: 'New employee John Doe needs system access',
          timestamp: '2025-10-15T10:00:00Z'
        },
        {
          id: 2,
          author: 'Kavita Desai',
          content: 'Access has been provisioned',
          timestamp: '2025-10-16T17:00:00Z'
        }
      ]
    },
    {
      id: 'TCK-2025-0300',
      title: 'Hardware Replacement Request',
      department: 'IT',
      issueType: 'Hardware',
      category: 'Hardware',
      subcategory: 'Replacement',
      priority: 'Medium',
      status: 'Created',
      assignedLevel: 'Unassigned',
      assignedTo: null,
      slaStatus: 'On Track',
      lastUpdated: '2025-10-16 14:20',
      createdBy: 'Ravi Verma',
      createdByEmail: 'ravi.verma@abstractgroup.com',
      description: 'Request for replacement of faulty laptop keyboard and trackpad.',
      workingTeam: [],
      hoursLogged: 0,
      estimatedHours: 2,
      historyLog: [
        {
          id: 1,
          action: 'Ticket Created',
          user: 'Ravi Verma',
          comment: 'Created hardware replacement request',
          timestamp: '2025-10-16T14:20:00Z'
        }
      ],
      comments: [
        {
          id: 1,
          author: 'Ravi Verma',
          content: 'Laptop keyboard and trackpad not working properly',
          timestamp: '2025-10-16T14:20:00Z'
        }
      ]
    }
  ];

  // Mock data for approval queue - 10 items
  const initialApprovalQueue = [
    {
      id: 'TCK-2025-0301',
      raisedBy: 'Tara',
      currentHandler: 'Deepak (L1)',
      summary: 'Software access escalation - CRM system for 5 users',
      priority: 'High',
      details: 'Request for CRM system access for 5 new employees in the sales department. This requires approval for software licensing and user account creation.',
      department: 'Sales',
      dateRaised: '2025-10-16',
      slaDeadline: '2025-10-19'
    },
    {
      id: 'TCK-2025-0303',
      raisedBy: 'Neha',
      currentHandler: 'Kavita (L1)',
      summary: 'Hardware replacement request - 10 laptops for design team',
      priority: 'High',
      details: 'Design team requires 10 new laptops with high-end graphics cards for video editing and 3D modeling work. Budget approval needed for $25,000.',
      department: 'Design',
      dateRaised: '2025-10-15',
      slaDeadline: '2025-10-18'
    },
    {
      id: 'TCK-2025-0304',
      raisedBy: 'Raj',
      currentHandler: 'Amit (L2)',
      summary: 'VPN approval overdue',
      priority: 'Critical',
      details: 'VPN access request for remote work setup. Employee needs secure access to internal systems from home office.',
      department: 'IT',
      dateRaised: '2025-10-14',
      slaDeadline: '2025-10-17'
    },
    {
      id: 'TCK-2025-0305',
      raisedBy: 'Priya',
      currentHandler: 'Suresh (L1)',
      summary: 'Network reconfiguration request',
      priority: 'Medium',
      details: 'Network infrastructure needs reconfiguration to support new office layout. Requires temporary downtime.',
      department: 'IT',
      dateRaised: '2025-10-13',
      slaDeadline: '2025-10-20'
    },
    {
      id: 'TCK-2025-0306',
      raisedBy: 'Alex',
      currentHandler: 'Rohan (L2)',
      summary: 'Budget approval for software licenses',
      priority: 'Medium',
      details: 'Annual software license renewal for Microsoft Office 365 and Adobe Creative Suite. Total cost $15,000.',
      department: 'IT',
      dateRaised: '2025-10-12',
      slaDeadline: '2025-10-19'
    },
    {
      id: 'TCK-2025-0307',
      raisedBy: 'Radha',
      currentHandler: 'Simran (L1)',
      summary: 'Office equipment purchase request',
      priority: 'Low',
      details: 'Request to purchase new office chairs and desks for the new office space. Budget $8,500.',
      department: 'Admin',
      dateRaised: '2025-10-11',
      slaDeadline: '2025-10-21'
    },
    {
      id: 'TCK-2025-0308',
      raisedBy: 'Vikas',
      currentHandler: 'Deepak (L1)',
      summary: 'Security software upgrade',
      priority: 'High',
      details: 'Upgrade to latest antivirus and security software across all company devices. One-time cost $12,000.',
      department: 'IT',
      dateRaised: '2025-10-10',
      slaDeadline: '2025-10-18'
    },
    {
      id: 'TCK-2025-0309',
      raisedBy: 'Sneha',
      currentHandler: 'Kavita (L1)',
      summary: 'Training program approval',
      priority: 'Medium',
      details: 'Approval for team training program on new project management tools. Cost $5,000 for 20 employees.',
      department: 'HR',
      dateRaised: '2025-10-09',
      slaDeadline: '2025-10-22'
    },
    {
      id: 'TCK-2025-0310',
      raisedBy: 'Amit',
      currentHandler: 'Rohan (L2)',
      summary: 'Server hardware upgrade',
      priority: 'Critical',
      details: 'Critical server hardware upgrade needed to handle increased load. Budget $35,000 for new servers.',
      department: 'IT',
      dateRaised: '2025-10-08',
      slaDeadline: '2025-10-16'
    },
    {
      id: 'TCK-2025-0311',
      raisedBy: 'Neha',
      currentHandler: 'Simran (L1)',
      summary: 'Marketing campaign budget',
      priority: 'Medium',
      details: 'Q4 marketing campaign budget approval for digital advertising and content creation. Total $20,000.',
      department: 'Marketing',
      dateRaised: '2025-10-07',
      slaDeadline: '2025-10-23'
    }
  ];

  // Mock SLA data
  const slaData = [
    {
      department: 'IT',
      slaCompliance: 94,
      avgClosureTime: '11h 22m',
      ticketsBreached: 4,
      totalTickets: 456,
      status: 'good'
    },
    {
      department: 'HR',
      slaCompliance: 89,
      avgClosureTime: '13h 05m',
      ticketsBreached: 6,
      totalTickets: 298,
      status: 'warning'
    },
    {
      department: 'Finance',
      slaCompliance: 92,
      avgClosureTime: '10h 18m',
      ticketsBreached: 3,
      totalTickets: 234,
      status: 'good'
    },
    {
      department: 'Admin',
      slaCompliance: 97,
      avgClosureTime: '9h 45m',
      ticketsBreached: 2,
      totalTickets: 142,
      status: 'excellent'
    }
  ];

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const handleApprove = (ticketId) => {
    const ticket = approvalQueueData.find(t => t.id === ticketId);
    setSelectedApprovalTicket(ticket);
    setShowApproveModal(true);
  };

  const handleDrop = (ticketId) => {
    const ticket = approvalQueueData.find(t => t.id === ticketId);
    setSelectedApprovalTicket(ticket);
    setShowRejectModal(true);
  };

  const handleConfirmApproval = () => {
    if (selectedApprovalTicket) {
      // Here you would typically make an API call to approve the ticket
      console.log(`Approving ticket ${selectedApprovalTicket.id} with notes: ${approvalNotes}`);
      
      // Remove the approved ticket from the queue
      setApprovalQueueData(prevQueue => 
        prevQueue.filter(ticket => ticket.id !== selectedApprovalTicket.id)
      );
      
      alert(`Ticket ${selectedApprovalTicket.id} approved successfully!`);
      setShowApproveModal(false);
      setSelectedApprovalTicket(null);
      setApprovalNotes('');
    }
  };

  const handleConfirmDrop = () => {
    if (selectedApprovalTicket && rejectionReason.trim()) {
      // Here you would typically make an API call to drop the ticket
      console.log(`Dropping ticket ${selectedApprovalTicket.id} with reason: ${rejectionReason}`);
      
      // Remove the dropped ticket from the queue
      setApprovalQueueData(prevQueue => 
        prevQueue.filter(ticket => ticket.id !== selectedApprovalTicket.id)
      );
      
      alert(`Ticket ${selectedApprovalTicket.id} dropped.`);
      setShowRejectModal(false);
      setSelectedApprovalTicket(null);
      setRejectionReason('');
    } else {
      alert('Please provide a reason for dropping.');
    }
  };
  
  const handleLogout = () => {
    if (actions.logout) {
      actions.logout();
    } else {
      // Fallback logout
      window.location.href = '/login';
    }
  };
  
  const handleClearFilters = () => {
    setDepartmentFilter('All');
    setStatusFilter('All');
    setPriorityFilter('All');
  };
  
  // Filter tickets based on selected filters
  const filteredTickets = useMemo(() => {
    return ticketData.filter(ticket => {
      const departmentMatch = departmentFilter === 'All' || ticket.department === departmentFilter;
      const statusMatch = statusFilter === 'All' || ticket.status === statusFilter;
      const priorityMatch = priorityFilter === 'All' || ticket.priority === priorityFilter;
      return departmentMatch && statusMatch && priorityMatch;
    });
  }, [departmentFilter, statusFilter, priorityFilter]);
  
  // Initialize approval queue data
  useEffect(() => {
    setApprovalQueueData(initialApprovalQueue);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleExport = (format, type) => {
    console.log(`Exporting ${type} as ${format}`);
    
    if (format === 'csv') {
      // Generate CSV data based on type
      let csvData = '';
      let filename = '';
      
      if (type === 'SLA Report') {
        csvData = 'Department,SLA Compliance,Avg Closure Time,Tickets Breached,Total Tickets\n';
        slaData.forEach(dept => {
          csvData += `${dept.department},${dept.slaCompliance}%,${dept.avgClosureTime},${dept.ticketsBreached},${dept.totalTickets}\n`;
        });
        filename = 'sla_report.csv';
      } else if (type === 'Complete Ticket Report') {
        csvData = 'Ticket ID,Department,Issue Type,Priority,Status,Assigned Level,SLA Status,Last Updated\n';
        ticketData.forEach(ticket => {
          csvData += `${ticket.id},${ticket.department},${ticket.issueType},${ticket.priority},${ticket.status},${ticket.assignedLevel},${ticket.slaStatus},${ticket.lastUpdated}\n`;
        });
        filename = 'complete_ticket_report.csv';
      } else if (type === 'Approval Queue Report') {
        csvData = 'Ticket ID,Raised By,Current Handler,Summary,Priority,Department,Date Raised,SLA Deadline\n';
        approvalQueueData.forEach(item => {
          csvData += `${item.id},${item.raisedBy},${item.currentHandler},${item.summary},${item.priority},${item.department},${item.dateRaised},${item.slaDeadline}\n`;
        });
        filename = 'approval_queue_report.csv';
      } else if (type === 'Executive Analytics') {
        csvData = 'Metric,Value,Status\n';
        csvData += `Total Tickets,${kpis[0].value},Active\n`;
        csvData += `Pending Approvals,${kpis[1].value},Pending\n`;
        csvData += `Tickets Closed This Week,${kpis[2].value},Completed\n`;
        csvData += `SLA Compliance,${kpis[3].value},Good\n`;
        csvData += `Avg Resolution Time,${kpis[4].value},On Track\n`;
        filename = 'executive_analytics.csv';
      }
      
      // Create and download CSV file
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'pdf') {
      // For PDF, we'll create a simple text-based PDF using jsPDF
      // This is a simplified approach - in production you'd want a proper PDF library
      const pdfContent = `IT Ticket Management System - ${type}\n\n`;
      let content = pdfContent;
      
      if (type === 'SLA Report') {
        content += 'Department\tSLA Compliance\tAvg Closure Time\tTickets Breached\tTotal Tickets\n';
        slaData.forEach(dept => {
          content += `${dept.department}\t${dept.slaCompliance}%\t${dept.avgClosureTime}\t${dept.ticketsBreached}\t${dept.totalTickets}\n`;
        });
      } else if (type === 'Complete Ticket Report') {
        content += 'Ticket ID\tDepartment\tIssue Type\tPriority\tStatus\tAssigned Level\tSLA Status\tLast Updated\n';
        ticketData.forEach(ticket => {
          content += `${ticket.id}\t${ticket.department}\t${ticket.issueType}\t${ticket.priority}\t${ticket.status}\t${ticket.assignedLevel}\t${ticket.slaStatus}\t${ticket.lastUpdated}\n`;
        });
      } else if (type === 'Approval Queue Report') {
        content += 'Ticket ID\tRaised By\tCurrent Handler\tSummary\tPriority\tDepartment\tDate Raised\tSLA Deadline\n';
        approvalQueueData.forEach(item => {
          content += `${item.id}\t${item.raisedBy}\t${item.currentHandler}\t${item.summary}\t${item.priority}\t${item.department}\t${item.dateRaised}\t${item.slaDeadline}\n`;
        });
      } else if (type === 'Executive Analytics') {
        content += 'Metric\tValue\tStatus\n';
        content += `Total Tickets\t${kpis[0].value}\tActive\n`;
        content += `Pending Approvals\t${kpis[1].value}\tPending\n`;
        content += `Tickets Closed This Week\t${kpis[2].value}\tCompleted\n`;
        content += `SLA Compliance\t${kpis[3].value}\tGood\n`;
        content += `Avg Resolution Time\t${kpis[4].value}\tOn Track\n`;
      }
      
      // Create and download text file as PDF alternative
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${type.toLowerCase().replace(/\s+/g, '_')}.txt`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    alert(`${type} exported as ${format.toUpperCase()} successfully!`);
  };

  const handleChangePassword = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert('New passwords do not match');
      return;
    }
    console.log('Changing password');
    setPasswordData({ current: '', new: '', confirm: '' });
    setShowChangePasswordModal(false);
  };

  const handleSaveProfile = () => {
    console.log('Saving profile:', profileData);
    alert('Profile updated successfully!');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSLAStatusIcon = (status) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  // Render Dashboard Overview
  const renderDashboard = () => (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.title} className={`${kpi.cardBgColor} rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                  {kpi.trend && (
                    <p className="text-xs text-green-600 mt-1">{kpi.trend}</p>
                  )}
                </div>
                <div className={`p-3 rounded-full ${kpi.bgColor}`}>
                  <Icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ticket Overview Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Ticket Overview</h3>
            <span className="text-sm text-gray-500">Showing 6 of 6 tickets</span>
          </div>
        </div>
        
        {/* Filter Bar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-4">
            <select 
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>Department: All</option>
              <option>IT</option>
              <option>HR</option>
              <option>Finance</option>
              <option>Admin</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>Status: All</option>
              <option>Awaiting Approval</option>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Created</option>
            </select>
            <select 
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>Priority: All</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <button 
              onClick={handleClearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm hover:bg-gray-100 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SLA Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.issueType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      ticket.status === 'Awaiting Approval' ? 'bg-purple-100 text-purple-800' :
                      ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      ticket.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.assignedLevel}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      ticket.slaStatus === 'On Track' ? 'bg-blue-100 text-blue-800' :
                      ticket.slaStatus === 'At Risk' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {ticket.slaStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center space-x-1">
                    <span>{ticket.lastUpdated}</span>
                    <ArrowUpDown className="h-3 w-3 text-gray-400" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(ticket)}
                      className="text-blue-600 hover:text-blue-900 transition-colors flex items-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render Reports and Metrics View
  const renderReportsAndMetrics = () => (
    <div className="space-y-8">
      {/* Department Performance Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Department Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slaData.map((dept) => (
            <div key={dept.department} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">{dept.department}</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">SLA Compliance:</span>
                  <span className={`text-sm font-semibold ${
                    dept.status === 'excellent' ? 'text-green-600' :
                    dept.status === 'good' ? 'text-blue-600' :
                    dept.status === 'warning' ? 'text-orange-600' :
                    'text-gray-600'
                  }`}>
                    {dept.status}
                  </span>
                  <span className="text-sm font-bold text-gray-900">{dept.slaCompliance}%</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Avg Closure Time:</span>
                  <span className="ml-2 font-medium text-gray-900">{dept.avgClosureTime}</span>
                </div>
                <div>
                  <span className="text-gray-600">Tickets Breached:</span>
                  <span className={`ml-2 font-medium ${
                    dept.ticketsBreached > 4 ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {dept.ticketsBreached}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {notifications.slice(0, 5).map((notification) => (
            <div key={notification.id} className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full mt-2 bg-blue-400"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{notification.title}</p>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render SLA Compliance View
  const renderSLACompliance = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              SLA & Performance Summary
            </h3>
            <p className="text-sm text-gray-600 mt-1">Department-wise SLA compliance and performance metrics</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleExport('csv', 'SLA Report')}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => handleExport('pdf', 'SLA Report')}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SLA Compliance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Closure Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tickets Breached</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Tickets</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {slaData.map((dept) => (
                <tr key={dept.department} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600 font-semibold">{dept.slaCompliance}%</span>
                      {getSLAStatusIcon(dept.status)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.avgClosureTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={dept.ticketsBreached > 4 ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                      {dept.ticketsBreached}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.totalTickets}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render Approval Queue View
  const renderApprovalQueue = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-orange-600" />
              Approval Queue
            </h3>
            <p className="text-sm text-gray-600 mt-1">{approvalQueueData.length} items pending COO approval</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raised By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Handler</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Summary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {approvalQueueData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.raisedBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.currentHandler}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">{item.summary}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleDrop(item.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1"
                    >
                      <X className="h-4 w-4" />
                      <span>Drop</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render Export Data View
  const renderExportData = () => (
    <div className="space-y-8">
      {/* SLA Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              SLA & Performance Summary
            </h3>
            <p className="text-sm text-gray-600 mt-1">Department-wise SLA compliance and performance metrics</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleExport('csv', 'SLA Report')}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => handleExport('pdf', 'SLA Report')}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
        {/* SLA table content same as above */}
      </div>

      {/* Export Data Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Export Data</h3>
          <p className="text-sm text-gray-600 mt-1">Download reports and data in various formats</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Complete Ticket Report */}
          <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
            <div className="flex items-center mb-4">
              <Download className="h-8 w-8 text-blue-600 mr-3" />
              <h4 className="text-lg font-semibold text-gray-900">Complete Ticket Report</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">Export all ticket data with detailed information, timelines, and resolution status</p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleExport('csv', 'Complete Ticket Report')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Export as CSV
              </button>
              <button
                onClick={() => handleExport('pdf', 'Complete Ticket Report')}
                className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Export as PDF
              </button>
            </div>
          </div>

          {/* SLA Performance Report */}
          <div className="border border-green-200 rounded-lg p-6 bg-green-50">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
              <h4 className="text-lg font-semibold text-gray-900">SLA Performance Report</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">Department-wise SLA compliance metrics and performance indicators</p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleExport('csv', 'SLA Performance Report')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Export as CSV
              </button>
              <button
                onClick={() => handleExport('pdf', 'SLA Performance Report')}
                className="border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
              >
                Export as PDF
              </button>
            </div>
          </div>

          {/* Approval Queue Report */}
          <div className="border border-orange-200 rounded-lg p-6 bg-orange-50">
            <div className="flex items-center mb-4">
              <Clock className="h-8 w-8 text-orange-600 mr-3" />
              <h4 className="text-lg font-semibold text-gray-900">Approval Queue Report</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">All pending approvals with detailed summaries and priority levels</p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleExport('csv', 'Approval Queue Report')}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Export as CSV
              </button>
              <button
                onClick={() => handleExport('pdf', 'Approval Queue Report')}
                className="border border-orange-600 text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors"
              >
                Export as PDF
              </button>
            </div>
          </div>

          {/* Executive Analytics */}
          <div className="border border-purple-200 rounded-lg p-6 bg-purple-50">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
              <h4 className="text-lg font-semibold text-gray-900">Executive Analytics</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">Comprehensive analytics with trends, forecasts, and insights</p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleExport('csv', 'Executive Analytics')}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Export as CSV
              </button>
              <button
                onClick={() => handleExport('pdf', 'Executive Analytics')}
                className="border border-purple-600 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors"
              >
                Export as PDF
              </button>
            </div>
          </div>
        </div>

        {/* Data Summary */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Data Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm text-gray-600">Total Records:</span>
              <span className="text-blue-600 font-semibold ml-2">1,240</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Date Range:</span>
              <span className="text-gray-900 font-semibold ml-2">Last 30 days</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Departments:</span>
              <span className="text-blue-600 font-semibold ml-2">4</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Last Export:</span>
              <span className="text-gray-900 font-semibold ml-2">Oct 15, 2023</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Profile View
  const renderProfile = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Hello, Rashmi 👋</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">RD</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Rashmi Desai</h3>
                <p className="text-gray-600">COO</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <input
                type="text"
                value={profileData.department}
                onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <input
                type="text"
                value="COO"
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">Role is assigned by admin</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSaveProfile}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
          
          {/* Change Password */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">Change Password</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                value={passwordData.current}
                onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={passwordData.new}
                onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={passwordData.confirm}
                onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleChangePassword}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Lock className="h-4 w-4" />
              <span>Change Password</span>
            </button>
          </div>
        </div>

        {/* Reporting Hierarchy */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Reporting Hierarchy</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Minan (CEO)</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Rashmi Desai (COO)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">AG</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Abstract Group</h1>
                <p className="text-xs text-gray-500">IT Ticket Management System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="h-6 w-6" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      <p className="text-sm text-gray-500">{notifications.length} unread notifications</p>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 rounded-full mt-2 bg-blue-400"></div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                            <button className="text-xs text-gray-400 hover:text-gray-600">Dismiss</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-gray-200">
                      <button className="text-blue-600 text-sm hover:text-blue-800">View all {notifications.length} notifications</button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors"
                >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">RD</span>
                </div>
                <span className="text-sm font-medium text-gray-900">Rashmi</span>
                </button>
                
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    {/* Profile Header */}
                    <div className="bg-blue-600 p-4 rounded-t-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-blue-200">
                          <span className="text-blue-600 font-bold text-lg">RD</span>
                        </div>
                        <div>
                          <h3 className="text-white text-lg font-semibold">Rashmi Patel</h3>
                          <p className="text-blue-100 text-sm">Chief Operating Officer</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Profile Details */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="text-sm text-gray-900">rashmi.patel@abstractgroup.com</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Phone:</span>
                        <span className="text-sm text-gray-900">+91 98765 43210</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Hash className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Employee ID:</span>
                        <span className="text-sm text-gray-900">EMP-2019-0042</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Department:</span>
                        <span className="text-sm text-gray-900">Operations</span>
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Location:</span>
                        <span className="text-sm text-gray-900">Mumbai, India</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Last Login:</span>
                        <span className="text-sm text-gray-900">17 Oct 2025, 9:30 AM</span>
                      </div>
                      
                      {/* Reporting Structure */}
                      <div className="bg-blue-50 p-3 rounded-lg mt-4">
                        <span className="text-sm text-gray-600">Reports to</span>
                        <div className="text-sm text-blue-600 font-medium mt-1">Minan Shah (CEO)</div>
                      </div>
                      
                      {/* Actions */}
                      <div className="pt-4 border-t border-gray-200 space-y-2">
                        <button 
                          onClick={() => setActiveView('profile')}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <User className="h-4 w-4" />
                          <span>View Full Profile</span>
                        </button>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Custom Sidebar */}
      <div className="fixed left-0 top-16 w-64 h-full bg-white shadow-lg z-30">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Abstract Group</h1>
          <p className="text-sm text-gray-500">IT Ticket Management System</p>
        </div>
        
        <nav className="mt-8">
          <ul className="space-y-2 px-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleViewChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeView === item.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Logged in as Rashmi Desai (COO)</p>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 pt-16">
        <main className="p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-blue-600">Welcome, Rashmi</h1>
            <p className="text-gray-600">COO - Executive Department</p>
          </div>

          {activeView === 'dashboard' && renderDashboard()}
          {activeView === 'reports' && renderReportsAndMetrics()}
          {activeView === 'sla' && renderSLACompliance()}
          {activeView === 'approvals' && renderApprovalQueue()}
          {activeView === 'export' && renderExportData()}
          {activeView === 'profile' && renderProfile()}
        </main>
      </div>

      {/* Modals */}
      <EnhancedTicketModal
        ticket={selectedTicket}
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
      />
      
      {/* Approval Modal */}
      {showApproveModal && selectedApprovalTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Approve Ticket</h3>
              <button
                onClick={() => setShowApproveModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Ticket Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Ticket Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Ticket ID:</span>
                    <span className="ml-2 font-medium">{selectedApprovalTicket.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Priority:</span>
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedApprovalTicket.priority)}`}>
                      {selectedApprovalTicket.priority}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Raised By:</span>
                    <span className="ml-2 font-medium">{selectedApprovalTicket.raisedBy}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Department:</span>
                    <span className="ml-2 font-medium">{selectedApprovalTicket.department}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-gray-600">Summary:</span>
                  <p className="text-sm text-gray-900 mt-1">{selectedApprovalTicket.summary}</p>
                </div>
              </div>

              {/* Approval Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Approval Notes (Optional)
                </label>
                <textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Add any notes or comments for this approval..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={4}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmApproval}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Approve Ticket</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drop Modal */}
      {showRejectModal && selectedApprovalTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Drop Ticket</h3>
              <button
                onClick={() => setShowRejectModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Ticket Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Ticket Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Ticket ID:</span>
                    <span className="ml-2 font-medium">{selectedApprovalTicket.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Priority:</span>
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedApprovalTicket.priority)}`}>
                      {selectedApprovalTicket.priority}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Raised By:</span>
                    <span className="ml-2 font-medium">{selectedApprovalTicket.raisedBy}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Department:</span>
                    <span className="ml-2 font-medium">{selectedApprovalTicket.department}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-gray-600">Summary:</span>
                  <p className="text-sm text-gray-900 mt-1">{selectedApprovalTicket.summary}</p>
                </div>
              </div>

              {/* Drop Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Dropping <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a detailed reason for dropping this ticket..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={4}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">This information will be shared with the requester.</p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDrop}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Drop Ticket</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="ml-64 bg-white border-t border-gray-200 py-4">
        <div className="px-8 text-center text-sm text-gray-500">
          ©2025 Abstract Group | IT Ticket Management System | COO Dashboard
        </div>
      </footer>
    </div>
  );
};

export default COODashboard;
