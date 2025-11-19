// Hardcoded users data with new hierarchy
export const users = [
  // CEO
  {
    id: 1,
    name: "Vikas",
    email: "vikas@abstractgroup.com",
    password: "123",
    role: "ceo",
    department: "Executive",
    phone: "+91 98765-43210",
    location: "Mumbai, India",
    employeeId: "EMP-2023-001"
  },
  // COO
  {
    id: 2,
    name: "Rashmi Desai",
    email: "rashmi@abstractgroup.com",
    password: "123",
    role: "coo",
    department: "Executive",
    phone: "+91 98765-43211",
    location: "Mumbai, India",
    employeeId: "EMP-2023-002"
  },
  // L2 Managers
  {
    id: 3,
    name: "Anjali Verma",
    email: "anjali@abstractgroup.com",
    password: "123",
    role: "manager_l2",
    department: "IT",
    phone: "+91 98765-43210",
    location: "Mumbai, India",
    employeeId: "EMP-2023-003",
    reportsTo: "Rashmi Desai"
  },
  {
    id: 4,
    name: "Rohan Mehta",
    email: "rohan@abstractgroup.com",
    password: "123",
    role: "manager_l2",
    department: "HR",
    phone: "+91 98765-43212",
    location: "Mumbai, India",
    employeeId: "EMP-2023-004",
    reportsTo: "Rashmi Desai"
  },
  // L1 Managers
  {
    id: 5,
    name: "Deepak Kumar",
    email: "deepak@abstractgroup.com",
    password: "123",
    role: "manager_l1",
    department: "IT",
    phone: "+91 98765-43213",
    location: "Mumbai, India",
    employeeId: "EMP-2023-005",
    reportsTo: "Anjali Verma"
  },
  {
    id: 6,
    name: "Kavita Verma",
    email: "kavita@abstractgroup.com",
    password: "123",
    role: "manager_l1",
    department: "HR",
    phone: "+91 98765-43214",
    location: "Mumbai, India",
    employeeId: "EMP-2023-006",
    reportsTo: "Rohan Mehta"
  },
  {
    id: 7,
    name: "Simran Patel",
    email: "simran@abstractgroup.com",
    password: "123",
    role: "manager_l1",
    department: "Finance",
    phone: "+91 98765-43215",
    location: "Mumbai, India",
    employeeId: "EMP-2023-007",
    reportsTo: "Anjali Verma"
  },
  // IT Persons
  {
    id: 8,
    name: "Rahul",
    email: "rahul@abstractgroup.com",
    password: "123",
    role: "it_person",
    department: "IT"
  },
  {
    id: 9,
    name: "Sneha",
    email: "sneha@abstractgroup.com",
    password: "123",
    role: "it_person",
    department: "IT"
  },
  {
    id: 10,
    name: "Amit",
    email: "amit@abstractgroup.com",
    password: "123",
    role: "it_person",
    department: "IT"
  },
  {
    id: 11,
    name: "Vikas",
    email: "vikas@abstractgroup.com",
    password: "123",
    role: "it_person",
    department: "IT"
  },
  // Employees
  {
    id: 12,
    name: "Tara Singh",
    email: "tara@abstractgroup.com",
    password: "123",
    role: "employee",
    department: "Operations",
    phone: "+91 98765-43220",
    location: "Mumbai, India",
    employeeId: "EMP-2023-012",
    reportsTo: "Deepak Kumar"
  },
  {
    id: 13,
    name: "Alex Johnson",
    email: "alex@abstractgroup.com",
    password: "123",
    role: "employee",
    department: "Operations",
    phone: "+91 98765-43221",
    location: "Mumbai, India",
    employeeId: "EMP-2023-013",
    reportsTo: "Deepak Kumar"
  },
  {
    id: 14,
    name: "Radha Sharma",
    email: "radha@abstractgroup.com",
    password: "123",
    role: "employee",
    department: "Operations",
    phone: "+91 98765-43222",
    location: "Mumbai, India",
    employeeId: "EMP-2023-014",
    reportsTo: "Kavita Verma"
  },
  {
    id: 15,
    name: "Neha Gupta",
    email: "neha@abstractgroup.com",
    password: "123",
    role: "employee",
    department: "Operations",
    phone: "+91 98765-43223",
    location: "Mumbai, India",
    employeeId: "EMP-2023-015",
    reportsTo: "Kavita Verma"
  },
  {
    id: 16,
    name: "Priya Patel",
    email: "priya@abstractgroup.com",
    password: "123",
    role: "employee",
    department: "Operations",
    phone: "+91 98765-43224",
    location: "Mumbai, India",
    employeeId: "EMP-2023-016",
    reportsTo: "Simran Patel"
  }
];

// Categories and subcategories
export const categories = {
  "Hardware": ["Laptop Issues", "Desktop Problems", "Printer Issues", "Network Equipment"],
  "Software": ["Application Issues", "System Updates", "License Problems", "Performance Issues"],
  "Network": ["Internet Connectivity", "VPN Issues", "Email Problems", "Server Issues"],
  "Security": ["Password Reset", "Access Issues", "Security Alerts", "Compliance"]
};

