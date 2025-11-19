import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock the context hook used by the component
const mockCreateTicket = jest.fn();
const mockActions = {
  createTicket: mockCreateTicket
};

const mockState = {
  currentUser: { name: 'Test User', email: 'test@example.com', department: 'IT' },
  categories: {
    Hardware: ['Laptop Issues', 'Printer Issues'],
    Software: ['Application Issues']
  }
};

jest.mock('../../../src/contexts/AppStateContext', () => ({
  useAppState: () => ({ state: mockState, actions: mockActions })
}));

import CreateTicketModal from './CreateTicketModal';

describe('CreateTicketModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders nothing when closed', () => {
    const { container } = render(<CreateTicketModal isOpen={false} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders form and shows user info, handles category/subcategory and file', async () => {
    const onClose = jest.fn();
    const { container } = render(<CreateTicketModal isOpen={true} onClose={onClose} />);

    // user info inputs are disabled and show currentUser data
    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();


    // Category select contains expected options — labels are not linked with for/id, so query by name
    const category = container.querySelector('select[name="category"]');
    expect(category).toBeInTheDocument();
    fireEvent.change(category, { target: { name: 'category', value: 'Hardware' } });

    // Subcategory should now populate and not be disabled
    const subcategory = container.querySelector('select[name="subcategory"]');
    expect(subcategory).not.toBeDisabled();
    expect(screen.getByText('Laptop Issues')).toBeInTheDocument();

    // File input: attach a fake file and expect the filename to appear
    const file = new File(['dummy'], 'screenshot.png', { type: 'image/png' });
    const fileInput = container.querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(await screen.findByText(/Selected: screenshot.png/)).toBeInTheDocument();
  });

  test('shows validation errors and submits successfully', async () => {
    const onClose = jest.fn();
    const { container } = render(<CreateTicketModal isOpen={true} onClose={onClose} />);

    // Submit without filling fields -> should show validation errors
    const submit = screen.getByRole('button', { name: /Create Ticket/i });
    fireEvent.click(submit);

    expect(await screen.findByText(/Title is required/)).toBeInTheDocument();
    expect(await screen.findByText(/Category is required/)).toBeInTheDocument();
    expect(await screen.findByText(/Subcategory is required/)).toBeInTheDocument();
    expect(await screen.findByText(/Description is required/)).toBeInTheDocument();

    // Fill required fields and file then submit
    fireEvent.change(screen.getByPlaceholderText(/Enter ticket title/i), { target: { name: 'title', value: 'My Issue' } });
    const category2 = container.querySelector('select[name="category"]');
    const subcategory2 = container.querySelector('select[name="subcategory"]');
    const priority = container.querySelector('select[name="priority"]');
    fireEvent.change(category2, { target: { name: 'category', value: 'Hardware' } });
    fireEvent.change(subcategory2, { target: { name: 'subcategory', value: 'Laptop Issues' } });
    fireEvent.change(priority, { target: { name: 'priority', value: 'high' } });
    fireEvent.change(screen.getByPlaceholderText(/Describe your issue/i), { target: { name: 'description', value: 'It does not boot' } });

    const file = new File(['img'], 'img.png', { type: 'image/png' });
    const fileInput = container.querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(submit);

    await waitFor(() => expect(mockCreateTicket).toHaveBeenCalledTimes(1));

    const passedTicket = mockCreateTicket.mock.calls[0][0];
    expect(passedTicket.title).toBe('My Issue');
    expect(passedTicket.category).toBe('Hardware');
    expect(passedTicket.subcategory).toBe('Laptop Issues');
    expect(passedTicket.description).toBe('It does not boot');
    expect(passedTicket.priority).toBe('high');
    expect(passedTicket.createdBy).toBe('Test User');
    expect(passedTicket.createdByEmail).toBe('test@example.com');
    expect(passedTicket.department).toBe('IT');
    // estimatedHours should be 4 for high priority
    expect(passedTicket.estimatedHours).toBe(4);
    // image should be the File object
    expect(passedTicket.image).toBeInstanceOf(File);

    // onClose should be called after successful submit
    expect(onClose).toHaveBeenCalled();
  });
});
