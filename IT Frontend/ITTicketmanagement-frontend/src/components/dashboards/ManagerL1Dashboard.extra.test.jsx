import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ManagerL1Dashboard from './ManagerL1Dashboard';

const mockActions = {};
const mockState = { currentUser: { name: 'Deepak' }, tickets: [], filters: {} };

jest.mock('../../contexts/AppStateContext', () => ({
  useAppState: () => ({ state: mockState, actions: mockActions })
}));

jest.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/manager/dashboard' })
}));

describe('ManagerL1Dashboard (extra)', () => {
  test('renders and exports trigger console logs', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<ManagerL1Dashboard />);
    const headers = screen.getAllByText(/Welcome,?\s*Deepak/i);
    expect(headers.length).toBeGreaterThan(0);
    const csv = screen.getByText(/Export CSV/i);
    const pdf = screen.getByText(/Export PDF/i);
    fireEvent.click(csv);
    fireEvent.click(pdf);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
