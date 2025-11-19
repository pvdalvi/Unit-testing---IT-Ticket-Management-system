import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import ProfileModal from './ProfileModal';

describe('ProfileModal', () => {
  const baseUser = {
    name: 'Alice Smith',
    role: 'employee',
    email: 'alice@example.com',
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders nothing when closed or no user', () => {
    const { container: c1 } = render(<ProfileModal user={baseUser} isOpen={false} onClose={() => {}} />);
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(<ProfileModal user={null} isOpen={true} onClose={() => {}} />);
    expect(c2.firstChild).toBeNull();
  });

  test('displays profile details for employee role and shows skills & responsibilities', () => {
    // Freeze time so experience calculation is deterministic
    jest.spyOn(Date, 'now').mockReturnValue(new Date('2025-03-16').getTime());

    render(<ProfileModal user={baseUser} isOpen={true} onClose={() => {}} />);

    expect(screen.getByText('Profile Details')).toBeInTheDocument();
    expect(screen.getByText(baseUser.name)).toBeInTheDocument();
    expect(screen.getAllByText('Employee')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Operations')[0]).toBeInTheDocument();
    expect(screen.getAllByText(baseUser.email)[0]).toBeInTheDocument();

    // Skills rendered
    expect(screen.getByText('Customer Service')).toBeInTheDocument();

    // Experience calculation: join date for employee is 2022-03-15 -> ~3 years on 2025-03-16
    expect(screen.getByText(/years/)).toHaveTextContent('3 years');
  });

  test('formatRole and badge colors render for manager roles', () => {
    const mgr = { ...baseUser, role: 'manager_l1', name: 'Manager One', email: 'm1@example.com' };
    render(<ProfileModal user={mgr} isOpen={true} onClose={() => {}} />);

    // Badge should show formatted role text
    expect(screen.getByText(/Manager L1|Manager L1/i)).toBeInTheDocument();
    // Skills specific to manager_l1
    expect(screen.getByText('Team Leadership')).toBeInTheDocument();
  });

  test('renders role-specific fields for it_person and ceo', () => {
    const itUser = { ...baseUser, role: 'it_person', name: 'It Person', email: 'it@example.com' };
    render(<ProfileModal user={itUser} isOpen={true} onClose={() => {}} />);

    // Department for it_person
    expect(screen.getAllByText('Information Technology')[0]).toBeInTheDocument();
    // Skills specific to it_person
    expect(screen.getByText('System Administration')).toBeInTheDocument();

    // Now test CEO role
    const ceoUser = { ...baseUser, role: 'ceo', name: 'Big Boss', email: 'ceo@example.com' };
    render(<ProfileModal user={ceoUser} isOpen={true} onClose={() => {}} />);

    expect(screen.getAllByText('Executive')[0]).toBeInTheDocument();
    expect(screen.getByText('Strategic Leadership')).toBeInTheDocument();
  });

  test('renders manager_l2 and unknown role default branches', () => {
    const mgr2 = { ...baseUser, role: 'manager_l2', name: 'Manager Two', email: 'm2@example.com' };
    render(<ProfileModal user={mgr2} isOpen={true} onClose={() => {}} />);

    // manager_l2 shares badge/skills with manager_l1
    expect(screen.getByText('Team Management')).toBeInTheDocument();

    // Unknown/default role should fallback to general values
    const unknown = { ...baseUser, role: 'arbitrary_role', name: 'Arb', email: 'arb@example.com' };
    render(<ProfileModal user={unknown} isOpen={true} onClose={() => {}} />);

    // Department fallback and default skills
    expect(screen.getAllByText('General')[0]).toBeInTheDocument();
    expect(screen.getByText('General Skills')).toBeInTheDocument();
  });

  test('close button calls onClose', () => {
    const onClose = jest.fn();
    const { container } = render(<ProfileModal user={baseUser} isOpen={true} onClose={onClose} />);

    const closeButton = container.querySelector('button');
    expect(closeButton).toBeTruthy();
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });
});
