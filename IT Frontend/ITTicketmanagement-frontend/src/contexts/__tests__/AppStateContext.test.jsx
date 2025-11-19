import React from 'react';
import { render, waitFor, act } from '@testing-library/react';

import { AppStateProvider, useAppState } from '../AppStateContext';

let appContext = null;

function Capture() {
  const ctx = useAppState();
  React.useEffect(() => {
    appContext = ctx;
  }, [ctx]);
  return null;
}

describe('AppStateContext', () => {
  beforeEach(() => {
    appContext = null;
    localStorage.clear();
  });

  test('useAppState throws when used outside provider', () => {
    // require the hook in a component without provider to assert it throws
    const consoleError = console.error;
    console.error = () => {};
    expect(() => render(<Capture />)).toThrow();
    console.error = consoleError;
  });

  test('login, createTicket, assignTicket and logout flows', async () => {
    render(
      <AppStateProvider>
        <Capture />
      </AppStateProvider>
    );

    // Wait for capture effect to set appContext
    await waitFor(() => {
      if (!appContext) throw new Error('context not set');
    });

    // Invalid login
    let res;
    act(() => {
      res = appContext.actions.login('nope@x.com', 'bad');
    });
    expect(res.success).toBe(false);

    // Valid login (use one of the seeded users)
    act(() => {
      res = appContext.actions.login('tara@abstractgroup.com', '123');
    });

    await waitFor(() => expect(appContext.state.isAuthenticated).toBe(true));
    expect(res.success).toBe(true);
    expect(appContext.state.currentUser).toBeTruthy();
    expect(appContext.state.currentUser.email).toBe('tara@abstractgroup.com');

    // Create a new ticket
    const beforeCount = appContext.state.tickets.length;
    act(() => {
      appContext.actions.createTicket({
        title: 'Test ticket',
        description: 'testing',
        category: 'Hardware',
        subcategory: 'Laptop Issues',
        priority: 'low',
        createdBy: 'Tara',
        createdByEmail: 'tara@abstractgroup.com'
      });
    });

    await waitFor(() => expect(appContext.state.tickets.length).toBeGreaterThan(beforeCount));

    const newTicket = appContext.state.tickets[appContext.state.tickets.length - 1];
    expect(newTicket.title).toBe('Test ticket');
    expect(newTicket.status).toBe('open');

    // Assign the new ticket
    act(() => {
      appContext.actions.assignTicket(newTicket.id, 'Rahul', 'Tara', 'Please take this');
    });

    await waitFor(() => {
      const t = appContext.state.tickets.find(tt => tt.id === newTicket.id);
      if (!t || t.assignedTo !== 'Rahul') throw new Error('not assigned yet');
    });

    const assigned = appContext.state.tickets.find(t => t.id === newTicket.id);
    expect(assigned.assignedTo).toBe('Rahul');
    expect(assigned.status).toBe('assigned');

    // Update filters
    act(() => {
      appContext.actions.updateFilters({ category: 'Hardware' });
    });
    expect(appContext.state.filters.category).toBe('Hardware');

    // Set active tab
    act(() => {
      appContext.actions.setActiveTab('tickets');
    });
    expect(appContext.state.activeTab).toBe('tickets');

    // Toggle modal state
    act(() => {
      appContext.actions.setModalState('showCreateModal', true);
    });
    expect(appContext.state.showCreateModal).toBe(true);

    // Mark notification read
    const firstNotification = appContext.state.notifications[0];
    expect(firstNotification.read).toBe(false);
    act(() => {
      appContext.actions.markNotificationRead(firstNotification.id);
    });
    await waitFor(() => expect(appContext.state.notifications.find(n => n.id === firstNotification.id).read).toBe(true));

    // Logout
    act(() => {
      appContext.actions.logout();
    });
    await waitFor(() => expect(appContext.state.isAuthenticated).toBe(false));
    expect(appContext.state.currentUser).toBeNull();
  });
});
