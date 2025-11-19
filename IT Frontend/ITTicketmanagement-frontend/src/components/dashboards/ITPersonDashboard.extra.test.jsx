import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ITPersonDashboard from './ITPersonDashboard';

const mockActions = {};
const mockState = { currentUser: { name: 'Rahul' }, tickets: [], filters: {} };

jest.mock('../../contexts/AppStateContext', () => ({
  useAppState: () => ({ state: mockState, actions: mockActions })
}));

describe('ITPersonDashboard (extra)', () => {
  test('renders KPIs and Create Ticket nav', () => {
    render(<ITPersonDashboard />);
    const headers = screen.getAllByText(/Rahul/i);
    expect(headers.length).toBeGreaterThan(0);
    const totals = screen.getAllByText(/Total/i);
    expect(totals.length).toBeGreaterThan(0);
    // Ensure Create Ticket nav exists
    expect(screen.getByText(/Create Ticket/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Create Ticket/i));
  });
});
