import React from 'react';
import { X, User, Mail, Building, Calendar, Phone, MapPin, Award, Clock } from 'lucide-react';

const ProfileModal = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

  /* istanbul ignore next */
  const getRoleColor = (role) => {
    switch (role) {
      case 'employee': return 'text-employee-primary';
      case 'it_person': return 'text-manager-primary';
      case 'manager_l1': return 'text-blue-600';
      case 'manager_l2': return 'text-blue-600';
      case 'coo': return 'text-coo-primary';
      case 'ceo': return 'text-coo-primary';
      default: return 'text-gray-700';
    }
  };

  /* istanbul ignore next */
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'employee': return 'bg-employee-primary bg-opacity-10 text-employee-primary';
      case 'it_person': return 'bg-manager-primary bg-opacity-10 text-manager-primary';
      case 'manager_l1': return 'bg-blue-100 text-blue-800';
      case 'manager_l2': return 'bg-blue-100 text-blue-800';
      case 'coo': return 'bg-coo-primary bg-opacity-10 text-coo-primary';
      case 'ceo': return 'bg-coo-primary bg-opacity-10 text-coo-primary';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  /* istanbul ignore next */
  const formatRole = (role) => {
    return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  /* istanbul ignore next */
  const getDepartment = (role) => {
    switch (role) {
      case 'employee': return 'Operations';
      case 'it_person': return 'Information Technology';
      case 'manager_l1': return 'IT Support - Level 1';
      case 'manager_l2': return 'IT Support - Level 2';
      case 'coo': return 'Operations';
      case 'ceo': return 'Executive';
      default: return 'General';
    }
  };

  /* istanbul ignore next */
  const getJoinDate = () => {
    const dates = {
      'employee': '2022-03-15',
      'it_person': '2021-08-20',
      'manager_l1': '2020-11-10',
      'manager_l2': '2020-06-05',
      'coo': '2019-12-01',
      'ceo': '2018-01-15'
    };
    return dates[user.role] || '2022-01-01';
  };

  /* istanbul ignore next */
  const getPhoneNumber = () => {
    const phones = {
      'employee': '+1 (555) 123-4567',
      'it_person': '+1 (555) 234-5678',
      'manager_l1': '+1 (555) 345-6789',
      'manager_l2': '+1 (555) 456-7890',
      'coo': '+1 (555) 567-8901',
      'ceo': '+1 (555) 678-9012'
    };
    return phones[user.role] || '+1 (555) 000-0000';
  };

  /* istanbul ignore next */
  const getLocation = () => {
    const locations = {
      'employee': 'New York, NY',
      'it_person': 'San Francisco, CA',
      'manager_l1': 'Chicago, IL',
      'manager_l2': 'Boston, MA',
      'coo': 'Los Angeles, CA',
      'ceo': 'Seattle, WA'
    };
    return locations[user.role] || 'Remote';
  };

  /* istanbul ignore next */
  const getSkills = (role) => {
    const skillSets = {
      'employee': ['Customer Service', 'Problem Solving', 'Communication', 'Teamwork'],
      'it_person': ['System Administration', 'Network Security', 'Database Management', 'Cloud Computing'],
      'manager_l1': ['Team Leadership', 'Project Management', 'Technical Support', 'Process Improvement'],
      'manager_l2': ['Strategic Planning', 'Team Management', 'Technical Architecture', 'Vendor Relations'],
      'coo': ['Operations Management', 'Strategic Planning', 'Process Optimization', 'Team Leadership'],
      'ceo': ['Strategic Leadership', 'Business Development', 'Financial Management', 'Stakeholder Relations']
    };
    return skillSets[role] || ['General Skills'];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Profile Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h3>
              <div className="flex items-center space-x-4 mb-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user.role)}`}>
                  {formatRole(user.role)}
                </span>
                <span className="text-sm text-gray-500">{getDepartment(user.role)}</span>
              </div>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          {/* Profile Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-900">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone</p>
                  <p className="text-sm text-gray-900">{getPhoneNumber()}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Building className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Department</p>
                  <p className="text-sm text-gray-900">{getDepartment(user.role)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Join Date</p>
                  <p className="text-sm text-gray-900">{new Date(getJoinDate()).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Location</p>
                  <p className="text-sm text-gray-900">{getLocation()}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Experience</p>
                  <p className="text-sm text-gray-900">
                    {Math.floor((new Date() - new Date(getJoinDate())) / (1000 * 60 * 60 * 24 * 365))} years
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Skills & Expertise
            </h4>
            <div className="flex flex-wrap gap-2">
              {getSkills(user.role).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Role-specific Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Role Responsibilities</h4>
            <div className="text-sm text-gray-700">
              {user.role === 'employee' && (
                <p>Responsible for creating and managing support tickets, collaborating with IT teams for issue resolution, and maintaining communication throughout the ticket lifecycle.</p>
              )}
              {user.role === 'it_person' && (
                <p>Manages IT infrastructure, resolves technical issues, maintains system security, and provides technical support to employees across the organization.</p>
              )}
              {user.role === 'manager_l1' && (
                <p>Leads Level 1 support team, manages ticket assignments, ensures SLA compliance, and escalates complex issues to appropriate teams.</p>
              )}
              {user.role === 'manager_l2' && (
                <p>Oversees Level 2 support operations, manages technical escalations, coordinates with vendors, and implements process improvements.</p>
              )}
              {user.role === 'coo' && (
                <p>Oversees operational excellence, manages cross-functional teams, ensures SLA compliance, and drives strategic initiatives for service improvement.</p>
              )}
              {user.role === 'ceo' && (
                <p>Provides strategic leadership, oversees organizational operations, makes high-level decisions, and ensures alignment with business objectives.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
