import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockAssign = jest.fn();
const mockEscalate = jest.fn();
const mockResolve = jest.fn();
const mockReject = jest.fn();
const mockClose = jest.fn();
const mockAddComment = jest.fn();
const mockLogHours = jest.fn();
const mockAddToTeam = jest.fn();

const mockActions = {
  assignTicket: mockAssign,
  escalateTicket: mockEscalate,
  resolveTicket: mockResolve,
  rejectTicket: mockReject,
  closeTicket: mockClose,
  addComment: mockAddComment,
  logHours: mockLogHours,
  addToTeam: mockAddToTeam
};

const users = [
  { id: 1, name: 'Rahul', role: 'it_person' },
  { id: 2, name: 'Deepak', role: 'manager_l1' },
  { id: 3, name: 'Minan', role: 'ceo' }
];

const mockState = {
  currentUser: { id: 1, name: 'Rahul', role: 'it_person' },
  users
};

jest.mock('../../../src/contexts/AppStateContext', () => ({
  useAppState: () => ({ state: mockState, actions: mockActions })
}));

import EnhancedTicketModal from './EnhancedTicketModal';

function makeTicket(overrides = {}) {
  return {
    id: 'T-100',
    title: 'Issue title',
    createdBy: 'User A',
    createdByEmail: 'a@example.com',
    department: 'IT',
    category: 'Hardware',
    subcategory: 'Laptop Issues',
    priority: 'high',
    status: 'open',
    slaStatus: 'on-track',
    assignedTo: null,
    workingTeam: [],
    hoursLogged: 0,
    estimatedHours: 4,
    description: 'details here',
    historyLog: [
      { id: 1, action: 'Ticket Created', user: 'User A', timestamp: new Date().toISOString(), comment: 'Created' }
    ],
    comments: [
      { id: 1, author: 'User A', timestamp: new Date().toISOString(), content: 'First comment' }
    ],
    ...overrides
  };
}

describe('EnhancedTicketModal', () => {
  let alertSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  test('renders details, timeline and comments tabs', () => {
    const ticket = makeTicket();
    const onClose = jest.fn();
    render(<EnhancedTicketModal ticket={ticket} isOpen={true} onClose={onClose} />);

    // Details visible
    expect(screen.getByText(/Issue title/)).toBeInTheDocument();
    expect(screen.getByText(/details here/)).toBeInTheDocument();

    // Switch to Timeline
    fireEvent.click(screen.getByText('Timeline'));
    expect(screen.getByText(/Ticket Created/)).toBeInTheDocument();

    // Switch to Comments
    fireEvent.click(screen.getByText('Comments'));
    expect(screen.getByText(/First comment/)).toBeInTheDocument();
  });

  test('assign action opens modal and calls assignTicket', async () => {
    const ticket = makeTicket({ status: 'open' });
    render(<EnhancedTicketModal ticket={ticket} isOpen={true} onClose={() => {}} />);

    // Go to Actions tab
    fireEvent.click(screen.getByText('Actions'));

    // Assign button should be present
    const assignBtn = screen.getByText('Assign');
    fireEvent.click(assignBtn);

    // Modal opens with select of users
    const select = await screen.findByRole('combobox');
    fireEvent.change(select, { target: { value: 'Rahul' } });

    // Confirm
    fireEvent.click(screen.getByText('Confirm'));

    await waitFor(() => expect(mockAssign).toHaveBeenCalledWith('T-100', 'Rahul', 'Rahul', ''));
  });

  test('resolve requires comment (shows alert) then succeeds when comment provided', async () => {
    const ticket = makeTicket({ status: 'assigned' });
    render(<EnhancedTicketModal ticket={ticket} isOpen={true} onClose={() => {}} />);

    fireEvent.click(screen.getByText('Actions'));
    const resolveBtn = screen.getByText('Resolve');
    fireEvent.click(resolveBtn);

    // Confirm with empty comment -> alert
    fireEvent.click(screen.getByText('Confirm'));
    expect(window.alert).toHaveBeenCalled();
    expect(mockResolve).not.toHaveBeenCalled();

    // Provide comment and confirm
    const textarea = screen.getByPlaceholderText(/Enter comment/i) || screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Fix applied' } });
    fireEvent.click(screen.getByText('Confirm'));

    await waitFor(() => expect(mockResolve).toHaveBeenCalledWith('T-100', 'Rahul', 'Fix applied'));
  });

  test('log_hours validates hours then calls logHours', async () => {
    const ticket = makeTicket({ status: 'assigned' });
    render(<EnhancedTicketModal ticket={ticket} isOpen={true} onClose={() => {}} />);

    fireEvent.click(screen.getByText('Actions'));
    fireEvent.click(screen.getByText('Log Hours'));

    // Invalid hours (0) -> alert
    const hoursInput = await screen.findByPlaceholderText(/Enter hours/i) || screen.getByRole('spinbutton');
    fireEvent.change(hoursInput, { target: { value: '0' } });
    fireEvent.click(screen.getByText('Confirm'));
    expect(window.alert).toHaveBeenCalled();
    expect(mockLogHours).not.toHaveBeenCalled();

    // Valid hours
    fireEvent.change(hoursInput, { target: { value: '2' } });
    fireEvent.click(screen.getByText('Confirm'));

    await waitFor(() => expect(mockLogHours).toHaveBeenCalledWith('T-100', 2, 'Rahul'));
  });

  test('add_team requires member then calls addToTeam', async () => {
    const ticket = makeTicket({ status: 'open' });
    render(<EnhancedTicketModal ticket={ticket} isOpen={true} onClose={() => {}} />);

    fireEvent.click(screen.getByText('Actions'));
    fireEvent.click(screen.getByText('Add Team'));

    // Confirm with empty -> alert
    fireEvent.click(screen.getByText('Confirm'));
    expect(window.alert).toHaveBeenCalled();
    expect(mockAddToTeam).not.toHaveBeenCalled();

    // Select member and confirm
    const select = await screen.findByRole('combobox');
    fireEvent.change(select, { target: { value: 'Deepak' } });
    fireEvent.click(screen.getByText('Confirm'));

    await waitFor(() => expect(mockAddToTeam).toHaveBeenCalledWith('T-100', 'Deepak'));
  });
});
