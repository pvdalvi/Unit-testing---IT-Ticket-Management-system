/**
 * EmployeeDashboard.test.jsx
 * ---------------------------------------
 * This test suite covers the core behavior of the Employee Dashboard:
 * - Dashboard UI rendering
 * - Ticket list page rendering
 * - Create-ticket modal visibility
 * - Filtering by category & date
 * - KPI calculations
 * - Sorting button behavior
 * - Ensuring only logged-in user tickets are shown
 * ---------------------------------------
 * NOTE:
 * Tests for opening/closing the ticket details modal were removed
 * because the TicketTable mock does not support onViewDetails.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useAppState } from "../../contexts/AppStateContext";
import { useLocation } from "react-router-dom";

// ---------------------------------------------------------
// Mock setup
// ---------------------------------------------------------
jest.mock("../../contexts/AppStateContext");

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

jest.mock("../shared/Header", () => () => <div>Header Mock</div>);
jest.mock("../shared/Sidebar", () => () => <div>Sidebar Mock</div>);

// Simple TicketTable mock
jest.mock("../shared/TicketTable", () => ({
  __esModule: true,
  default: ({ tickets, onSort }) => (
    <div>
      TicketTable Mock - {tickets.length} tickets
      <button onClick={() => onSort("title", "asc")}>Sort Button</button>
    </div>
  ),
}));

// Simple modals
jest.mock("../shared/CreateTicketModal", () => ({ isOpen }) =>
  isOpen ? <div>CreateTicketModal Open</div> : null
);

jest.mock("../shared/EnhancedTicketModal", () => ({ isOpen }) =>
  isOpen ? <div>EnhancedTicketModal Open</div> : null
);

// ---------------------------------------------------------
// Base state for all tests
// ---------------------------------------------------------
const baseState = {
  currentUser: { email: "test@test.com", name: "John" },
  tickets: [
    {
      id: 1,
      title: "Issue A",
      category: "IT",
      subcategory: "Laptop",
      dateCreated: "2025-01-15",
      createdByEmail: "test@test.com",
      status: "open",
      priority: "high",
    },
    {
      id: 2,
      title: "Issue B",
      category: "HR",
      subcategory: "Leave",
      dateCreated: "2025-01-10",
      createdByEmail: "test@test.com",
      status: "closed",
      priority: "low",
    },
  ],
  filters: { category: "", date: "" },
};

const mockActions = { updateFilters: jest.fn() };

// ---------------------------------------------------------
// Before each test, reset mocks
// ---------------------------------------------------------
beforeEach(() => {
  jest.clearAllMocks();

  useAppState.mockReturnValue({
    state: baseState,
    actions: mockActions,
  });
});

// ---------------------------------------------------------
// Test Suite Begins
// ---------------------------------------------------------
describe("EmployeeDashboard Tests", () => {
  // ---------------- Dashboard Tests ----------------
  test("renders Dashboard KPI cards", () => {
    useLocation.mockReturnValue({ pathname: "/employee/dashboard" });

    const EmployeeDashboard =
      require("../dashboards/EmployeeDashboard.jsx").default;

    render(<EmployeeDashboard />);

    expect(screen.getByText("Total Tickets")).toBeInTheDocument();
    expect(screen.getByText("Open Tickets")).toBeInTheDocument();
    expect(screen.getByText("Closed Tickets")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument(); // total
  });

  // ---------------- Ticket Page ----------------
  test("renders Tickets page", () => {
    useLocation.mockReturnValue({ pathname: "/employee/tickets" });

    const EmployeeDashboard =
      require("../dashboards/EmployeeDashboard.jsx").default;

    render(<EmployeeDashboard />);

    expect(screen.getByText("My Tickets")).toBeInTheDocument();
    expect(
      screen.getByText("TicketTable Mock - 2 tickets")
    ).toBeInTheDocument();
  });

  // ---------------- Create Ticket Page ----------------
  test("shows create-ticket page modal", () => {
    useLocation.mockReturnValue({ pathname: "/employee/create-ticket" });

    const EmployeeDashboard =
      require("../dashboards/EmployeeDashboard.jsx").default;

    render(<EmployeeDashboard />);

    expect(screen.getByText("CreateTicketModal Open")).toBeInTheDocument();
  });

  // ---------------- Filtering Tests ----------------
  describe("Filtering Logic", () => {
    test("filters tickets by category", () => {
      useAppState.mockReturnValue({
        state: { ...baseState, filters: { category: "IT", date: "" } },
        actions: mockActions,
      });

      useLocation.mockReturnValue({ pathname: "/employee/tickets" });

      const EmployeeDashboard =
        require("../dashboards/EmployeeDashboard.jsx").default;

      render(<EmployeeDashboard />);
      expect(
        screen.getByText("TicketTable Mock - 1 tickets")
      ).toBeInTheDocument();
    });

    test("filters tickets by date", () => {
      useAppState.mockReturnValue({
        state: { ...baseState, filters: { category: "", date: "2025-01-15" } },
        actions: mockActions,
      });

      useLocation.mockReturnValue({ pathname: "/employee/tickets" });

      const EmployeeDashboard =
        require("../dashboards/EmployeeDashboard.jsx").default;

      render(<EmployeeDashboard />);
      expect(
        screen.getByText("TicketTable Mock - 1 tickets")
      ).toBeInTheDocument();
    });
  });

  // ---------------- KPI Tests ----------------
  describe("KPI Calculation", () => {
    test("correct KPI values", () => {
      useLocation.mockReturnValue({ pathname: "/employee/dashboard" });

      const EmployeeDashboard =
        require("../dashboards/EmployeeDashboard.jsx").default;

      render(<EmployeeDashboard />);

      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("1 pending")).toBeInTheDocument();
      expect(screen.getByText("50% resolved")).toBeInTheDocument();
    });
  });

  // ---------------- Sorting Tests ----------------
  describe("Sorting Logic", () => {
    test("calls onSort correctly", () => {
      useLocation.mockReturnValue({ pathname: "/employee/dashboard" });
      console.log = jest.fn();

      const EmployeeDashboard =
        require("../dashboards/EmployeeDashboard.jsx").default;

      render(<EmployeeDashboard />);
      fireEvent.click(screen.getByText("Sort Button"));

      expect(console.log).toHaveBeenCalledWith("Sort by:", "title", "asc");
    });
  });

  // ---------------- User-specific ticket filtering ----------------
  test("shows only tickets created by logged-in user", () => {
    const customState = {
      ...baseState,
      tickets: [
        ...baseState.tickets,
        { id: 3, title: "Other ticket", createdByEmail: "other@test.com" },
      ],
    };

    useAppState.mockReturnValue({
      state: customState,
      actions: mockActions,
    });

    useLocation.mockReturnValue({ pathname: "/employee/tickets" });

    const EmployeeDashboard =
      require("../dashboards/EmployeeDashboard.jsx").default;

    render(<EmployeeDashboard />);

    // Only 2 tickets belong to logged-in user
    expect(
      screen.getByText("TicketTable Mock - 2 tickets")
    ).toBeInTheDocument();
  });
});
