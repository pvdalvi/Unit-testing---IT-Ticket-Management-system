import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useAppState } from "../../contexts/AppStateContext";

jest.mock("../../contexts/AppStateContext");

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

jest.mock("../shared/Header", () => () => <div>Header Mock</div>);
jest.mock("../shared/Sidebar", () => () => <div>Sidebar Mock</div>);
jest.mock("../shared/EnhancedTicketModal", () => ({ ticket, isOpen }) => (
  <div data-testid="enhanced-modal">{isOpen ? `Modal: ${ticket?.id || 'none'}` : 'Closed'}</div>
));

const { useLocation } = require("react-router-dom");

const baseState = {
  currentUser: { email: "mgr1@test.com", name: "Manager1", department: 'IT', phone: '+91 99999' },
  tickets: [
    { id: 'TCK-2025-0301', category: 'Hardware', status: 'Open', priority: 'high', employee: 'Alice', employeeEmail: 'alice@ex.com', subject: 'Issue', department: 'IT', assigned: 'Unassigned', dateCreated: '2025-10-01' },
    { id: 'TCK-2025-0302', category: 'Software', status: 'Closed', priority: 'low', employee: 'Bob', employeeEmail: 'bob@ex.com', subject: 'Issue2', department: 'HR', assigned: 'Alex', dateCreated: '2025-10-02' }
  ],
  filters: {}
};

beforeEach(() => {
  jest.clearAllMocks();
  useAppState.mockReturnValue({ state: baseState, actions: {} });
});

describe("ManagerL1Dashboard Tests", () => {
  test("renders dashboard KPIs when route is dashboard", () => {
    useLocation.mockReturnValue({ pathname: "/manager-l1/dashboard" });
    const ManagerL1Dashboard = require("./ManagerL1Dashboard.jsx").default;
    render(<ManagerL1Dashboard />);

    expect(screen.queryAllByText(/Total Tickets/i).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/Open Tickets/i).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/Avg Resolution/i).length).toBeGreaterThan(0);
  });

  test("tickets page shows table and respects search and view action", async () => {
    useLocation.mockReturnValue({ pathname: "/manager-l1/tickets" });
    const ManagerL1Dashboard = require("./ManagerL1Dashboard.jsx").default;
    render(<ManagerL1Dashboard />);

    // Both tickets present initially
    expect(screen.getByText('TCK-2025-0301')).toBeInTheDocument();
    expect(screen.getByText('TCK-2025-0302')).toBeInTheDocument();

    // Search for one ticket id
    const search = screen.getByPlaceholderText(/Search by ID, name, or subject/i);
    fireEvent.change(search, { target: { value: '0301' } });
    await waitFor(() => expect(screen.queryByText('TCK-2025-0302')).not.toBeInTheDocument());

    // Click view to open modal
    const viewButton = screen.getByText(/View/i);
    fireEvent.click(viewButton);
    expect(screen.getByTestId('enhanced-modal')).toHaveTextContent('Modal: TCK-2025-0301');
  });

  test("approvals, reports and profile routes render expected headings", () => {
    useLocation.mockReturnValue({ pathname: "/manager-l1/approvals" });
    let ManagerL1Dashboard = require("./ManagerL1Dashboard.jsx").default;
    const { rerender } = render(<ManagerL1Dashboard />);
    expect(screen.getByText(/No pending approvals/i)).toBeInTheDocument();

    useLocation.mockReturnValue({ pathname: "/manager-l1/reports" });
    rerender(<ManagerL1Dashboard />);
    expect(screen.getByText(/Performance Report/i)).toBeInTheDocument();

    useLocation.mockReturnValue({ pathname: "/manager-l1/profile" });
    rerender(<ManagerL1Dashboard />);
    expect(screen.getByText(/Profile Information/i)).toBeInTheDocument();
  });

  test("export buttons call handlers (console.log) and helpers return colors", () => {
    useLocation.mockReturnValue({ pathname: "/manager-l1/dashboard" });
    const ManagerL1Dashboard = require("./ManagerL1Dashboard.jsx");
    const comp = ManagerL1Dashboard.default;
    const { getStatusColor, getPriorityColor } = ManagerL1Dashboard;

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(React.createElement(comp));

    const csv = screen.getByText(/Export CSV/i);
    fireEvent.click(csv);
    expect(logSpy).toHaveBeenCalled();

    const pdf = screen.getByText(/Export PDF/i);
    fireEvent.click(pdf);
    expect(logSpy).toHaveBeenCalled();

    // helpers
    expect(getStatusColor('Open')).toMatch(/text-/);
    expect(getPriorityColor('HIGH')).toMatch(/text-/);
    logSpy.mockRestore();
  });
});
