import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ManagerL2Dashboard from './ManagerL2Dashboard';

const mockActions = {};
const mockState = { currentUser: { name: 'Kavita' }, tickets: [], filters: {} };

jest.mock('../../contexts/AppStateContext', () => ({
  useAppState: () => ({ state: mockState, actions: mockActions })
}));

jest.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/manager/dashboard' })
}));

describe('ManagerL2Dashboard (extra)', () => {
  test('renders KPIs and export actions log to console', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<ManagerL2Dashboard />);
    const headers = screen.getAllByText(/Welcome,?\s*Kavita/i);
    expect(headers.length).toBeGreaterThan(0);
    const totals = screen.getAllByText(/Total Tickets/i);
    expect(totals.length).toBeGreaterThan(0);
    fireEvent.click(screen.getByText(/Export CSV/i));
    fireEvent.click(screen.getByText(/Export PDF/i));
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
