import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

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
  currentUser: { id: 2, name: 'Manager', role: 'manager_l1' },
  users: [ { id: 8, name: 'Rahul', role: 'it_person' }, { id: 5, name: 'Deepak', role: 'manager_l1' } ]
};

jest.mock('../../../contexts/AppStateContext', () => ({
  useAppState: () => ({ state: mockState, actions: mockActions })
}));

import EnhancedTicketModal from '../EnhancedTicketModal';

describe('EnhancedTicketModal extra actions', () => {
  const ticket = {
    id: 't2',
    title: 'Assign Test',
    description: 'Details',
    historyLog: [],
    comments: [],
    priority: 'medium',
    status: 'open',
    slaStatus: 'on-track',
    workingTeam: [],
    hoursLogged: 0,
    estimatedHours: 2,
    createdBy: 'User',
    createdByEmail: 'user@ex.com',
    department: 'IT',
    category: 'Hardware',
    subcategory: 'Printer'
  };

  beforeEach(() => jest.clearAllMocks());

  test('assign flow: open action modal, select user, add comment, confirm', () => {
    render(<EnhancedTicketModal isOpen={true} onClose={() => {}} ticket={ticket} />);

    fireEvent.click(screen.getByText('Actions'));
    // Assign button should exist for open status and manager role
    const assignBtn = screen.getByText('Assign');
    fireEvent.click(assignBtn);

    // Select user (select is a combobox)
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Rahul' } });

    // Enter comment
    const textarea = screen.getByPlaceholderText(/Enter comment.../i);
    fireEvent.change(textarea, { target: { value: 'Please take this' } });

    fireEvent.click(screen.getByText('Confirm'));
    expect(mockActions.assignTicket).toHaveBeenCalledWith('t2', 'Rahul', 'Manager', 'Please take this');
  });

  test('log hours validation shows alert for invalid hours', () => {
    global.alert = jest.fn();
    render(<EnhancedTicketModal isOpen={true} onClose={() => {}} ticket={{...ticket, status: 'assigned'}} />);

    fireEvent.click(screen.getByText('Actions'));
    fireEvent.click(screen.getByText('Log Hours'));

    // Confirm without entering hours
    fireEvent.click(screen.getByText('Confirm'));
    expect(global.alert).toHaveBeenCalled();
  });
});
