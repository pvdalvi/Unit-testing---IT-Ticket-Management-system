import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock AppStateContext
const mockActions = { logout: jest.fn() };
const mockState = {
  currentUser: { name: 'Rashmi Desai', email: 'rashmi@ex.com', role: 'manager_l1', phone: '+91 99999', employeeId: 'EMP-1', department: 'Operations' },
  notifications: [{ id: 1, title: 'Test', message: 'Hello', timestamp: new Date().toISOString(), type: 'info' }]
};

jest.mock('../../../contexts/AppStateContext', () => ({
  useAppState: () => ({ state: mockState, actions: mockActions })
}));

// Mock ProfileModal to keep tests focused
jest.mock('../ProfileModal', () => ({ user, isOpen, onClose }) => (
  <div data-testid="profile-modal-mock">{isOpen ? 'PROFILE OPEN' : 'PROFILE CLOSED'}</div>
));

import Header from '../Header';

describe('Header', () => {
  test('renders title and notifications and profile dropdown', () => {
    render(<Header title="Custom Title" showNotifications={true} />);

    expect(screen.getByText('Custom Title')).toBeInTheDocument();

    // Notification button present (badge shows count)
    const badge = screen.getByText('1');
    const bell = badge.closest('button');
    expect(bell).toBeTruthy();

    // Click notifications to open dropdown
    fireEvent.click(bell);
    expect(screen.getByText('Notifications')).toBeInTheDocument();

    // Profile dropdown
    const profileButton = screen.getByText(/Rashmi Desai/);
    fireEvent.click(profileButton);
    expect(screen.getByText(/View Full Profile/i)).toBeInTheDocument();

    // Logout should call action
    fireEvent.click(screen.getByText(/Logout/i));
    expect(mockActions.logout).toHaveBeenCalled();
  });
});
