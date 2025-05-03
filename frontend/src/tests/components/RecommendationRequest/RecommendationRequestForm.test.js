import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("RecommendationRequestForm tests", () => {
  const onSubmit = jest.fn();

  beforeEach(() => {
    onSubmit.mockClear();
    mockedNavigate.mockClear();
  });

  const renderForm = () => {
    render(
      <Router>
        <RecommendationRequestForm submitAction={onSubmit} />
      </Router>,
    );
  };

  test("renders correctly with default button label", () => {
    renderForm();
    expect(screen.getByText(/Create/)).toBeInTheDocument();
  });

  test("renders correctly when passing in a RecommendationRequest", async () => {
    render(
      <Router>
        <RecommendationRequestForm
          initialContents={recommendationRequestFixtures.oneRequest}
        />
      </Router>,
    );
    expect(screen.getByTestId("RecommendationRequestForm-id")).toHaveValue("1");
    expect(
      screen.getByTestId("RecommendationRequestForm-requesterEmail"),
    ).toHaveValue("test@test.com");
    expect(
      screen.getByTestId("RecommendationRequestForm-professorEmail"),
    ).toHaveValue("test@test.com");
    expect(
      screen.getByTestId("RecommendationRequestForm-explanation"),
    ).toHaveValue("Test explanation");
  });

  test("Shows error messages on missing input", async () => {
    renderForm();
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");
    fireEvent.click(submitButton);

    await screen.findByText(/Requester email is required./);
    expect(
      screen.getByText(/Professor email is required./),
    ).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
  });

  test("No error messages on good input", async () => {
    renderForm();
    const requesterEmailInput = screen.getByTestId(
      "RecommendationRequestForm-requesterEmail",
    );
    const professorEmailInput = screen.getByTestId(
      "RecommendationRequestForm-professorEmail",
    );
    const explanationInput = screen.getByTestId(
      "RecommendationRequestForm-explanation",
    );
    fireEvent.change(requesterEmailInput, {
      target: { value: "student@ucsb.edu" },
    });
    fireEvent.change(professorEmailInput, {
      target: { value: "professor@ucsb.edu" },
    });
    fireEvent.change(explanationInput, {
      target: { value: "I need a recommendation for graduate school" },
    });

    fireEvent.click(screen.getByTestId("RecommendationRequestForm-submit"));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());

    expect(screen.queryByText(/is required/)).not.toBeInTheDocument();
  });

  test("navigate(-1) is called when Cancel is clicked", async () => {
    renderForm();
    const cancelButton = screen.getByTestId("RecommendationRequestForm-cancel");
    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
