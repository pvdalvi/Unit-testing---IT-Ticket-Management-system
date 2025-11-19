import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

const mockActions = { logout: jest.fn() };

jest.mock('../../../contexts/AppStateContext', () => ({
  useAppState: () => ({ state: { currentUser: { name: 'Rahul', email: 'rahul@abstract.com' }, tickets: [], filters: {} }, actions: mockActions })
}));

jest.mock('../../shared/Header', () => () => <div>Header Mock</div>);
jest.mock('../../shared/Sidebar', () => () => <div>Sidebar Mock</div>);
jest.mock('../../shared/CreateTicketModal', () => ({ isOpen }) => isOpen ? <div>CreateTicketModal Mock</div> : null);
jest.mock('../../shared/EnhancedTicketModal', () => ({ isOpen }) => isOpen ? <div>EnhancedTicketModal Mock</div> : null);

describe('ITPersonDashboard - Views', () => {
  test('renders dashboard and navigates to tickets, agents, settings, profile', () => {
    const ITPersonDashboard = require('../ITPersonDashboard.jsx').default;
    render(<ITPersonDashboard />);

    // Dashboard content
    expect(screen.getAllByText(/Ticket Management/i).length).toBeGreaterThan(0);

    // Find sidebar container and click nav items inside it
    const sidebar = document.querySelector('.fixed.left-0.top-16');
    expect(sidebar).toBeTruthy();

    const navButtons = Array.from(sidebar.querySelectorAll('button'));
    const findAndClick = (regex) => {
      const btn = navButtons.find(b => regex.test(b.textContent));
      expect(btn).toBeDefined();
      fireEvent.click(btn);
    };

    // Tickets
    findAndClick(/Tickets|All Tickets/i);
    expect(screen.getByText(/All Tickets/i)).toBeInTheDocument();

    // Agents
    findAndClick(/Agents/i);
    expect(screen.getByText(/Agent Management/i)).toBeInTheDocument();

    // Settings
    findAndClick(/Settings|System Settings/i);
    expect(screen.getByText(/System Settings/i)).toBeInTheDocument();

    // Profile via user dropdown: click the top user button
    const userBtn = screen.getAllByText(/Rahul/)[0];
    fireEvent.click(userBtn);
    const viewProfileBtn = screen.getByRole('button', { name: /View full profile/i });
    fireEvent.click(viewProfileBtn);
    // Profile view shows greeting
    expect(screen.getByText(/Hello, Rahul/i)).toBeInTheDocument();
  });
});
