import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppState } from '../../contexts/AppStateContext';
import { 
  LayoutDashboard, 
  Ticket, 
  Plus, 
  Users, 
  CheckCircle, 
  Download,
  BarChart3,
  Shield,
  FileText,
  User
} from 'lucide-react';

const Sidebar = () => {
  const { state } = useAppState();
  const { currentUser } = state;
  const role = currentUser?.role;
  const getRoleColor = (role) => {
    switch (role) {
      case 'employee': return 'employee';
      case 'it_person': return 'manager';
      case 'manager_l1': return 'blue';
      case 'manager_l2': return 'blue';
      case 'coo': return 'coo';
      case 'ceo': return 'coo';
      default: return 'gray';
    }
  };

  const roleColor = getRoleColor(role);

  const getSidebarItems = (role) => {
    switch (role) {
      case 'employee':
        return [
          { path: '/employee/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/employee/tickets', label: 'My Tickets', icon: Ticket },
          { path: '/employee/create-ticket', label: 'Create Ticket', icon: Plus }
        ];
      case 'it_person':
        return [
          { path: '/it-manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/it-manager/create-ticket', label: 'Create Ticket', icon: Plus },
          { path: '/it-manager/tickets', label: 'Tickets', icon: Ticket },
          { path: '/it-manager/agents', label: 'Agents', icon: Users },
          { path: '/it-manager/settings', label: 'Settings', icon: FileText },
          { path: '/it-manager/myprofile', label: 'My Profile', icon: User }
        ];
      case 'manager_l1':
        return [
          { path: '/manager-l1/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/manager-l1/tickets', label: 'Tickets', icon: Ticket },
          { path: '/manager-l1/approvals', label: 'Approvals', icon: CheckCircle },
          { path: '/manager-l1/reports', label: 'Reports', icon: BarChart3 },
          { path: '/manager-l1/profile', label: 'Profile', icon: User }
        ];
      case 'manager_l2':
        return [
          { path: '/manager-l2/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/manager-l2/tickets', label: 'Tickets', icon: Ticket },
          { path: '/manager-l2/approvals', label: 'Approvals', icon: CheckCircle },
          { path: '/manager-l2/reports', label: 'Reports', icon: BarChart3 },
          { path: '/manager-l2/profile', label: 'Profile', icon: User }
        ];
      case 'coo':
        return [
          { path: '/coo/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/coo/reports-and-metrics', label: 'Reports & Metrics', icon: BarChart3 },
          { path: '/coo/sla-compliance', label: 'SLA Compliance', icon: Shield },
          { path: '/coo/approval-query', label: 'Approval Query', icon: CheckCircle },
          { path: '/coo/export-data', label: 'Export Data', icon: Download },
          { path: '/coo/my-profile', label: 'My Profile', icon: User }
        ];
      case 'ceo':
        return [
          { path: '/ceo/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/coo/reports-and-metrics', label: 'Reports & Metrics', icon: BarChart3 },
          { path: '/coo/sla-compliance', label: 'SLA Compliance', icon: Shield },
          { path: '/coo/approval-query', label: 'Approval Query', icon: CheckCircle },
          { path: '/coo/export-data', label: 'Export Data', icon: Download },
          { path: '/coo/my-profile', label: 'My Profile', icon: User }
        ];
      default:
        return [];
    }
  };

  const sidebarItems = getSidebarItems(role);

  return (
    <aside className={`w-64 bg-${roleColor}-primary text-white min-h-screen fixed left-0 top-0 pt-20`}>
      <nav className="mt-8">
        <ul className="space-y-2 px-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? `bg-${roleColor}-secondary text-white` 
                        : 'text-white hover:bg-white hover:bg-opacity-10'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
