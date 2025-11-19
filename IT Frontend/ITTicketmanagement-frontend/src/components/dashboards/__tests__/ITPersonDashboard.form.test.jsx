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

describe('ITPersonDashboard - Create Ticket form', () => {
  beforeEach(() => {
    window.alert = jest.fn();
  });

  test('creates ticket successfully and resets form', () => {
    const ITPersonDashboard = require('../ITPersonDashboard.jsx').default;
    render(<ITPersonDashboard />);

    // Open sidebar 'Create Ticket' button in sidebar area
    const sidebar = document.querySelector('.fixed.left-0.top-16');
    const createNav = Array.from(sidebar.querySelectorAll('button')).find(b => /Create Ticket/i.test(b.textContent));
    fireEvent.click(createNav);

    // Fill form fields using name selectors
    const fullName = document.querySelector('input[name="fullName"]');
    const email = document.querySelector('input[name="email"]');
    const subject = document.querySelector('input[name="subject"]');
    const description = document.querySelector('textarea[name="description"]') || document.querySelector('input[name="description"]');
    const department = document.querySelector('select[name="department"]');
    const category = document.querySelector('select[name="category"]');
    const priority = document.querySelector('select[name="priority"]');

    fireEvent.change(fullName, { target: { value: 'Tester' } });
    fireEvent.change(email, { target: { value: 'tester@example.com' } });
    fireEvent.change(department, { target: { value: 'IT' } });
    fireEvent.change(category, { target: { value: 'Hardware' } });
    fireEvent.change(priority, { target: { value: 'High' } });
    fireEvent.change(subject, { target: { value: 'Keyboard issue' } });
    fireEvent.change(description, { target: { value: 'Keys not working' } });

    const submitBtn = document.querySelector('button[type="submit"]');
    fireEvent.click(submitBtn);

    expect(window.alert).toHaveBeenCalled();
  });

  test('uploads an image for the ticket and shows preview', () => {
    const ITPersonDashboard = require('../ITPersonDashboard.jsx').default;
    const { container } = render(<ITPersonDashboard />);

    // Open Create Ticket nav
    const sidebar = document.querySelector('.fixed.left-0.top-16');
    const createNav = Array.from(sidebar.querySelectorAll('button')).find(b => /Create Ticket/i.test(b.textContent));
    fireEvent.click(createNav);

    // Find hidden file input by id and simulate a file upload
    const fileInput = container.querySelector('#image-upload');
    expect(fileInput).toBeTruthy();

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Preview image is rendered asynchronously after FileReader; wait for it
    return screen.findByAltText('Preview').then((preview) => {
      expect(preview).toBeTruthy();
    });
  });

  test('remove image clears the preview', () => {
    const ITPersonDashboard = require('../ITPersonDashboard.jsx').default;
    const { container } = render(<ITPersonDashboard />);

    // Open Create Ticket nav
    const sidebar = document.querySelector('.fixed.left-0.top-16');
    const createNav = Array.from(sidebar.querySelectorAll('button')).find(b => /Create Ticket/i.test(b.textContent));
    fireEvent.click(createNav);

    const fileInput = container.querySelector('#image-upload');
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    return screen.findByAltText('Preview').then((preview) => {
      expect(preview).toBeTruthy();
      // Click Remove button in preview area
      const removeBtn = screen.getByText(/Remove/i);
      fireEvent.click(removeBtn);
      expect(screen.queryByAltText('Preview')).toBeNull();
    });
  });

  test('change password modal validation shows alert on mismatch', () => {
    const ITPersonDashboard = require('../ITPersonDashboard.jsx').default;
    render(<ITPersonDashboard />);

    // Open Profile view from sidebar
    const sidebar = document.querySelector('.fixed.left-0.top-16');
    const navButtons = Array.from(sidebar.querySelectorAll('button'));
    const profileBtn = navButtons.find(b => /Profile|My Profile/i.test(b.textContent));
    fireEvent.click(profileBtn);

    // Click Change Password button in profile view
    const changeBtn = screen.getByRole('button', { name: /Change Password/i });
    fireEvent.click(changeBtn);

    // Find the modal heading then scope search to modal root
    const heading = screen.getAllByText(/Change Password/i).find(h => h.tagName === 'H3');
    expect(heading).toBeDefined();
    let modalRoot = heading;
    while (modalRoot && !modalRoot.className?.toString().includes('fixed')) modalRoot = modalRoot.parentElement;
    expect(modalRoot).toBeDefined();

    // Password inputs are plain inputs (not associated via label 'for'), select by type
    const pwInputs = modalRoot.querySelectorAll('input[type="password"]');
    expect(pwInputs.length).toBeGreaterThanOrEqual(3);
    // second input is New Password, third is Confirm New Password
    fireEvent.change(pwInputs[1], { target: { value: 'abc123' } });
    fireEvent.change(pwInputs[2], { target: { value: 'xyz789' } });

    // Click modal's Change Password button (scope to modal)
    const modalButtons = Array.from(modalRoot.querySelectorAll('button'));
    const submitBtn = modalButtons.find(b => /Change Password/i.test(b.textContent));
    expect(submitBtn).toBeTruthy();
    fireEvent.click(submitBtn);

    expect(window.alert).toHaveBeenCalledWith('New passwords do not match');
  });

  test('change password success closes modal when passwords match', () => {
    const ITPersonDashboard = require('../ITPersonDashboard.jsx').default;
    render(<ITPersonDashboard />);

    // Open Profile view from sidebar
    const sidebar = document.querySelector('.fixed.left-0.top-16');
    const navButtons = Array.from(sidebar.querySelectorAll('button'));
    const profileBtn = navButtons.find(b => /Profile|My Profile/i.test(b.textContent));
    fireEvent.click(profileBtn);

    // Click Change Password button in profile view
    const changeBtn = screen.getByRole('button', { name: /Change Password/i });
    fireEvent.click(changeBtn);

    // Scope to modal
    const heading = screen.getAllByText(/Change Password/i).find(h => h.tagName === 'H3');
    let modalRoot = heading;
    while (modalRoot && !modalRoot.className?.toString().includes('fixed')) modalRoot = modalRoot.parentElement;
    const pwInputs = modalRoot.querySelectorAll('input[type="password"]');
    fireEvent.change(pwInputs[1], { target: { value: 'samepass' } });
    fireEvent.change(pwInputs[2], { target: { value: 'samepass' } });

    const submitBtn = Array.from(modalRoot.querySelectorAll('button')).find(b => /Change Password/i.test(b.textContent));
    fireEvent.click(submitBtn);

    // Modal should be closed
    const stillOpen = screen.queryAllByText(/Change Password/i).find(h => h.tagName === 'H3');
    expect(stillOpen).toBeUndefined();
  });
});
