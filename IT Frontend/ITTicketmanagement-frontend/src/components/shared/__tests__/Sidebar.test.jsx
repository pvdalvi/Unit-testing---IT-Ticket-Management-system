import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../../contexts/AppStateContext', () => ({
  useAppState: () => ({ state: { currentUser: { role: 'manager_l1' } } })
}));

import Sidebar from '../Sidebar';

describe('Sidebar', () => {
  test('renders manager L1 items', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Tickets/i)).toBeInTheDocument();
    expect(screen.getByText(/Approvals/i)).toBeInTheDocument();
    expect(screen.getByText(/Reports/i)).toBeInTheDocument();
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
  });
});
