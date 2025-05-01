import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import UCSBOrganizationForm from "main/components/UCSBOrganizations/UCSBOrganizationForm";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UCSBOrganizationForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "Org Code",
    "Org Translation Short",
    "Org Translation",
    "Inactive",
  ];
  const testId = "UCSBOrganizationForm";

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });
    const orgCodeInput = screen.getByTestId(`${testId}-orgCode`);
    expect(orgCodeInput).toHaveValue(""); //checking defaults
    expect(orgCodeInput).not.toBeDisabled();

    const inactiveCheckbox = screen.getByTestId(`${testId}-inactive`);
    expect(inactiveCheckbox).not.toBeChecked();
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm
            initialContents={ucsbOrganizationFixtures.oneUcsbOrganization[0]}
          />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testId}-orgCode`)).toBeInTheDocument();
    expect(screen.getByText(`Org Code`)).toBeInTheDocument();

    const orgCodeInput = screen.getByTestId(`${testId}-orgCode`);
    expect(orgCodeInput).toHaveValue("ZPR");
    expect(orgCodeInput).toBeDisabled();

    const inactiveCheckbox = screen.getByTestId(`${testId}-inactive`);
    expect(inactiveCheckbox).not.toBeChecked();
  });

  test("checkbox test", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm
            initialContents={ucsbOrganizationFixtures.threeUcsbOrganizations[2]}
          />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testId}-orgCode`)).toBeInTheDocument();
    expect(screen.getByText(`Org Code`)).toBeInTheDocument();

    const orgCodeInput = screen.getByTestId(`${testId}-orgCode`);
    expect(orgCodeInput).toHaveValue("OSLI");
    expect(orgCodeInput).toBeDisabled();

    const inactiveCheckbox = screen.getByTestId(`${testId}-inactive`);
    expect(inactiveCheckbox).toBeChecked();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>,
    );
    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/Org Translation is required/);
    expect(screen.getByText(/Org Translation is required/)).toBeInTheDocument();

    await screen.findByText(/Org Translation Short is required/);
    expect(
      screen.getByText(/Org Translation Short is required/),
    ).toBeInTheDocument();

    await screen.findByText(/Org Code is required/);
    expect(screen.getByText(/Org Code is required/)).toBeInTheDocument();

    const orgTranslationShortInput = screen.getByTestId(
      `${testId}-orgTranslationShort`,
    );
    fireEvent.change(orgTranslationShortInput, {
      target: { value: "a".repeat(31) },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Max length 30 characters/)).toBeInTheDocument();
    });

    const orgCodeInput = screen.getByTestId(`${testId}-orgCode`);
    fireEvent.change(orgCodeInput, {
      target: { value: "a".repeat(11) },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Max length 10 characters/)).toBeInTheDocument();
    });
  });
});
