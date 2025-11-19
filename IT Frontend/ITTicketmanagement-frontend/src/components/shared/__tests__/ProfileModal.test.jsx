import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileModal from '../ProfileModal';

describe('ProfileModal', () => {
  const user = { name: 'Amit Patel', email: 'amit@ex.com', role: 'manager_l1' };

  test('renders nothing when closed or no user', () => {
    const { container } = render(<ProfileModal user={null} isOpen={true} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();

    const { container: c2 } = render(<ProfileModal user={user} isOpen={false} onClose={() => {}} />);
    expect(c2.firstChild).toBeNull();
  });

  test('renders profile details and calls onClose', () => {
    const onClose = jest.fn();
    render(<ProfileModal user={user} isOpen={true} onClose={onClose} />);

    expect(screen.getByText('Profile Details')).toBeInTheDocument();
    expect(screen.getByText(user.name)).toBeInTheDocument();
    // Role badge and department text should appear
    expect(screen.getByText(/Manager L1/i)).toBeInTheDocument();

    // Close button should call onClose (first button in header)
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(onClose).toHaveBeenCalled();
  });
});
