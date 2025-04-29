import {
  render,
  waitFor,
  fireEvent,
  screen,
} from "@testing-library/react";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UCSBDiningCommonsMenuItemForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>,
    );
    await screen.findByText(/Create/);
  });

  test("renders correctly when passing in a UCSBDiningCommonsMenuItem", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm
          initialContents={
            ucsbDiningCommonsMenuItemFixtures.oneUcsbDiningCommonsMenuItem
          }
        />
      </Router>,
    );

    await screen.findByTestId("UCSBDiningCommonsMenuItemForm-id");

    expect(
      screen.getByTestId("UCSBDiningCommonsMenuItemForm-id"),
    ).toHaveValue("1");

    expect(
      screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode"),
    ).toHaveValue("Portola");

    expect(
      screen.getByTestId("UCSBDiningCommonsMenuItemForm-name"),
    ).toHaveValue("Pizza");

    expect(
      screen.getByTestId("UCSBDiningCommonsMenuItemForm-station"),
    ).toHaveValue("Pizza Station");
  });

  test("Correct Error messages on missing input", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>,
    );
    await screen.findByTestId("UCSBDiningCommonsMenuItemForm-submit");
    const submitButton = screen.getByTestId(
      "UCSBDiningCommonsMenuItemForm-submit",
    );

    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/Dining Commons Code is required./),
    ).toBeInTheDocument();
    expect(await screen.findByText(/Name is required./)).toBeInTheDocument();
    expect(await screen.findByText(/Station is required./)).toBeInTheDocument();
  });

  test("No Error messages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm submitAction={mockSubmitAction} />
      </Router>,
    );

    const diningCommonsCodeField = screen.getByTestId(
      "UCSBDiningCommonsMenuItemForm-diningCommonsCode",
    );
    const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-name");
    const stationField = screen.getByTestId(
      "UCSBDiningCommonsMenuItemForm-station",
    );
    const submitButton = screen.getByTestId(
      "UCSBDiningCommonsMenuItemForm-submit",
    );

    fireEvent.change(diningCommonsCodeField, {
      target: { value: "Portola" },
    });
    fireEvent.change(nameField, {
      target: { value: "Pizza" },
    });
    fireEvent.change(stationField, {
      target: { value: "Pizza Station" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/Dining Commons Code is required./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Name is required./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Station is required./),
    ).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>,
    );
    await screen.findByTestId("UCSBDiningCommonsMenuItemForm-cancel");
    const cancelButton = screen.getByTestId(
      "UCSBDiningCommonsMenuItemForm-cancel",
    );

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
