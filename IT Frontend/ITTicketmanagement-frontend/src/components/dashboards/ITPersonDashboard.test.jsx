import React from "react";
import { render, screen } from "@testing-library/react";
import { useAppState } from "../../contexts/AppStateContext";

jest.mock("../../contexts/AppStateContext");
jest.mock("../shared/Header", () => () => <div>Header Mock</div>);
jest.mock("../shared/Sidebar", () => () => <div>Sidebar Mock</div>);

jest.mock("../shared/TicketTable", () => ({
  __esModule: true,
  default: ({ tickets }) => <div>TicketTable Mock - {tickets ? tickets.length : 0} tickets</div>,
}));

jest.mock("../shared/EnhancedTicketModal", () => ({ isOpen }) =>
  isOpen ? <div>EnhancedTicketModal Open</div> : null
);

jest.mock("../shared/CreateTicketModal", () => ({ isOpen }) =>
  isOpen ? <div>CreateTicketModal Open</div> : null
);

const baseState = {
  currentUser: { email: "it@test.com", name: "IT User" },
  tickets: [],
  filters: {}
};

beforeEach(() => {
  jest.clearAllMocks();
  useAppState.mockReturnValue({ state: baseState, actions: {} });
});

describe("ITPersonDashboard Tests", () => {
  test("renders KPIs and Ticket Management section", () => {
    const ITPersonDashboard = require("./ITPersonDashboard.jsx").default;
    render(<ITPersonDashboard />);

    // Ticket management heading is present
    expect(screen.getByText("Ticket Management")).toBeInTheDocument();

    // KPI: Total tickets value is shown (component uses a hardcoded 320 in demo data)
    expect(screen.queryAllByText("320").length).toBeGreaterThan(0);
  });
});
