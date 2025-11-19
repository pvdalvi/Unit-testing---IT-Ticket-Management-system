import { getStatusColor as getStatusCOO, getPriorityColor as getPriorityCOO } from '../COODashboard';
import { getStatusColor as getStatusIT, getPriorityColor as getPriorityIT } from '../ITPersonDashboard';
import { getStatusColor as getStatusM1, getPriorityColor as getPriorityM1 } from '../ManagerL1Dashboard';
import { getStatusColor as getStatusM2, getPriorityColor as getPriorityM2 } from '../ManagerL2Dashboard';
import { getEmployeeGreeting } from '../EmployeeDashboard';

describe('Dashboard helper functions', () => {
  test('COO getStatusColor covers branches', () => {
    expect(getStatusCOO('open')).toMatch(/status-open|status-pending/);
    expect(getStatusCOO('resolved')).toBe('status-approved');
    expect(getStatusCOO('rejected')).toBe('status-rejected');
    expect(getStatusCOO('closed')).toBe('status-closed');
    expect(getStatusCOO('unknown')).toBe('status-open');
  });

  test('COO getPriorityColor covers branches', () => {
    expect(getPriorityCOO('high')).toBe('text-red-600');
    expect(getPriorityCOO('medium')).toBe('text-yellow-600');
    expect(getPriorityCOO('low')).toBe('text-green-600');
    expect(getPriorityCOO('other')).toBe('text-gray-600');
  });

  test('IT Person helpers', () => {
    expect(getStatusIT('New')).toContain('bg-');
    expect(getStatusIT('Closed')).toContain('bg-');
    expect(getPriorityIT('high')).toBe('text-red-600');
  });

  test('Manager L1 helpers', () => {
    expect(getStatusM1('New')).toContain('bg-');
    expect(getPriorityM1('medium')).toBe('text-yellow-600');
  });

  test('Manager L2 helpers', () => {
    expect(getStatusM2('Solved')).toContain('bg-');
    expect(getPriorityM2('low')).toBe('text-green-600');
  });

  test('Employee greeting helper', () => {
    expect(getEmployeeGreeting('Alice')).toBe('Welcome, Alice');
  });
});
