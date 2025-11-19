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
  currentUser: { email: "mgr2@test.com", name: "Manager2", department: 'IT', phone: '+91 88888' },
  tickets: [
    { id: 'TCK-2025-0401', department: 'IT', status: 'Open', category: 'Hardware', employee: 'Deepak', employeeEmail: 'deepak@ex.com', subject: 'Printers', assigned: 'Kavita', dateCreated: '2025-09-01' },
    { id: 'TCK-2025-0402', department: 'HR', status: 'Closed', category: 'Policy', employee: 'Neha', employeeEmail: 'neha@ex.com', subject: 'Policy question', assigned: 'Simran', dateCreated: '2025-09-02' }
  ],
  filters: {}
};

beforeEach(() => {
  jest.clearAllMocks();
  useAppState.mockReturnValue({ state: baseState, actions: {} });
});

describe("ManagerL2Dashboard Tests", () => {
  test("renders dashboard KPIs when route is dashboard", () => {
    useLocation.mockReturnValue({ pathname: "/manager-l2/dashboard" });
    const ManagerL2Dashboard = require("./ManagerL2Dashboard.jsx").default;
    render(<ManagerL2Dashboard />);

    expect(screen.queryAllByText(/Total Tickets/i).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/Team Members/i).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/Avg Resolution/i).length).toBeGreaterThan(0);
  });

  test("tickets page filtering and view opens modal", async () => {
    useLocation.mockReturnValue({ pathname: "/manager-l2/tickets" });
    const ManagerL2Dashboard = require("./ManagerL2Dashboard.jsx").default;
    render(<ManagerL2Dashboard />);

    expect(screen.getByText('TCK-2025-0401')).toBeInTheDocument();
    expect(screen.getByText('TCK-2025-0402')).toBeInTheDocument();

    const search = screen.getByPlaceholderText(/Search by ID, name, or subject/i);
    fireEvent.change(search, { target: { value: '0402' } });
    await waitFor(() => expect(screen.queryByText('TCK-2025-0401')).not.toBeInTheDocument());

    fireEvent.click(screen.getByText(/View/i));
    expect(screen.getByTestId('enhanced-modal')).toHaveTextContent('Modal: TCK-2025-0402');
  });

  test("settings and profile routes render sections and export buttons call handlers", () => {
    useLocation.mockReturnValue({ pathname: "/manager-l2/settings" });
    const ManagerL2DashboardModule = require("./ManagerL2Dashboard.jsx");
    const comp = ManagerL2DashboardModule.default;
    const { getStatusColor, getPriorityColor } = ManagerL2DashboardModule;

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const { rerender } = render(React.createElement(comp));

    // generate settings view (may appear in multiple places)
    expect(screen.queryAllByText(/Departments/i).length).toBeGreaterThan(0);

    // export buttons (on dashboard route)
    useLocation.mockReturnValue({ pathname: "/manager-l2/dashboard" });
    rerender(React.createElement(comp));
    fireEvent.click(screen.getByText(/Export CSV/i));
    fireEvent.click(screen.getByText(/Export PDF/i));
    expect(logSpy).toHaveBeenCalled();

    // helpers
    expect(getStatusColor('Solved')).toMatch(/text-/);
    expect(getPriorityColor('low')).toMatch(/text-/);
    logSpy.mockRestore();
  });
});