// Sample tickets data with new users
export const tickets = [
  {
    id: "TCK-2025-0342",
    employee: "Sneha Kumar",
    employeeEmail: "sneha@abstract.com",
    department: "IT",
    category: "Hardware",
    subcategory: "Laptop Issues",
    subject: "Laptop screen flickering",
    description: "My laptop screen is flickering intermittently, making it difficult to work.",
    priority: "high",
    status: "New",
    assignedL1: null,
    assignedL2: null,
    assigned: "Unassigned",
    dateCreated: "2025-10-17T09:30:00Z",
    lastUpdated: "2025-10-17T09:30:00Z",
    slaStatus: "on-track",
    comments: [
      {
        id: 1,
        author: "Sneha Kumar",
        timestamp: "2025-10-17T09:30:00Z",
        content: "Initial ticket creation"
      }
    ],
    attachments: []
  },
  {
    id: "TCK-2025-0341",
    employee: "Rohan Mehta",
    employeeEmail: "rohan@abstract.com",
    department: "HR",
    category: "Software",
    subcategory: "Application Issues",
    subject: "Cannot access payroll system",
    description: "Unable to access the payroll system. Getting authentication error.",
    priority: "medium",
    status: "Open",
    assignedL1: null,
    assignedL2: null,
    assigned: "Alex",
    dateCreated: "2025-10-16T14:20:00Z",
    lastUpdated: "2025-10-16T16:45:00Z",
    slaStatus: "on-track",
    comments: [
      {
        id: 1,
        author: "Rohan Mehta",
        timestamp: "2025-10-16T14:20:00Z",
        content: "Initial ticket creation"
      },
      {
        id: 2,
        author: "Alex",
        timestamp: "2025-10-16T16:45:00Z",
        content: "Looking into the issue. Will update soon."
      }
    ],
    attachments: []
  },
  {
    id: "TCK-2025-0340",
    employee: "Priya Shah",
    employeeEmail: "priya@abstract.com",
    department: "Finance",
    category: "Network",
    subcategory: "Internet Connectivity",
    subject: "Slow internet connection",
    description: "Internet connection is very slow, affecting productivity.",
    priority: "medium",
    status: "In Progress",
    assignedL1: null,
    assignedL2: null,
    assigned: "Tara",
    dateCreated: "2025-10-15T11:15:00Z",
    lastUpdated: "2025-10-15T15:30:00Z",
    slaStatus: "on-track",
    comments: [
      {
        id: 1,
        author: "Priya Shah",
        timestamp: "2025-10-15T11:15:00Z",
        content: "Initial ticket creation"
      },
      {
        id: 2,
        author: "Tara",
        timestamp: "2025-10-15T15:30:00Z",
        content: "Working on network optimization."
      }
    ],
    attachments: []
  },
  {
    id: "TCK-2025-0339",
    employee: "Amit Patel",
    employeeEmail: "amit@abstract.com",
    department: "IT",
    category: "Access",
    subcategory: "Permission Issues",
    subject: "Need admin access to server",
    description: "Need administrative access to the development server for deployment.",
    priority: "high",
    status: "Solved",
    assignedL1: null,
    assignedL2: null,
    assigned: "Rahul",
    dateCreated: "2025-10-14T08:45:00Z",
    lastUpdated: "2025-10-14T10:20:00Z",
    slaStatus: "on-track",
    comments: [
      {
        id: 1,
        author: "Amit Patel",
        timestamp: "2025-10-14T08:45:00Z",
        content: "Initial ticket creation"
      },
      {
        id: 2,
        author: "Rahul",
        timestamp: "2025-10-14T10:20:00Z",
        content: "Access granted. Please check your permissions."
      }
    ],
    attachments: []
  },
  {
    id: "TCK-2025-0338",
    employee: "Neha Gupta",
    employeeEmail: "neha@abstract.com",
    department: "Admin",
    category: "Hardware",
    subcategory: "Printer Issues",
    subject: "Printer not working",
    description: "Office printer is not responding. Shows offline status.",
    priority: "low",
    status: "Closed",
    assignedL1: null,
    assignedL2: null,
    assigned: "Alex",
    dateCreated: "2025-10-13T16:30:00Z",
    lastUpdated: "2025-10-13T17:00:00Z",
    slaStatus: "on-track",
    comments: [
      {
        id: 1,
        author: "Neha Gupta",
        timestamp: "2025-10-13T16:30:00Z",
        content: "Initial ticket creation"
      },
      {
        id: 2,
        author: "Alex",
        timestamp: "2025-10-13T17:00:00Z",
        content: "Printer issue resolved. Maintenance completed."
      }
    ],
    attachments: []
  }
];

// Notifications for COO
export const notifications = [
  {
    id: 1,
    title: "SLA Breach Alert",
    message: "Ticket TKT-003 has breached SLA",
    timestamp: "2024-01-13T15:30:00Z",
    type: "warning"
  },
  {
    id: 2,
    title: "High Priority Ticket",
    message: "New high priority ticket TKT-001 created",
    timestamp: "2024-01-15T09:30:00Z",
    type: "info"
  },
  {
    id: 3,
    title: "System Maintenance",
    message: "Scheduled maintenance tonight at 2 AM",
    timestamp: "2024-01-14T10:00:00Z",
    type: "info"
  }
];

// KPI data
export const kpiData = {
  totalTickets: 156,
  pendingTickets: 23,
  closedTickets: 98,
  slaCompliance: 87.5,
  avgClosureTime: "2.3 days",
  ticketsBreached: 12
};
