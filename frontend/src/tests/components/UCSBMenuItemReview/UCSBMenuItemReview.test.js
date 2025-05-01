import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBMenuItemReviewForm from "main/components/UCSBMenuItemReview/UCSBMenuItemReviewForm";
import { ucsbMenuItemReviewFixtures } from "fixtures/ucsbMenuItemReviewFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UCSBMenuItemReviewForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <UCSBMenuItemReviewForm />
      </Router>,
    );
    await screen.findByText(/Create/);
  });

  test("renders correctly when passing in a UCSBMenuItemReview", async () => {
    render(
      <Router>
        <UCSBMenuItemReviewForm
          initialContents={ucsbMenuItemReviewFixtures.oneReview}
        />
      </Router>,
    );
    expect(screen.getByTestId("UCSBMenuItemReviewForm-id")).toHaveValue("1");
    expect(
      screen.getByTestId("UCSBMenuItemReviewForm-reviewerEmail"),
    ).toHaveValue("student@ucsb.edu");
    expect(screen.getByTestId("UCSBMenuItemReviewForm-stars")).toHaveValue(4);
    expect(
      screen.getByTestId("UCSBMenuItemReviewForm-dateReviewed"),
    ).toHaveValue("2023-05-15T12:00");
    expect(screen.getByTestId("UCSBMenuItemReviewForm-comments")).toHaveValue(
      "Very tasty!",
    );
    expect(screen.getByTestId("UCSBMenuItemReviewForm-itemId")).toHaveValue(42);
  });

  test("Shows error messages on missing input", async () => {
    render(
      <Router>
        <UCSBMenuItemReviewForm />
      </Router>,
    );

    const submitButton = screen.getByTestId("UCSBMenuItemReviewForm-submit");
    fireEvent.click(submitButton);

    await screen.findByText(/Reviewer Email is required/);
    expect(screen.getByText(/Stars are required/)).toBeInTheDocument();
    expect(screen.getByText(/Date Reviewed is required/)).toBeInTheDocument();
    expect(screen.getByText(/Comments are required/)).toBeInTheDocument();
    expect(screen.getByText(/Item ID is required/)).toBeInTheDocument();

  });

  test("No error messages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <UCSBMenuItemReviewForm submitAction={mockSubmitAction} />
      </Router>,
    );

    fireEvent.change(
      screen.getByTestId("UCSBMenuItemReviewForm-reviewerEmail"),
      {
        target: { value: "student@ucsb.edu" },
      },
    );
    fireEvent.change(screen.getByTestId("UCSBMenuItemReviewForm-stars"), {
      target: { value: 5 },
    });
    fireEvent.change(
      screen.getByTestId("UCSBMenuItemReviewForm-dateReviewed"),
      {
        target: { value: "2024-04-15T11:30" },
      },
    );
    fireEvent.change(screen.getByTestId("UCSBMenuItemReviewForm-comments"), {
      target: { value: "Excellent dish" },
    });
    fireEvent.change(screen.getByTestId("UCSBMenuItemReviewForm-itemId"), {
      target: { value: 99 },
    });

    fireEvent.click(screen.getByTestId("UCSBMenuItemReviewForm-submit"));

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(screen.queryByText(/is required/)).not.toBeInTheDocument();
  });

  test("navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <UCSBMenuItemReviewForm />
      </Router>,
    );

    const cancelButton = screen.getByTestId("UCSBMenuItemReviewForm-cancel");
    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  
});
