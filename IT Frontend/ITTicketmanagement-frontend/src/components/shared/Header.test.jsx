import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';

jest.mock('../../contexts/AppStateContext', () => ({
  useAppState: jest.fn(),
}));

// Mock ProfileModal so we can assert on its isOpen prop easily
jest.mock('./ProfileModal', () => (props) => (
  <div data-testid="profile-modal" data-open={props.isOpen ? 'true' : 'false'} />
));

import { useAppState } from '../../contexts/AppStateContext';
import Header from './Header';

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const baseUser = {
    name: 'Jane Doe',
    role: 'employee',
    email: 'jane@example.com',
    phone: '123-456-7890',
    employeeId: 'E123',
    department: 'Engineering',
    location: 'New York',
    reportsTo: 'John Manager',
  };

  test('renders title prop and applies role color class', () => {
    useAppState.mockReturnValue({ state: { currentUser: { ...baseUser, role: 'employee' }, notifications: [] }, actions: { logout: jest.fn() } });

    render(<Header title="Custom Title" />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Custom Title');
    expect(heading.className).toMatch(/text-employee-primary/);
  });

  test('renders default greeting when no title provided and initials for single-name user', () => {
    const singleNameUser = { ...baseUser, name: 'Mononym', role: 'coo' };
    useAppState.mockReturnValue({ state: { currentUser: singleNameUser, notifications: [] }, actions: { logout: jest.fn() } });

    render(<Header />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Welcome, Mononym');
    // Initials for single-name should be first letter
    const initials = screen.getAllByText('M')[0];
    expect(initials).toBeInTheDocument();
  });

  test('getRoleDisplayName covers various roles via rendered label', () => {
    const roles = ['ceo', 'coo', 'manager_l2', 'manager_l1', 'it_person', 'employee', 'custom_role'];

    const expectedFor = (r) => {
      switch (r) {
        case 'ceo': return 'Chief Executive Officer';
        case 'coo': return 'Chief Operating Officer';
        case 'manager_l2': return 'L2 Manager';
        case 'manager_l1': return 'L1 Manager';
        case 'it_person': return 'IT Support';
        case 'employee': return 'Employee';
        default: return r.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
    };

    roles.forEach((r) => {
      useAppState.mockReturnValue({ state: { currentUser: { ...baseUser, role: r }, notifications: [] }, actions: { logout: jest.fn() } });
      const { unmount } = render(<Header />);

      // Role display name appears in the profile dropdown; open it
      const profileBtn = screen.getAllByRole('button').find(b => b.textContent && (b.textContent.includes('JD') || b.textContent.includes('J')));
      if (profileBtn) {
        fireEvent.click(profileBtn);
        const expected = expectedFor(r);
        const matches = screen.queryAllByText(new RegExp(expected, 'i'));
        expect(matches.length).toBeGreaterThan(0);
      }
      unmount();
    });
  });

  test('shows empty notifications message when none exist and toggles dropdown', () => {
    useAppState.mockReturnValue({ state: { currentUser: baseUser, notifications: [] }, actions: { logout: jest.fn() } });

    const { container } = render(<Header showNotifications={true} />);

    // The bell is the first button in the header controls
    const buttons = container.querySelectorAll('button');
    const bell = buttons[0];
    act(() => fireEvent.click(bell));

    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('No notifications')).toBeInTheDocument();
  });

  test('shows notification items and badge count', () => {
    const note = { id: 'n1', title: 'Server Alert', message: 'Server down', timestamp: new Date().toISOString(), type: 'warning' };
    useAppState.mockReturnValue({ state: { currentUser: baseUser, notifications: [note] }, actions: { logout: jest.fn() } });

    const { container } = render(<Header showNotifications={true} />);

    // Badge with the count should be shown
    const badge = screen.getByText('1');
    expect(badge).toBeInTheDocument();

    const buttons = container.querySelectorAll('button');
    const bell = buttons[0];
    act(() => fireEvent.click(bell));

    expect(screen.getByText('Server Alert')).toBeInTheDocument();
    expect(screen.getByText('Server down')).toBeInTheDocument();
  });

  test('profile dropdown shows details and calls logout', () => {
    const logoutMock = jest.fn();
    useAppState.mockReturnValue({ state: { currentUser: baseUser, notifications: [] }, actions: { logout: logoutMock } });

    const { container } = render(<Header />);

    // The profile button shows the initials 'JD' — select by that to avoid
    // ambiguity with other text nodes.
    const profileButton = screen.getByText('JD').closest('button');
    expect(profileButton).toBeInTheDocument();

    // Open dropdown
    act(() => fireEvent.click(profileButton));

    // Check presence of some profile details
    expect(screen.getByText(baseUser.email)).toBeInTheDocument();
    expect(screen.getByText(baseUser.phone)).toBeInTheDocument();
    expect(screen.getByText(baseUser.employeeId)).toBeInTheDocument();
    expect(screen.getByText(baseUser.location)).toBeInTheDocument();
    expect(screen.getByText('Reports to')).toBeInTheDocument();
    expect(screen.getByText(baseUser.reportsTo)).toBeInTheDocument();

    // Click Logout — should call logout action
    const logoutBtn = screen.getByText('Logout').closest('button');
    act(() => fireEvent.click(logoutBtn));
    expect(logoutMock).toHaveBeenCalled();
  });

  test('opens profile modal when clicking View Full Profile', () => {
    useAppState.mockReturnValue({ state: { currentUser: baseUser, notifications: [] }, actions: { logout: jest.fn() } });
    const { container } = render(<Header />);

    const profileButton = screen.getByText('JD').closest('button');
    act(() => fireEvent.click(profileButton));

    const viewProfileBtn = screen.getByText('View Full Profile').closest('button');
    act(() => fireEvent.click(viewProfileBtn));

    const modal = screen.getByTestId('profile-modal');
    expect(modal).toHaveAttribute('data-open', 'true');
  });

  test('clicking outside closes profile dropdown', () => {
    useAppState.mockReturnValue({ state: { currentUser: baseUser, notifications: [] }, actions: { logout: jest.fn() } });

    render(<Header />);

    const profileButton = screen.getByText('Jane Doe').closest('button');
    act(() => fireEvent.click(profileButton));

    // Ensure dropdown content visible
    expect(screen.getByText(baseUser.email)).toBeInTheDocument();

    // Click outside
    act(() => {
      const evt = new MouseEvent('mousedown', { bubbles: true });
      document.dispatchEvent(evt);
    });

    // Now dropdown should be closed — email should not be present
    expect(screen.queryByText(baseUser.email)).toBeNull();
  });
});
