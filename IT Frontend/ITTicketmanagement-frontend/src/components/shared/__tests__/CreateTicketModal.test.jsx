import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

const mockActions = { createTicket: jest.fn() };
jest.mock('../../../contexts/AppStateContext', () => ({
  useAppState: () => ({ state: { currentUser: { name: 'Ajay', email: 'ajay@ex.com', department: 'IT' }, categories: { Hardware: ['Laptop', 'Printer'] } }, actions: mockActions })
}));

import CreateTicketModal from '../CreateTicketModal';

describe('CreateTicketModal', () => {
  test('validation shows errors and successful submit calls createTicket', () => {
    const onClose = jest.fn();
    render(<CreateTicketModal isOpen={true} onClose={onClose} />);

    // Submit without filling should show validation errors
    fireEvent.click(screen.getByText(/Create Ticket/i));
    expect(screen.getByText(/Title is required/i)).toBeInTheDocument();

    // Fill required fields
    fireEvent.change(screen.getByPlaceholderText(/Enter ticket title/i), { target: { value: 'My Issue' } });
    const [categorySelect, subcategorySelect] = screen.getAllByRole('combobox');
    fireEvent.change(categorySelect, { target: { value: 'Hardware' } });
    fireEvent.change(subcategorySelect, { target: { value: 'Laptop' } });
    fireEvent.change(screen.getByPlaceholderText(/Describe your issue/i), { target: { value: 'Broken screen' } });

    // Submit again
    fireEvent.click(screen.getByText(/Create Ticket/i));
    expect(mockActions.createTicket).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});
