import React, { useState, useMemo } from 'react';

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

// Pure helpers exported for unit testing
export const validateTicketFormData = (ticketForm) => {
  const errors = {};
  if (!ticketForm.fullName || !ticketForm.fullName.trim()) errors.fullName = 'Full name is required';
  if (!ticketForm.email || !ticketForm.email.trim()) errors.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(ticketForm.email)) errors.email = 'Email is invalid';
  if (!ticketForm.department) errors.department = 'Department is required';
  if (!ticketForm.category) errors.category = 'Category is required';
  if (!ticketForm.priority) errors.priority = 'Priority is required';
  if (!ticketForm.subject || !ticketForm.subject.trim()) errors.subject = 'Subject is required';
  if (!ticketForm.description || !ticketForm.description.trim()) errors.description = 'Description is required';
  return errors;
};

export const addTicketHelper = (dashboardTickets, newTicket) => {
  const ticket = {
    ...newTicket,
    id: `TCK-2025-${String(dashboardTickets.length + 1).padStart(4, '0')}`,
    created: new Date().toISOString().split('T')[0],
    status: 'New',
    assigned: 'Unassigned'
  };
  return [ticket, ...dashboardTickets];
};

export const addAgentHelper = (agents, agentData) => {
  const newAgent = {
    ...agentData,
    id: (agents.length ? Math.max(...agents.map(a => a.id)) : 0) + 1,
    assignedTickets: 0
  };
  return [...agents, newAgent];
};

export const editAgentHelper = (agents, agentId, updatedAgent) => {
  return agents.map(agent => agent.id === agentId ? { ...agent, ...updatedAgent } : agent);
};

export const deleteAgentHelper = (agents, agentId) => {
  return agents.filter(agent => agent.id !== agentId);
};

export const addDepartmentHelper = (departments, deptData) => {
  const newDept = {
    ...deptData,
    id: (departments.length ? Math.max(...departments.map(d => d.id)) : 0) + 1
  };
  return [...departments, newDept];
};

export const editDepartmentHelper = (departments, deptId, updatedDept) => {
  return departments.map(dept => dept.id === deptId ? { ...dept, ...updatedDept } : dept);
};

export const deleteDepartmentHelper = (departments, deptId) => {
  return departments.filter(dept => dept.id !== deptId);
};

export const addCategoryHelper = (categories, catData) => {
  const newCat = {
    ...catData,
    id: (categories.length ? Math.max(...categories.map(c => c.id)) : 0) + 1
  };
  return [...categories, newCat];
};

export const editCategoryHelper = (categories, catId, updatedCat) => {
  return categories.map(cat => cat.id === catId ? { ...cat, ...updatedCat } : cat);
};

export const deleteCategoryHelper = (categories, catId) => {
  return categories.filter(cat => cat.id !== catId);
};

export const addStatusHelper = (statuses, statusData) => {
  const newStatus = {
    ...statusData,
    id: (statuses.length ? Math.max(...statuses.map(s => s.id)) : 0) + 1
  };
  return [...statuses, newStatus];
};

export const editStatusHelper = (statuses, statusId, updatedStatus) => {
  return statuses.map(s => s.id === statusId ? { ...s, ...updatedStatus } : s);
};

export const deleteStatusHelper = (statuses, statusId) => {
  return statuses.filter(s => s.id !== statusId);
};
import { useAppState } from '../../contexts/AppStateContext';
import api from "../../Connection/Api";
import Header from '../shared/Header';
import Sidebar from '../shared/Sidebar';
import TicketTable from '../shared/TicketTable';
import EnhancedTicketModal from '../shared/EnhancedTicketModal';
import CreateTicketModal from '../shared/CreateTicketModal';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Home,
  Plus,
  Ticket,
  UserPlus,
  Settings,
  User,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  PieChart,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  Save,
  X,
  Bell,
  ChevronDown,
  LogOut,
  MoreHorizontal,
  Check,
  XCircle,
  AlertCircle,
  Star,
  UserCheck,
  Building,
  Tag,
  Flag,
  Upload,
  Image
} from 'lucide-react';

