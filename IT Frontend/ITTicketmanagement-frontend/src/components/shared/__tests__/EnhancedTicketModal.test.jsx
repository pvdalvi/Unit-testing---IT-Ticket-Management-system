import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EnhancedTicketModal from '../EnhancedTicketModal';

const mockActions = {
  addComment: jest.fn(),
  assignTicket: jest.fn(),
  escalateTicket: jest.fn(),
  resolveTicket: jest.fn(),
  rejectTicket: jest.fn(),
  closeTicket: jest.fn(),
  logHours: jest.fn(),
  addToTeam: jest.fn()
};

const mockState = {
  currentUser: { id: 12, name: 'Test User', role: 'employee' },
  users: [
    { id: 8, name: 'Rahul', role: 'it_person' },
    { id: 5, name: 'Deepak', role: 'manager_l1' }
  ]
};

jest.mock('../../../contexts/AppStateContext', () => ({
  useAppState: () => ({ state: mockState, actions: mockActions })
}));

describe('EnhancedTicketModal', () => {
  const ticket = {
    id: 't1',
    title: 'Test Ticket',
    description: 'Details',
    historyLog: [{ id: 1, action: 'Ticket Created', user: 'Tara', comment: 'Created', timestamp: new Date().toISOString() }],
    comments: [{ id: 1, author: 'Alice', content: 'Please fix', timestamp: new Date().toISOString() }],
    priority: 'high',
    status: 'open',
    slaStatus: 'on-track',
    workingTeam: [],
    hoursLogged: 0,
    estimatedHours: 2,
    createdBy: 'Tara',
    createdByEmail: 'tara@abstractgroup.com',
    department: 'Operations',
    category: 'Hardware',
    subcategory: 'Laptop'
  };

  test('renders details, timeline and comments tabs, and allows adding comment', () => {
    const onClose = jest.fn();

    render(
      <EnhancedTicketModal
        isOpen={true}
        onClose={onClose}
        ticket={ticket}
      />
    );

    // Details tab visible
    expect(screen.getByText('Ticket Details - t1')).toBeInTheDocument();

    // Switch to Timeline
    fireEvent.click(screen.getByText('Timeline'));
    expect(screen.getByText('Ticket Created')).toBeInTheDocument();

    // Switch to Comments
    fireEvent.click(screen.getByText('Comments'));
    expect(screen.getByText('Please fix')).toBeInTheDocument();

    // Switch to Actions and add a comment via action modal
    fireEvent.click(screen.getByText('Actions'));
    fireEvent.click(screen.getByText('Add Comment'));

    // Enter comment in action modal and confirm
    const actionComment = screen.getByPlaceholderText('Enter comment...');
    fireEvent.change(actionComment, { target: { value: 'New comment' } });
    fireEvent.click(screen.getByText('Confirm'));

    expect(mockActions.addComment).toHaveBeenCalledWith('t1', 'Test User', 'New comment');
  });
});
