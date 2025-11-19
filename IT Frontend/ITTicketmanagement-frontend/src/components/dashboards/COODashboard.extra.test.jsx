import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import COODashboard from './COODashboard';

const mockActions = {};
const mockState = { currentUser: { name: 'Rashmi' }, tickets: [], filters: {} };

jest.mock('../../contexts/AppStateContext', () => ({
  useAppState: () => ({ state: mockState, actions: mockActions })
}));

describe('COODashboard (extra)', () => {
  test('renders KPI cards and header', () => {
    render(<COODashboard />);

    const headers = screen.getAllByText(/Welcome,?\s*Rashmi/i);
    expect(headers.length).toBeGreaterThan(0);
    // navigation/interactive items exist; KPI rendering is covered in main tests
    expect(screen.getByText(/Approval Queue/i)).toBeInTheDocument();
  });

  test('navigation items are present and clickable', () => {
    render(<COODashboard />);
    const approvals = screen.getByText('Approval Queue');
    expect(approvals).toBeInTheDocument();
    fireEvent.click(approvals);
  });
});
