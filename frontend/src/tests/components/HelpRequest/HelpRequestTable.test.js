import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import HelpRequestTable from "main/components/HelpRequests/HelpRequestTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("HelpRequestTable tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "id",
    "Email",
    "Team ID",
    "Table/Breakout Room #",
    "Request Time (in UTC)",
    "Explanation",
    "Has it been solved?",
  ];
  const expectedFields = [
    "id",
    "requesterEmail",
    "teamId",
    "tableOrBreakoutRoom",
    "requestTime",
    "explanation",
    "solved",
  ];
  const testId = "HelpRequestTable";

  test("renders empty table correctly", () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestTable helpRequests={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const fieldElement = screen.queryByTestId(
        `${testId}-cell-row-0-col-${field}`
      );
      expect(fieldElement).not.toBeInTheDocument();
    });
  });

    test("Has the expected column headers, content and buttons for admin user", () => {
      // arrange
      const currentUser = currentUserFixtures.adminUser;

      // act
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestTable
              helpRequests={helpRequestFixtures.threeHelpRequests}
              currentUser={currentUser}
            />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      // assert
      expectedHeaders.forEach((headerText) => {
        const header = screen.getByText(headerText);
        expect(header).toBeInTheDocument();
      });

      expectedFields.forEach((field) => {
        const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
        expect(header).toBeInTheDocument();
      });

      expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
        "1",
      );
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-requesterEmail`),
      ).toHaveTextContent("fahimzaman@ucsb.edu");

      expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
        "3",
      );
      expect(
        screen.getByTestId(`${testId}-cell-row-1-col-teamId`),
      ).toHaveTextContent("s25-6pm-4");

      const editButton = screen.getByTestId(
        `${testId}-cell-row-0-col-Edit-button`,
      );
      expect(editButton).toBeInTheDocument();
      expect(editButton).toHaveClass("btn-primary");

      const deleteButton = screen.getByTestId(
        `${testId}-cell-row-0-col-Delete-button`,
      );
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toHaveClass("btn-danger");
    });

    test("Has the expected column headers, content for ordinary user", () => {
      // arrange
      const currentUser = currentUserFixtures.userOnly;

      // act
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestTable
              helpRequests={helpRequestFixtures.threeHelpRequests}
              currentUser={currentUser}
            />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      // assert
      expectedHeaders.forEach((headerText) => {
        const header = screen.getByText(headerText);
        expect(header).toBeInTheDocument();
      });

      expectedFields.forEach((field) => {
        const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
        expect(header).toBeInTheDocument();
      });

      expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
        "1",
      );
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-requesterEmail`),
      ).toHaveTextContent("fahimzaman@ucsb.edu");

      expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
        "3",
      );
      expect(
        screen.getByTestId(`${testId}-cell-row-1-col-teamId`),
      ).toHaveTextContent("s25-6pm-4");

      expect(screen.queryByText("Delete")).not.toBeInTheDocument();
      expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    });

    test("Edit button navigates to the edit page", async () => {
      // arrange
      const currentUser = currentUserFixtures.adminUser;

      // act - render the component
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestTable
              helpRequests={helpRequestFixtures.threeHelpRequests}
              currentUser={currentUser}
            />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      // assert - check that the expected content is rendered
      expect(
        await screen.findByTestId(`${testId}-cell-row-0-col-id`),
      ).toHaveTextContent("1");

      const editButton = screen.getByTestId(
        `${testId}-cell-row-0-col-Edit-button`,
      );
      expect(editButton).toBeInTheDocument();

      // act - click the edit button
      fireEvent.click(editButton);

      // assert - check that the navigate function was called with the expected path
      await waitFor(() =>
        expect(mockedNavigate).toHaveBeenCalledWith("/helpRequests/edit/1"),
      );
    });

    test("Delete button calls delete callback", async () => {
      // arrange
      const currentUser = currentUserFixtures.adminUser;

      const axiosMock = new AxiosMockAdapter(axios);
      axiosMock
        .onDelete("/api/helpRequests")
        .reply(200, { message: "Help Request deleted" });

      // act - render the component
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestTable
              helpRequests={helpRequestFixtures.threeHelpRequests}
              currentUser={currentUser}
            />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      // assert - check that the expected content is rendered
      expect(
        await screen.findByTestId(`${testId}-cell-row-0-col-id`),
      ).toHaveTextContent("1");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-requesterEmail`),
      ).toHaveTextContent("fahimzaman@ucsb.edu");

      const deleteButton = screen.getByTestId(
        `${testId}-cell-row-0-col-Delete-button`,
      );
      expect(deleteButton).toBeInTheDocument();

      // act - click the delete button
      fireEvent.click(deleteButton);

      // assert - check that the delete endpoint was called

      await waitFor(() => expect(axiosMock.history.delete.length).toBe(1));
      expect(axiosMock.history.delete[0].params).toEqual({ id: 1 });
    });

    test("Solved Boolean is displayed correctly", () => {
        // arrange
        const currentUser = currentUserFixtures.adminUser;
    
        // act
        render(
            <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <HelpRequestTable
                helpRequests={helpRequestFixtures.threeHelpRequests}
                currentUser={currentUser}
                />
            </MemoryRouter>
            </QueryClientProvider>,
        );
    
        // assert
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-solved`),
        ).toHaveTextContent("No");
        expect(
            screen.getByTestId(`${testId}-cell-row-1-col-solved`),
        ).toHaveTextContent("Yes");
    });

    test("Request Time is displayed correctly", () => {
        // arrange
        const currentUser = currentUserFixtures.adminUser;
    
        // act
        render(
            <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <HelpRequestTable
                helpRequests={helpRequestFixtures.threeHelpRequests}
                currentUser={currentUser}
                />
            </MemoryRouter>
            </QueryClientProvider>,
        );
    
        // assert
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-requestTime`),
        ).toHaveTextContent("2025-04-30T06:26:00Z");
        expect(
            screen.getByTestId(`${testId}-cell-row-1-col-requestTime`),
        ).toHaveTextContent("2025-04-30T06:26:00Z");
    });
});
