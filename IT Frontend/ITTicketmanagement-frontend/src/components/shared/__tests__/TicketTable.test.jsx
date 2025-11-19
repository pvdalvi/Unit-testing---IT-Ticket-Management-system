import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TicketTable from '../TicketTable';

describe('TicketTable component', () => {
  const columns = [
    { key: 'id', label: 'Ticket ID', sortable: true },
    { key: 'priority', label: 'Priority', sortable: false },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'dateCreated', label: 'Created', sortable: false }
  ];

  test('renders rows and badges, and supports actions', () => {
    const tickets = [
      { id: '1', priority: 'high', status: 'open', dateCreated: '2025-01-01' }
    ];

    const onFilterChange = jest.fn();
    const onSort = jest.fn();
    const onViewDetails = jest.fn();
    const onApprove = jest.fn();
    const onReject = jest.fn();

    render(
      <TicketTable
        tickets={tickets}
        columns={columns}
        filters={{ category: '', status: '' }}
        onFilterChange={onFilterChange}
        onSort={onSort}
        onViewDetails={onViewDetails}
        onApprove={onApprove}
        onReject={onReject}
        showActions={true}
      />
    );

    expect(screen.getByText('Tickets')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    // Priority badge uppercases the value
    expect(screen.getByText('HIGH')).toBeInTheDocument();

    // Toggle filters panel
    fireEvent.click(screen.getByText('Filters'));
    const categoryInput = screen.getByPlaceholderText('Filter by category');
    fireEvent.change(categoryInput, { target: { value: 'IT' } });
    expect(onFilterChange).toHaveBeenCalledWith('category', 'IT');

    // Reset filters should call onFilterChange for each filter key
    fireEvent.click(screen.getByText('Reset'));
    expect(onFilterChange).toHaveBeenCalledWith('category', '');
    expect(onFilterChange).toHaveBeenCalledWith('status', '');

    // Click sortable header triggers onSort
    fireEvent.click(screen.getByText('Ticket ID'));
    expect(onSort).toHaveBeenCalled();

    // Click action buttons
    fireEvent.click(screen.getByTitle('View Details'));
    expect(onViewDetails).toHaveBeenCalled();

    fireEvent.click(screen.getByTitle('Approve'));
    expect(onApprove).toHaveBeenCalled();

    fireEvent.click(screen.getByTitle('Reject'));
    expect(onReject).toHaveBeenCalled();
  });

  test('shows empty state when no tickets', () => {
    render(
      <TicketTable tickets={[]} columns={columns} filters={{}} onFilterChange={() => {}} onSort={() => {}} />
    );

    expect(screen.getByText('No tickets found')).toBeInTheDocument();
  });
});
