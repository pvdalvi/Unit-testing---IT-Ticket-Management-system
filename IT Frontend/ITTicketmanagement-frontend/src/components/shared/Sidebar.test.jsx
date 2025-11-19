import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('../../contexts/AppStateContext', () => ({
  useAppState: jest.fn(),
}));

// Mock NavLink from react-router-dom to a simple anchor for testing
jest.mock('react-router-dom', () => ({
  NavLink: ({ to, children }) => <a href={to}>{children}</a>
}));

import { useAppState } from '../../contexts/AppStateContext';
import Sidebar from './Sidebar';

describe('Sidebar', () => {
  beforeEach(() => jest.clearAllMocks());

  test('renders no items for unknown role', () => {
    useAppState.mockReturnValue({ state: { currentUser: { role: 'unknown' } } });
    const { container } = render(<Sidebar />);

    // Aside should render but no list items
    expect(container.querySelectorAll('li').length).toBe(0);
  });

  test('renders employee sidebar items and has employee color', () => {
    useAppState.mockReturnValue({ state: { currentUser: { role: 'employee' } } });
    const { container } = render(<Sidebar />);

    const aside = container.querySelector('aside');
    expect(aside.className).toContain('bg-employee-primary');

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('My Tickets')).toBeInTheDocument();
    expect(screen.getByText('Create Ticket')).toBeInTheDocument();
  });

  test('renders it_person sidebar items and manager color', () => {
    useAppState.mockReturnValue({ state: { currentUser: { role: 'it_person' } } });
    const { container } = render(<Sidebar />);

    const aside = container.querySelector('aside');
    expect(aside.className).toContain('bg-manager-primary');

    expect(screen.getByText('Agents')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('My Profile')).toBeInTheDocument();
  });

  test('renders ceo as coo items and coo color', () => {
    useAppState.mockReturnValue({ state: { currentUser: { role: 'ceo' } } });
    const { container } = render(<Sidebar />);

    const aside = container.querySelector('aside');
    expect(aside.className).toContain('bg-coo-primary');

    expect(screen.getByText('Reports & Metrics')).toBeInTheDocument();
    expect(screen.getByText('Export Data')).toBeInTheDocument();
  });

  test('renders manager_l1 sidebar items and blue color', () => {
    useAppState.mockReturnValue({ state: { currentUser: { role: 'manager_l1' } } });
    const { container } = render(<Sidebar />);

    const aside = container.querySelector('aside');
    expect(aside.className).toContain('bg-blue-primary');

    expect(screen.getByText('Approvals')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
  });

  test('renders manager_l2 sidebar items and blue color', () => {
    useAppState.mockReturnValue({ state: { currentUser: { role: 'manager_l2' } } });
    const { container } = render(<Sidebar />);

    const aside = container.querySelector('aside');
    expect(aside.className).toContain('bg-blue-primary');

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });
});