const ITPersonDashboard = ({ testMode = false }) => {
  const { state, actions } = useAppState();
  const { currentUser: user, tickets, filters } = state;
  const [activeView, setActiveView] = useState('dashboard');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);
  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddStatusModal, setShowAddStatusModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  
  // Filter states
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [priorityFilter, setPriorityFilter] = useState('All Priorities');
  
  // Form states
  const [newAgent, setNewAgent] = useState({ username: '', email: '', role: 'L1 Agent', department: 'IT' });
  const [newDepartment, setNewDepartment] = useState({ name: '', description: '' });
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newStatus, setNewStatus] = useState({ name: '', color: '#3B82F6' });
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [profileData, setProfileData] = useState({
    email: 'rahul@abstractgroup.com',
    department: 'IT',
    phone: '+91 98765-43210'
  });
  
  // Create ticket form state
  const [ticketForm, setTicketForm] = useState({
    fullName: '',
    email: '',
    department: '',
    category: '',
    priority: '',
    subject: '',
    description: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Stateful data for demonstration - these will be updated dynamically
  const [agents, setAgents] = useState([
    { id: 1, username: 'Alex Johnson', email: 'alex@abstract.com', role: 'L1 Agent', department: 'IT', assignedTickets: 12 },
    { id: 2, username: 'Tara Singh', email: 'tara@abstract.com', role: 'L1 Agent', department: 'IT', assignedTickets: 15 },
    { id: 3, username: 'Anjali Verma', email: 'anjali@abstract.com', role: 'L2 Agent', department: 'IT', assignedTickets: 8 },
    { id: 4, username: 'Deepak Kumar', email: 'deepak@abstract.com', role: 'L1 Agent', department: 'HR', assignedTickets: 10 }
  ]);

  const [departments, setDepartments] = useState([
    { id: 1, name: 'IT', description: 'Information Technology Department' },
    { id: 2, name: 'HR', description: 'Human Resources Department' },
    { id: 3, name: 'Finance', description: 'Finance Department' },
    { id: 4, name: 'Admin', description: 'Administration Department' }
  ]);

  const [categories, setCategories] = useState([
    { id: 1, name: 'Hardware', description: 'Hardware related issues' },
    { id: 2, name: 'Software', description: 'Software related issues' },
    { id: 3, name: 'Network', description: 'Network connectivity issues' },
    { id: 4, name: 'Access', description: 'Access and permissions' }
  ]);

  const [statuses, setStatuses] = useState([
    { id: 1, name: 'New', color: '#3B82F6' },
    { id: 2, name: 'Open', color: '#F59E0B' },
    { id: 3, name: 'In Progress', color: '#06B6D4' },
    { id: 4, name: 'Solved', color: '#10B981' },
    { id: 5, name: 'Closed', color: '#6B7280' }
  ]);

  // Mock notifications
  const notifications = [
    { id: 1, title: 'New ticket assigned', message: 'TCK-2025-0342 assigned to you', time: '15 mins ago', unread: true },
    { id: 2, title: 'SLA warning', message: 'TCK-2025-0338 approaching deadline', time: '1 hour ago', unread: true },
    { id: 3, title: 'System maintenance', message: 'Scheduled maintenance tonight', time: '2 hours ago', unread: false }
  ];

  // Calculate comprehensive KPIs
  const kpis = useMemo(() => {
    const totalTickets = 320;
    const openTickets = 18;
    const inProgressTickets = 42;
    const closedTickets = 240;
    const slaCompliance = 93;

    return [
      { title: 'Total', value: totalTickets, icon: Ticket, color: 'bg-blue-500' },
      { title: 'Open', value: openTickets, icon: Clock, color: 'bg-orange-500' },
      { title: 'In Progress', value: inProgressTickets, icon: AlertTriangle, color: 'bg-yellow-500' },
      { title: 'Closed', value: closedTickets, icon: CheckCircle, color: 'bg-green-500' },
      { title: 'SLA', value: `${slaCompliance}%`, icon: TrendingUp, color: 'bg-green-500' }
    ];
  }, [tickets]);

  // Navigation items
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: Home },
    { id: 'create-ticket', label: 'Create Ticket', icon: Plus },
    { id: 'tickets', label: 'Tickets', icon: Ticket },
    { id: 'agents', label: 'Agents', icon: UserPlus },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'My Profile', icon: User }
  ];

  // Stateful ticket data - will be updated dynamically
  const [dashboardTickets, setDashboardTickets] = useState([
    {
      id: 'TCK-2025-0342',
      title: 'Laptop screen flickering',
      name: 'Sneha Kumar',
      email: 'sneha@abstract.com',
      department: 'IT',
      category: 'Hardware',
      subject: 'Laptop screen flickering',
      status: 'New',
      priority: 'High',
      assigned: 'Unassigned',
      created: '2025-10-17',
      createdBy: 'Sneha Kumar'
    },
    {
      id: 'TCK-2025-0341',
      title: 'Cannot access payroll system',
      name: 'Rohan Mehta',
      email: 'rohan@abstract.com',
      department: 'HR',
      category: 'Software',
      subject: 'Cannot access payroll system',
      status: 'Open',
      priority: 'Medium',
      assigned: 'Alex',
      created: '2025-10-16',
      createdBy: 'Rohan Mehta'
    },
    {
      id: 'TCK-2025-0340',
      title: 'Slow internet connection',
      name: 'Priya Shah',
      email: 'priya@abstract.com',
      department: 'Finance',
      category: 'Network',
      subject: 'Slow internet connection',
      status: 'In Progress',
      priority: 'Low',
      assigned: 'Tara',
      created: '2025-10-15',
      createdBy: 'Priya Shah'
    },
    {
      id: 'TCK-2025-0339',
      title: 'Need admin access to server',
      name: 'Amit Patel',
      email: 'amit@abstract.com',
      department: 'IT',
      category: 'Access',
      subject: 'Need admin access to server',
      status: 'Solved',
      priority: 'High',
      assigned: 'Rahul',
      created: '2025-10-14',
      createdBy: 'Amit Patel'
    },
    {
      id: 'TCK-2025-0338',
      title: 'Printer not working',
      name: 'Neha Gupta',
      email: 'neha@abstract.com',
      department: 'Admin',
      category: 'Hardware',
      subject: 'Printer not working',
      status: 'Closed',
      priority: 'Medium',
      assigned: 'Alex',
      created: '2025-10-13',
      createdBy: 'Neha Gupta'
    }
  ]);

  // Filter tickets based on search, department, status, category, and priority
  const filteredTickets = dashboardTickets.filter(ticket => {
    const matchesSearch = searchFilter === '' || 
      ticket.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      ticket.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchFilter.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'All Departments' || 
      ticket.department === departmentFilter;
    
    const matchesStatus = statusFilter === 'All Status' || 
      ticket.status === statusFilter;
    
    const matchesCategory = categoryFilter === 'All Categories' || 
      ticket.category === categoryFilter;
    
    const matchesPriority = priorityFilter === 'All Priorities' || 
      ticket.priority === priorityFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesCategory && matchesPriority;
  });

  const handleClearFilters = () => {
    setSearchFilter('');
    setDepartmentFilter('All Departments');
    setStatusFilter('All Status');
    setCategoryFilter('All Categories');
    setPriorityFilter('All Priorities');
  };

  // CRUD Operations for Tickets
  const handleAddTicket = (newTicket) => {
    const ticket = {
      ...newTicket,
      id: `TCK-2025-${String(dashboardTickets.length + 1).padStart(4, '0')}`,
      created: new Date().toISOString().split('T')[0],
      status: 'New',
      assigned: 'Unassigned'
    };
    setDashboardTickets(prev => [ticket, ...prev]);
  };

  const handleEditTicket = (ticketId, updatedTicket) => {
    setDashboardTickets(prev => prev.map(ticket => 
      ticket.id === ticketId ? { ...ticket, ...updatedTicket } : ticket
    ));
  };

  const handleDeleteTicket = (ticketId) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      setDashboardTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
    }
  };

  // CRUD Operations for Agents
  const handleAddAgent = (agentData) => {
    const newAgent = {
      ...agentData,
      id: Math.max(...agents.map(a => a.id)) + 1,
      assignedTickets: 0
    };
    setAgents(prev => [...prev, newAgent]);
  };

  const handleEditAgent = (agentId, updatedAgent) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId ? { ...agent, ...updatedAgent } : agent
    ));
  };

  const handleDeleteAgent = (agentId) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      setAgents(prev => prev.filter(agent => agent.id !== agentId));
    }
  };

  // CRUD Operations for Departments
  const handleAddDepartment = (deptData) => {
    const newDept = {
      ...deptData,
      id: Math.max(...departments.map(d => d.id)) + 1
    };
    setDepartments(prev => [...prev, newDept]);
  };

  const handleEditDepartment = (deptId, updatedDept) => {
    setDepartments(prev => prev.map(dept => 
      dept.id === deptId ? { ...dept, ...updatedDept } : dept
    ));
  };

  const handleDeleteDepartment = (deptId) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      setDepartments(prev => prev.filter(dept => dept.id !== deptId));
    }
  };

  // CRUD Operations for Categories
  const handleAddCategory = (catData) => {
    const newCat = {
      ...catData,
      id: Math.max(...categories.map(c => c.id)) + 1
    };
    setCategories(prev => [...prev, newCat]);
  };

  const handleEditCategory = (catId, updatedCat) => {
    setCategories(prev => prev.map(cat => 
      cat.id === catId ? { ...cat, ...updatedCat } : cat
    ));
  };

  const handleDeleteCategory = (catId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(prev => prev.filter(cat => cat.id !== catId));
    }
  };

  // CRUD Operations for Statuses
  const handleAddStatus = (statusData) => {
    const newStatus = {
      ...statusData,
      id: Math.max(...statuses.map(s => s.id)) + 1
    };
    setStatuses(prev => [...prev, newStatus]);
  };

  const handleEditStatus = (statusId, updatedStatus) => {
    setStatuses(prev => prev.map(status => 
      status.id === statusId ? { ...status, ...updatedStatus } : status
    ));
  };

  const handleDeleteStatus = (statusId) => {
    if (window.confirm('Are you sure you want to delete this status?')) {
      setStatuses(prev => prev.filter(status => status.id !== statusId));
    }
  };

  const handleTicketFormChange = (e) => {
    const { name, value } = e.target;
    setTicketForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const validateTicketForm = () => {
    const errors = {};
    
    if (!ticketForm.fullName.trim()) errors.fullName = 'Full name is required';
    if (!ticketForm.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(ticketForm.email)) errors.email = 'Email is invalid';
    if (!ticketForm.department) errors.department = 'Department is required';
    if (!ticketForm.category) errors.category = 'Category is required';
    if (!ticketForm.priority) errors.priority = 'Priority is required';
    if (!ticketForm.subject.trim()) errors.subject = 'Subject is required';
    if (!ticketForm.description.trim()) errors.description = 'Description is required';
    
    return errors;
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    
    const errors = validateTicketForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Create new ticket
    const newTicket = {
      title: ticketForm.subject,
      name: ticketForm.fullName,
      email: ticketForm.email,
      department: ticketForm.department,
      category: ticketForm.category,
      subject: ticketForm.subject,
      priority: ticketForm.priority,
      createdBy: ticketForm.fullName,
      description: ticketForm.description,
      image: imageFile ? imageFile.name : null
    };
    
    // Add to tickets using CRUD operation
    handleAddTicket(newTicket);
    
    // Reset form
    setTicketForm({
      fullName: '',
      email: '',
      department: '',
      category: '',
      priority: '',
      subject: '',
      description: ''
    });
    setFormErrors({});
    setImageFile(null);
    setImagePreview(null);
    
    alert('Ticket created successfully!');
  };

  const handleResetForm = () => {
    setTicketForm({
      fullName: '',
      email: '',
      department: '',
      category: '',
      priority: '',
      subject: '',
      description: ''
    });
    setFormErrors({});
    setImageFile(null);
    setImagePreview(null);
  };

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const handleViewDetails = (ticket) => {
    console.log('Opening ticket details for:', ticket);
    setSelectedTicket(ticket);
    setShowTicketModal(true);
    console.log('Ticket modal should be open now');
  };

  // Enhanced edit handlers
  const handleEditClick = (item, type) => {
    setEditingItem(item);
    setEditingType(type);
    setEditFormData({ ...item });
    setShowEditModal(true);
  };

  const handleEditSubmit = () => {
    if (editingType === 'ticket') {
      handleEditTicket(editingItem.id, editFormData);
    } else if (editingType === 'agent') {
      handleEditAgent(editingItem.id, editFormData);
    } else if (editingType === 'department') {
      handleEditDepartment(editingItem.id, editFormData);
    } else if (editingType === 'category') {
      handleEditCategory(editingItem.id, editFormData);
    } else if (editingType === 'status') {
      handleEditStatus(editingItem.id, editFormData);
    }
    setShowEditModal(false);
    setEditingItem(null);
    setEditingType(null);
    setEditFormData({});
    alert(`${editingType} updated successfully!`);
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddAgentSubmit = () => {
    if (newAgent.username && newAgent.email) {
      handleAddAgent(newAgent);
      setNewAgent({ username: '', email: '', role: 'L1 Agent', department: 'IT' });
      setShowAddAgentModal(false);
      alert('Agent added successfully!');
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleAddDepartmentSubmit = () => {
    if (newDepartment.name) {
      handleAddDepartment(newDepartment);
      setNewDepartment({ name: '', description: '' });
      setShowAddDepartmentModal(false);
      alert('Department added successfully!');
    } else {
      alert('Please enter department name');
    }
  };

  const handleAddCategorySubmit = () => {
    if (newCategory.name) {
      handleAddCategory(newCategory);
      setNewCategory({ name: '', description: '' });
      setShowAddCategoryModal(false);
      alert('Category added successfully!');
    } else {
      alert('Please enter category name');
    }
  };

  const handleAddStatusSubmit = () => {
    if (newStatus.name) {
      handleAddStatus(newStatus);
      setNewStatus({ name: '', color: '#3B82F6' });
      setShowAddStatusModal(false);
      alert('Status added successfully!');
    } else {
      alert('Please enter status name');
    }
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

  // Expose internal handlers for test automation when `testMode` is enabled.
  // This is a test-only hook gated by the `testMode` prop so it does not affect
  // production behavior. Tests can call functions on `window.__ITP_HANDLERS` to
  // drive internal flows deterministically.
  if (testMode && typeof window !== 'undefined') {
    // Keep the mapping minimal and explicit.
    window.__ITP_HANDLERS = {
      // Ticket flows
      handleTicketSubmit: (e) => handleTicketSubmit && handleTicketSubmit(e),
      handleResetForm: () => handleResetForm && handleResetForm(),
      handleAddTicket: (t) => handleAddTicket && handleAddTicket(t),
      handleEditSubmit: () => handleEditSubmit && handleEditSubmit(),
      handleDeleteTicket: (id) => handleDeleteTicket && handleDeleteTicket(id),
      // Agent flows
      handleAddAgentSubmit: () => handleAddAgentSubmit && handleAddAgentSubmit(),
      handleAddAgent: (a) => handleAddAgent && handleAddAgent(a),
      handleEditAgent: (id, a) => handleEditAgent && handleEditAgent(id, a),
      handleDeleteAgent: (id) => handleDeleteAgent && handleDeleteAgent(id),
      // Department/Category/Status flows
      handleAddDepartmentSubmit: () => handleAddDepartmentSubmit && handleAddDepartmentSubmit(),
      handleAddCategorySubmit: () => handleAddCategorySubmit && handleAddCategorySubmit(),
      handleAddStatusSubmit: () => handleAddStatusSubmit && handleAddStatusSubmit(),
      handleEditDepartment: (id, d) => handleEditDepartment && handleEditDepartment(id, d),
      handleDeleteDepartment: (id) => handleDeleteDepartment && handleDeleteDepartment(id),
      handleEditCategory: (id, c) => handleEditCategory && handleEditCategory(id, c),
      handleDeleteCategory: (id) => handleDeleteCategory && handleDeleteCategory(id),
      handleEditStatus: (id, s) => handleEditStatus && handleEditStatus(id, s),
      handleDeleteStatus: (id) => handleDeleteStatus && handleDeleteStatus(id),
      // Image and password flows
      handleImageUpload: (e) => handleImageUpload && handleImageUpload(e),
      removeImage: () => removeImage && removeImage(),
      handleChangePassword: () => handleChangePassword && handleChangePassword(),
      // State setters for direct manipulation (use with act() in tests)
      __setTicketForm: (tf) => setTicketForm && setTicketForm(tf),
      __setNewAgent: (na) => setNewAgent && setNewAgent(na),
      __setNewDepartment: (nd) => setNewDepartment && setNewDepartment(nd),
      __setNewCategory: (nc) => setNewCategory && setNewCategory(nc),
      __setNewStatus: (ns) => setNewStatus && setNewStatus(ns),
      __setPasswordData: (pd) => setPasswordData && setPasswordData(pd),
      __setEditFormData: (ef) => setEditFormData && setEditFormData(ef),
      __setShowEditModal: (v) => setShowEditModal && setShowEditModal(v),
      __setEditingType: (t) => setEditingType && setEditingType(t),
      __setEditingItem: (it) => setEditingItem && setEditingItem(it),
      // View and modal toggles
      __setActiveView: (v) => setActiveView && setActiveView(v),
      __setShowTicketModal: (v) => setShowTicketModal && setShowTicketModal(v),
      __setShowCreateModal: (v) => setShowCreateModal && setShowCreateModal(v),
      __setShowProfileModal: (v) => setShowProfileModal && setShowProfileModal(v),
      __setShowAddAgentModal: (v) => setShowAddAgentModal && setShowAddAgentModal(v),
      __setShowAddDepartmentModal: (v) => setShowAddDepartmentModal && setShowAddDepartmentModal(v),
      __setShowAddCategoryModal: (v) => setShowAddCategoryModal && setShowAddCategoryModal(v),
      __setShowAddStatusModal: (v) => setShowAddStatusModal && setShowAddStatusModal(v),
      __setShowChangePasswordModal: (v) => setShowChangePasswordModal && setShowChangePasswordModal(v),
    };
  }

  // Render Dashboard Overview
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-5 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.title} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${kpi.color} bg-opacity-10`}>
                  <Icon className={`h-5 w-5 ${kpi.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>


      {/* Enhanced Ticket Management Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Ticket className="h-5 w-5 mr-2 text-blue-600" />
              Ticket Management
            </h3>
          </div>
        </div>
        
        {/* Enhanced Filters */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>All Status</option>
              {statuses.map(status => (
                <option key={status.id} value={status.name}>{status.name}</option>
              ))}
            </select>
            <button 
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{ticket.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      ticket.status === 'New' ? 'bg-blue-100 text-blue-800' :
                      ticket.status === 'Open' ? 'bg-orange-100 text-orange-800' :
                      ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      ticket.status === 'Solved' ? 'bg-green-100 text-green-800' :
                      ticket.status === 'Closed' ? 'bg-gray-100 text-gray-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      ticket.priority === 'High' ? 'bg-red-100 text-red-800' :
                      ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      ticket.priority === 'Low' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.createdBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.assigned}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('View clicked for ticket:', ticket.id);
                          handleViewDetails(ticket);
                        }}
                        className="text-blue-600 hover:text-blue-900 transition-colors p-2 rounded hover:bg-blue-50 flex items-center space-x-1"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="text-xs">View</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('Edit clicked for ticket:', ticket.id);
                          handleEditClick(ticket, 'ticket');
                        }}
                        className="text-green-600 hover:text-green-900 transition-colors p-2 rounded hover:bg-green-50 flex items-center space-x-1"
                        title="Edit Ticket"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="text-xs">Edit</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('Delete clicked for ticket:', ticket.id);
                          handleDeleteTicket(ticket.id);
                        }}
                        className="text-red-600 hover:text-red-900 transition-colors p-2 rounded hover:bg-red-50 flex items-center space-x-1"
                        title="Delete Ticket"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="text-xs">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-500">Showing {filteredTickets.length} of {dashboardTickets.length} tickets</p>
        </div>
      </div>

      {/* Charts and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Distribution Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Distribution</h3>
          <div className="flex items-center justify-center h-64">
            <div className="relative w-48 h-48">
              {/* Donut Chart Representation */}
              <div className="absolute inset-0 rounded-full border-8 border-transparent" style={{
                background: `conic-gradient(
                  #EF4444 0deg 36deg,
                  #3B82F6 36deg 108deg,
                  #F59E0B 108deg 216deg,
                  #10B981 216deg 360deg
                )`
              }}></div>
              <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">320</div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">New: 10</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">In Progress: 18</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Open: 42</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Closed: 240</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Rahul closed TCA-2023-0042</p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                Submit
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Trisha reopened TCA-2023-0030</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                Submit
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">New ticket TCA-2023-0040 assigned to Alex</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                Submit
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Tom updated TCA-2023-0035</p>
                <p className="text-xs text-gray-500">3 hours ago</p>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                Submit
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">SLA warning for TCA-2023-0038</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Department-wise Ticket Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Department-wise Ticket Distribution</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm font-medium text-gray-900">IT</span>
            </div>
            <div className="flex-1 mx-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <span className="text-sm text-gray-600">100 total, 20 open</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm font-medium text-gray-900">Finance</span>
            </div>
            <div className="flex-1 mx-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            <span className="text-sm text-gray-600">80 total, 12 open</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-sm font-medium text-gray-900">HR</span>
            </div>
            <div className="flex-1 mx-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <span className="text-sm text-gray-600">60 total, 8 open</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span className="text-sm font-medium text-gray-900">Admin</span>
            </div>
            <div className="flex-1 mx-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
            <span className="text-sm text-gray-600">40 total, 2 open</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Tickets View
  const renderTickets = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Ticket className="h-6 w-6 mr-2 text-blue-600" />
            All Tickets
          </h2>
          <p className="text-gray-600 mt-1">Manage and view all support tickets</p>
        </div>
        <button
          onClick={() => setActiveView('create-ticket')}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2 shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Ticket</span>
        </button>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, name, or subject..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select 
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>All Departments</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.name}>{dept.name}</option>
            ))}
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>All Status</option>
            {statuses.map(status => (
              <option key={status.id} value={status.name}>{status.name}</option>
            ))}
          </select>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <button 
            onClick={handleClearFilters}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Clear Filters</span>
          </button>
          <p className="text-sm text-gray-500">Showing {filteredTickets.length} of {dashboardTickets.length} tickets</p>
        </div>
      </div>

      {/* Enhanced Tickets Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Ticket className="h-5 w-5 mr-2 text-blue-600" />
            Tickets List
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{ticket.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      ticket.status === 'New' ? 'bg-blue-100 text-blue-800' :
                      ticket.status === 'Open' ? 'bg-orange-100 text-orange-800' :
                      ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      ticket.status === 'Solved' ? 'bg-green-100 text-green-800' :
                      ticket.status === 'Closed' ? 'bg-gray-100 text-gray-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      ticket.priority === 'High' ? 'bg-red-100 text-red-800' :
                      ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      ticket.priority === 'Low' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.createdBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.assigned}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('View clicked for ticket:', ticket.id);
                          handleViewDetails(ticket);
                        }}
                        className="text-blue-600 hover:text-blue-900 transition-colors p-2 rounded hover:bg-blue-50 flex items-center space-x-1"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="text-xs">View</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('Edit clicked for ticket:', ticket.id);
                          handleEditClick(ticket, 'ticket');
                        }}
                        className="text-green-600 hover:text-green-900 transition-colors p-2 rounded hover:bg-green-50 flex items-center space-x-1"
                        title="Edit Ticket"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="text-xs">Edit</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('Delete clicked for ticket:', ticket.id);
                          handleDeleteTicket(ticket.id);
                        }}
                        className="text-red-600 hover:text-red-900 transition-colors p-2 rounded hover:bg-red-50 flex items-center space-x-1"
                        title="Delete Ticket"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="text-xs">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render Agents View
  const renderAgents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <UserCheck className="h-6 w-6 mr-2 text-blue-600" />
            Agent Management
          </h2>
          <p className="text-gray-600 mt-1">Manage your support team agents</p>
        </div>
        <button
          onClick={() => setShowAddAgentModal(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2 shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Agent</span>
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Agent List
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tickets Assigned</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agents.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{agent.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {agent.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      agent.role === 'L1 Agent' ? 'bg-green-100 text-green-800' :
                      agent.role === 'L2 Agent' ? 'bg-yellow-100 text-yellow-800' :
                      agent.role === 'IT Manager' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {agent.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Ticket className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500">{agent.assignedTickets}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('Edit clicked for agent:', agent.id);
                          handleEditClick(agent, 'agent');
                        }}
                        className="text-blue-600 hover:text-blue-900 transition-colors p-2 rounded hover:bg-blue-50 flex items-center space-x-1"
                        title="Edit Agent"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="text-xs">Edit</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('Delete clicked for agent:', agent.id);
                          handleDeleteAgent(agent.id);
                        }}
                        className="text-red-600 hover:text-red-900 transition-colors p-2 rounded hover:bg-red-50 flex items-center space-x-1"
                        title="Delete Agent"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="text-xs">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-500">Showing {agents.length} agents</p>
        </div>
      </div>
    </div>
  );

  // Render Settings View
  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Settings className="h-6 w-6 mr-2 text-blue-600" />
          System Settings
        </h2>
        <p className="text-gray-600 mt-1">Manage departments, categories, and ticket statuses</p>
      </div>
      
      {/* Departments */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Building className="h-5 w-5 mr-2 text-blue-600" />
              Departments
            </h3>
            <button
              onClick={() => setShowAddDepartmentModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2 shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Department</span>
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {departments.map((dept) => (
              <div key={dept.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{dept.name}</p>
                    <p className="text-sm text-gray-500">{dept.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Edit clicked for department:', dept.id);
                      handleEditClick(dept, 'department');
                    }}
                    className="text-blue-600 hover:text-blue-900 transition-colors p-2 rounded hover:bg-blue-50 flex items-center space-x-1"
                    title="Edit Department"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="text-xs">Edit</span>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Delete clicked for department:', dept.id);
                      handleDeleteDepartment(dept.id);
                    }}
                    className="text-red-600 hover:text-red-900 transition-colors p-2 rounded hover:bg-red-50 flex items-center space-x-1"
                    title="Delete Department"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="text-xs">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Tag className="h-5 w-5 mr-2 text-green-600" />
              Categories
            </h3>
            <button
              onClick={() => setShowAddCategoryModal(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Category</span>
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Tag className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-500">{category.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Edit clicked for category:', category.id);
                      handleEditClick(category, 'category');
                    }}
                    className="text-blue-600 hover:text-blue-900 transition-colors p-2 rounded hover:bg-blue-50 flex items-center space-x-1"
                    title="Edit Category"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="text-xs">Edit</span>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Delete clicked for category:', category.id);
                      handleDeleteCategory(category.id);
                    }}
                    className="text-red-600 hover:text-red-900 transition-colors p-2 rounded hover:bg-red-50 flex items-center space-x-1"
                    title="Delete Category"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="text-xs">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statuses */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Flag className="h-5 w-5 mr-2 text-purple-600" />
              Statuses
            </h3>
            <button
              onClick={() => setShowAddStatusModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2 shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Status</span>
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {statuses.map((status) => (
              <div key={status.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: status.color + '20' }}>
                    <Flag className="h-5 w-5" style={{ color: status.color }} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{status.name}</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></div>
                      <span className="text-sm text-gray-500">Color: {status.color}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Edit clicked for status:', status.id);
                      handleEditClick(status, 'status');
                    }}
                    className="text-blue-600 hover:text-blue-900 transition-colors p-2 rounded hover:bg-blue-50 flex items-center space-x-1"
                    title="Edit Status"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="text-xs">Edit</span>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Delete clicked for status:', status.id);
                      handleDeleteStatus(status.id);
                    }}
                    className="text-red-600 hover:text-red-900 transition-colors p-2 rounded hover:bg-red-50 flex items-center space-x-1"
                    title="Delete Status"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="text-xs">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Render Profile View
  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Hello, {user.name}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username (Cannot be changed)</label>
              <input
                type="text"
                value={user.name}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role (Cannot be changed)</label>
              <input
                type="text"
                value="IT Manager"
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
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
            <button
              onClick={() => setShowChangePasswordModal(true)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Lock className="h-4 w-4" />
              <span>Change Password</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-blue-600">AG Abstract Group</h1>
                <p className="text-gray-600">IT Ticket Management System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="h-6 w-6" />
                  {notifications.filter(n => n.unread).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.filter(n => n.unread).length}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.unread ? 'bg-blue-400' : 'bg-gray-300'
                            }`}></div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    RS
                  </div>
                  <span className="hidden md:block text-sm font-medium">Rahul</span>
                </button>
                
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Rahul Sharma</h3>
                      <p className="text-sm text-gray-600">IT Manager</p>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">rahul@abstractgroup.com</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">+91 98765 43210</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Employee ID: EMP-0004</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Department: IT</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Location: Mumbai, India</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Last Login: Today, 10:00 am</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-blue-600">Reporting To: Rahul Sharma (IT Manager)</span>
                        </div>
                      </div>
                      <div className="pt-4 space-y-2">
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            setActiveView('profile');
                          }}
                          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          View full profile
                        </button>
                        <button
                          onClick={actions.logout}
                          className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          Logout
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

      {/* Sidebar */}
      <div className="fixed left-0 top-16 w-64 h-full bg-blue-50 shadow-lg z-30">
        <div className="p-4 border-b border-blue-200">
          <h2 className="text-lg font-bold text-blue-800">Abstract Group</h2>
          <p className="text-sm text-blue-600">IT Ticket Management System</p>
        </div>
        <nav className="mt-4">
          <ul className="space-y-2 px-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleViewChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeView === item.id
                        ? 'bg-blue-100 text-blue-800 border-r-2 border-blue-800'
                        : 'text-blue-600 hover:bg-blue-100 hover:text-blue-800'
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
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-200 bg-blue-50">
          <p className="text-sm text-blue-600 mb-2">Logged in as Rahul Sharma</p>
          <button
            onClick={actions.logout}
            className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 pt-16">
        <main className="p-8">
          {activeView === 'dashboard' && renderDashboard()}
          {activeView === 'tickets' && renderTickets()}
          {activeView === 'agents' && renderAgents()}
          {activeView === 'settings' && renderSettings()}
          {activeView === 'profile' && renderProfile()}
          {activeView === 'create-ticket' && (
            <div className="space-y-6">
              {/* Welcome Section */}
              <div>
                <h1 className="text-2xl font-bold text-blue-600">Welcome, Rahul</h1>
                <p className="text-gray-600">IT Manager - IT Department</p>
              </div>

              {/* Page Title */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Create New Ticket</h2>
                <p className="text-gray-600 mt-2">Submit a new support ticket for assistance.</p>
              </div>

              {/* Ticket Information Form */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Ticket Information</h3>
                <form onSubmit={handleTicketSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        data-testid="ticket-fullName"
                        value={ticketForm.fullName}
                        onChange={handleTicketFormChange}
                        placeholder="Enter full name"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.fullName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.fullName && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        data-testid="ticket-email"
                        value={ticketForm.email}
                        onChange={handleTicketFormChange}
                        placeholder="Enter email address"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department <span className="text-red-500">*</span>
                      </label>
                      <select 
                        name="department"
                        data-testid="ticket-department"
                        value={ticketForm.department}
                        onChange={handleTicketFormChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.department ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select department</option>
                        <option value="IT">IT</option>
                        <option value="HR">HR</option>
                        <option value="Finance">Finance</option>
                        <option value="Admin">Admin</option>
                      </select>
                      {formErrors.department && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.department}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select 
                        name="category"
                        data-testid="ticket-category"
                        value={ticketForm.category}
                        onChange={handleTicketFormChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.category ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select category</option>
                        <option value="Hardware">Hardware</option>
                        <option value="Software">Software</option>
                        <option value="Network">Network</option>
                        <option value="Business">Business</option>
                      </select>
                      {formErrors.category && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority <span className="text-red-500">*</span>
                      </label>
                      <select 
                        name="priority"
                        data-testid="ticket-priority"
                        value={ticketForm.priority}
                        onChange={handleTicketFormChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.priority ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select priority</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                      {formErrors.priority && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.priority}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="subject"
                        data-testid="ticket-subject"
                        value={ticketForm.subject}
                        onChange={handleTicketFormChange}
                        placeholder="Brief description of the issue"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.subject ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.subject && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.subject}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Image Upload Section - Added before description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attach Image (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      {imagePreview ? (
                        <div className="space-y-4">
                          <div className="mx-auto max-w-xs">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="w-full h-auto rounded-lg shadow-sm"
                            />
                          </div>
                          <div className="flex items-center justify-center space-x-4">
                            <button
                              type="button"
                              onClick={() => document.getElementById('image-upload').click()}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                            >
                              <Upload className="h-4 w-4" />
                              <span>Change Image</span>
                            </button>
                            <button
                              type="button"
                              onClick={removeImage}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                            >
                              <X className="h-4 w-4" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-center">
                            <Image className="h-12 w-12 text-gray-400" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-2">
                              Drag and drop an image here, or click to browse
                            </p>
                            <button
                              type="button"
                              onClick={() => document.getElementById('image-upload').click()}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
                            >
                              <Upload className="h-4 w-4" />
                              <span>Upload Image</span>
                            </button>
                          </div>
                          <p className="text-xs text-gray-500">
                            Supports: JPG, PNG, GIF (Max 5MB)
                          </p>
                        </div>
                      )}
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      name="description"
                      data-testid="ticket-description"
                      value={ticketForm.description}
                      onChange={handleTicketFormChange}
                      placeholder="Provide detailed information about the issue..."
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                    ></textarea>
                    {formErrors.description && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 pt-4">
                    <button
                      type="submit"
                      data-testid="ticket-submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Submit Ticket
                    </button>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="bg-white text-gray-700 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Reset Form
                    </button>
                  </div>
                </form>
              </div>

              {/* Need Help Section */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Need Help?</h3>
                <p className="text-blue-700">
                  Please provide as much detail as possible when describing your issue. This helps our support team resolve your ticket faster. You'll receive a confirmation email with your ticket ID once submitted.
                </p>
              </div>
            </div>
          )}
        </main>
        
        {/* Footer */}
        <footer className="ml-64 bg-white border-t border-gray-200 py-4">
          <div className="px-8">
            <p className="text-sm text-gray-500 text-center">
              Copyright © 2023 Abstract Group. IT Ticket Management System.
            </p>
          </div>
        </footer>
      </div>

      {/* Modals */}
      {(showTicketModal || testMode) && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-blue-600" />
                  Ticket Details - {selectedTicket.id}
                </h3>
                <button
                  onClick={() => {
                    console.log('Closing ticket modal');
                    setShowTicketModal(false);
                    setSelectedTicket(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ticket ID</label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm font-mono">{selectedTicket.id}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    selectedTicket.status === 'New' ? 'bg-blue-100 text-blue-800' :
                    selectedTicket.status === 'Open' ? 'bg-orange-100 text-orange-800' :
                    selectedTicket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    selectedTicket.status === 'Solved' ? 'bg-green-100 text-green-800' :
                    selectedTicket.status === 'Closed' ? 'bg-gray-100 text-gray-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedTicket.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    selectedTicket.priority === 'High' ? 'bg-red-100 text-red-800' :
                    selectedTicket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    selectedTicket.priority === 'Low' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedTicket.priority}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm">{selectedTicket.category}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Created By</label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm">{selectedTicket.createdBy}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm">{selectedTicket.assigned}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm">{selectedTicket.department}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Created Date</label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm">{selectedTicket.created}</div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm font-medium">{selectedTicket.title}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm min-h-[100px] whitespace-pre-wrap">
                  {selectedTicket.description || 'No description provided'}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => {
                  console.log('Closing ticket modal');
                  setShowTicketModal(false);
                  setSelectedTicket(null);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowTicketModal(false);
                  setSelectedTicket(null);
                  handleEditClick(selectedTicket, 'ticket');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      <CreateTicketModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {/* Add Agent Modal */}
      {(showAddAgentModal || testMode) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New Agent</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                    data-testid="agent-username"
                  value={newAgent.username}
                  onChange={(e) => setNewAgent({...newAgent, username: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                    data-testid="agent-email"
                  value={newAgent.email}
                  onChange={(e) => setNewAgent({...newAgent, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={newAgent.role}
                  onChange={(e) => setNewAgent({...newAgent, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="L1 Agent">L1 Agent</option>
                  <option value="L2 Agent">L2 Agent</option>
                  <option value="IT Manager">IT Manager</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  value={newAgent.department}
                  onChange={(e) => setNewAgent({...newAgent, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddAgentModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                data-testid="add-agent-submit"
                onClick={handleAddAgentSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Agent
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {(showAddDepartmentModal || testMode) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New Department</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                <input
                  type="text"
                  data-testid="dept-name"
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter department name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newDepartment.description}
                  onChange={(e) => setNewDepartment({...newDepartment, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter department description"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddDepartmentModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                data-testid="add-dept-submit"
                onClick={handleAddDepartmentSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Department
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {(showAddCategoryModal || testMode) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New Category</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input
                  type="text"
                  data-testid="cat-name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter category description"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                data-testid="add-cat-submit"
                onClick={handleAddCategorySubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Status Modal */}
      {(showAddStatusModal || testMode) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New Status</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status Name</label>
                <input
                  type="text"
                  data-testid="status-name"
                  value={newStatus.name}
                  onChange={(e) => setNewStatus({...newStatus, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter status name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <input
                  type="color"
                  value={newStatus.color}
                  onChange={(e) => setNewStatus({...newStatus, color: e.target.value})}
                  className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddStatusModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                data-testid="add-status-submit"
                onClick={handleAddStatusSubmit}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Universal Edit Modal */}
      {(showEditModal || testMode) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Edit className="h-5 w-5 mr-2 text-blue-600" />
                Edit {editingType?.charAt(0).toUpperCase() + editingType?.slice(1)}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {editingType === 'ticket' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={editFormData.title || ''}
                      onChange={(e) => handleEditFormChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={editFormData.status || ''}
                      onChange={(e) => handleEditFormChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {statuses.map(status => (
                        <option key={status.id} value={status.name}>{status.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={editFormData.priority || ''}
                      onChange={(e) => handleEditFormChange('priority', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                    <select
                      value={editFormData.assigned || ''}
                      onChange={(e) => handleEditFormChange('assigned', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Unassigned">Unassigned</option>
                      {agents.map(agent => (
                        <option key={agent.id} value={agent.username}>{agent.username}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              
              {editingType === 'agent' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      value={editFormData.username || ''}
                      onChange={(e) => handleEditFormChange('username', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editFormData.email || ''}
                      onChange={(e) => handleEditFormChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={editFormData.role || ''}
                      onChange={(e) => handleEditFormChange('role', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="L1 Agent">L1 Agent</option>
                      <option value="L2 Agent">L2 Agent</option>
                      <option value="IT Manager">IT Manager</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select
                      value={editFormData.department || ''}
                      onChange={(e) => handleEditFormChange('department', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.name}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              
              {editingType === 'department' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                    <input
                      type="text"
                      value={editFormData.name || ''}
                      onChange={(e) => handleEditFormChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={editFormData.description || ''}
                      onChange={(e) => handleEditFormChange('description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                </>
              )}
              
              {editingType === 'category' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                    <input
                      type="text"
                      value={editFormData.name || ''}
                      onChange={(e) => handleEditFormChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={editFormData.description || ''}
                      onChange={(e) => handleEditFormChange('description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                </>
              )}
              
              {editingType === 'status' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status Name</label>
                    <input
                      type="text"
                      value={editFormData.name || ''}
                      onChange={(e) => handleEditFormChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <input
                      type="color"
                      value={editFormData.color || '#3B82F6'}
                      onChange={(e) => handleEditFormChange('color', e.target.value)}
                      className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingItem(null);
                  setEditingType(null);
                  setEditFormData({});
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update {editingType?.charAt(0).toUpperCase() + editingType?.slice(1)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {(showChangePasswordModal || testMode) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowChangePasswordModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ITPersonDashboard;