import React, { useState, useRef, useEffect } from 'react';
import { useAppState } from '../../contexts/AppStateContext';
import { LogOut, Bell, User, Mail, Phone, Hash, MapPin, Calendar } from 'lucide-react';
import ProfileModal from './ProfileModal';

const Header = ({ title, showNotifications = false }) => {
  const { state, actions } = useAppState();
  const { currentUser: user, notifications } = state;
  const [showProfile, setShowProfile] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const profileDropdownRef = useRef(null);

  const getRoleColor = (role) => {
    switch (role) {
      case 'employee': return 'text-employee-primary';
      case 'it_manager': return 'text-manager-primary';
      case 'coo': return 'text-coo-primary';
      default: return 'text-gray-700';
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'ceo': return 'Chief Executive Officer';
      case 'coo': return 'Chief Operating Officer';
      case 'manager_l2': return 'L2 Manager';
      case 'manager_l1': return 'L1 Manager';
      case 'it_person': return 'IT Support';
      case 'employee': return 'Employee';
      default: return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${getRoleColor(user.role)}`}>
              {title || `Welcome, ${user.name}`}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {showNotifications && (
              <div className="relative">
                <button
                  onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="h-6 w-6" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
                
                {showNotificationDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-gray-500 text-center">No notifications</div>
                      ) : (
                        notifications.map((notification) => (
                          <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                            <div className="flex items-start space-x-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                notification.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                              }`}></div>
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(notification.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{getInitials(user.name)}</span>
                </div>
                <span className="hidden md:block text-sm font-medium">{user.name}</span>
              </button>
              
              {showProfile && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  {/* Profile Header */}
                  <div className="bg-blue-600 p-4 rounded-t-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-blue-200">
                        <span className="text-blue-600 font-bold text-lg">{getInitials(user.name)}</span>
                      </div>
                      <div>
                        <h3 className="text-white text-lg font-semibold">{user.name}</h3>
                        <p className="text-blue-100 text-sm">{getRoleDisplayName(user.role)}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Profile Details */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="text-sm text-gray-900">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Phone:</span>
                        <span className="text-sm text-gray-900">{user.phone}</span>
                      </div>
                    )}
                    {user.employeeId && (
                      <div className="flex items-center space-x-3">
                        <Hash className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Employee ID:</span>
                        <span className="text-sm text-gray-900">{user.employeeId}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Department:</span>
                      <span className="text-sm text-gray-900">{user.department}</span>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    {user.location && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Location:</span>
                        <span className="text-sm text-gray-900">{user.location}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Last Login:</span>
                      <span className="text-sm text-gray-900">17 Oct 2025, 9:30 AM</span>
                    </div>
                    
                    {/* Reporting Structure */}
                    {user.reportsTo && (
                      <div className="bg-blue-50 p-3 rounded-lg mt-4">
                        <span className="text-sm text-gray-600">Reports to</span>
                        <div className="text-sm text-blue-600 font-medium mt-1">{user.reportsTo}</div>
                  </div>
                    )}
                    
                    {/* Actions */}
                    <div className="pt-4 border-t border-gray-200 space-y-2">
                    <button
                      onClick={() => {
                        setShowProfile(false);
                        setShowProfileModal(true);
                      }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <User className="h-4 w-4" />
                        <span>View Full Profile</span>
                    </button>
                    <button
                      onClick={actions.logout}
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

      {/* Profile Modal */}
      <ProfileModal
        user={user}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </header>
  );
};

export default Header;

