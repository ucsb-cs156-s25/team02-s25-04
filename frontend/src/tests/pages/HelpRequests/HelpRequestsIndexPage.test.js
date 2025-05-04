import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import HelpRequestsIndexPage from "main/pages/HelpRequests/HelpRequestsIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

import { helpRequestFixtures } from "fixtures/helpRequestFixtures";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

describe("HelpRequestsIndexPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const testId = "HelpRequestTable";

  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const setupAdminUser = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const queryClient = new QueryClient();

  test("Renders with Create Button for admin user", async () => {
    setupAdminUser();
    axiosMock.onGet("/api/HelpRequest/all").reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Create Help Request/)).toBeInTheDocument();
    });
    const button = screen.getByText(/Create Help Request/);
    expect(button).toHaveAttribute("href", "/HelpRequest/create");
    expect(button).toHaveAttribute("style", "float: right;");
  });

  test("renders three help requests correctly for regular user", async () => {
    setupUserOnly();
    axiosMock
      .onGet("/api/HelpRequest/all")
      .reply(200, helpRequestFixtures.threeHelpRequests);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-id`),
      ).toHaveTextContent("1");
    });
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "3",
    );
    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent(
      "4",
    );

    const createHelpRequestButton = screen.queryByText("Create Help Request");
    expect(createHelpRequestButton).not.toBeInTheDocument();

    const requesterEmails = screen.getAllByText("fahimzaman@ucsb.edu");
    expect(requesterEmails.length).toBe(3);
    requesterEmails.forEach((email) => {
      expect(email).toBeInTheDocument();
    });

    const teamIds = screen.getAllByText("s25-6pm-4");
    expect(teamIds.length).toBe(3);
    teamIds.forEach((teamId) => {
      expect(teamId).toBeInTheDocument();
    });

    const tableOrBreakoutRoom = screen.getAllByText("4");
    expect(tableOrBreakoutRoom.length).toBe(4);
    tableOrBreakoutRoom.forEach((room) => {
      expect(room).toBeInTheDocument();
    });

    const requestTimes = screen.getAllByText("2025-04-29T23:26:00");
    expect(requestTimes.length).toBe(2);
    requestTimes.forEach((time) => {
      expect(time).toBeInTheDocument();
    });
    const explanations = screen.getAllByText(
      "I had issues setting up controller to Post a HelpRequest",
    );
    expect(explanations.length).toBe(1);
    explanations.forEach((explanation) => {
      expect(explanation).toBeInTheDocument();
    });
    const solvedCells = screen.getAllByTestId(
      /HelpRequestTable-cell-row-\d+-col-solved/,
    );
    expect(solvedCells.length).toBe(3);
    expect(solvedCells[0]).toHaveTextContent("No");
    expect(solvedCells[1]).toHaveTextContent("Yes");
    expect(solvedCells[2]).toHaveTextContent("Yes");

    // for non-admin users, details button is visible, but the edit and delete buttons should not be visible
    expect(
      screen.queryByTestId("HelpRequestTable-cell-row-0-col-Delete-button"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("HelpRequestTable-cell-row-0-col-Edit-button"),
    ).not.toBeInTheDocument();
  });

  test("renders empty table when backend unavailable, user only", async () => {
    setupUserOnly();

    axiosMock.onGet("/api/HelpRequest/all").timeout();

    const restoreConsole = mockConsole();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });

    const errorMessage = console.error.mock.calls[0][0];
    expect(errorMessage).toMatch(
      "Error communicating with backend via GET on /api/HelpRequest/all",
    );
    restoreConsole();
  });

  test("what happens when you click delete, admin", async () => {
    setupAdminUser();

    axiosMock
      .onGet("/api/HelpRequest/all")
      .reply(200, helpRequestFixtures.threeHelpRequests);
    axiosMock
      .onDelete("/api/HelpRequest")
      .reply(200, "Help Request with id 1 was deleted");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-id`),
      ).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "1",
    );

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(axiosMock.history.delete.length).toBe(1);
    });
    expect(axiosMock.history.delete[0].url).toBe("/api/HelpRequest");
    expect(screen.getAllByTestId(`${testId}-cell-row-0-col-id`).length).toBe(1);
    expect(axiosMock.history.delete[0].url).toBe("/api/HelpRequest");
    expect(axiosMock.history.delete[0].params).toEqual({ id: 1 });
  });
});
