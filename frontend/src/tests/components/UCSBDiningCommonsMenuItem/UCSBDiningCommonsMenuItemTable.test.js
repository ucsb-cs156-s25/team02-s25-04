import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";
import UCSBDiningCommonsMenuItemTable from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { toast } from "react-toastify";

jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UCSBDiningCommonsMenuItemTable tests", () => {
  const queryClient = new QueryClient();

  test("Has the expected column headers and content for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemTable
            menuItems={
              ucsbDiningCommonsMenuItemFixtures.threeUcsbDiningCommonsMenuItems
            }
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedHeaders = ["id", "Dining Commons Code", "Name", "Station"];
    const expectedFields = ["id", "diningCommonsCode", "name", "station"];
    const testId = "UCSBDiningCommonsMenuItemTable";

    expectedHeaders.forEach((headerText) => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-${field}`),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByTestId(`${testId}-cell-row-0-col-Edit-button`),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`),
    ).not.toBeInTheDocument();
  });

  test("Has the expected column headers and content for admin user", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemTable
            menuItems={
              ucsbDiningCommonsMenuItemFixtures.threeUcsbDiningCommonsMenuItems
            }
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const testId = "UCSBDiningCommonsMenuItemTable";

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

  test("Edit button navigates to the edit page for admin user", async () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemTable
            menuItems={
              ucsbDiningCommonsMenuItemFixtures.threeUcsbDiningCommonsMenuItems
            }
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(`UCSBDiningCommonsMenuItemTable-cell-row-0-col-id`),
      ).toBeInTheDocument();
    });

    const editButton = screen.getByTestId(
      `UCSBDiningCommonsMenuItemTable-cell-row-0-col-Edit-button`,
    );
    fireEvent.click(editButton);

    expect(mockedNavigate).toHaveBeenCalledWith(
      "/ucsbdiningcommonsmenuitem/edit/1",
    );
  });

  test("Delete button calls delete callback and displays toast", async () => {
    const currentUser = currentUserFixtures.adminUser;
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock
      .onDelete("/api/ucsbdiningcommonsmenuitem", { params: { id: 1 } })
      .reply(200, { message: "Item deleted" });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemTable
            menuItems={
              ucsbDiningCommonsMenuItemFixtures.threeUcsbDiningCommonsMenuItems
            }
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(`UCSBDiningCommonsMenuItemTable-cell-row-0-col-id`),
      ).toHaveTextContent("1");
    });

    const deleteButton = screen.getByTestId(
      `UCSBDiningCommonsMenuItemTable-cell-row-0-col-Delete-button`,
    );
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(axiosMock.history.delete.length).toBeGreaterThan(0);
    });

    const deleteCall = axiosMock.history.delete[0];
    expect(deleteCall.url).toBe("/api/ucsbdiningcommonsmenuitem");
    expect(deleteCall.params).toEqual({ id: 1 });
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({ message: "Item deleted" }));
  });
});
