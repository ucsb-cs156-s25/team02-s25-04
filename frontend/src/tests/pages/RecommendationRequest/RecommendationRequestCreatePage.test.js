import { render, screen, waitFor } from "@testing-library/react";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { fireEvent } from "@testing-library/react";
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

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("RecommendationRequestCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("when you fill in the form and hit submit, it makes a request to the backend", async () => {
    const recommendationRequest = {
      id: 17,
      requesterEmail: "student@ucsb.edu",
      professorEmail: "professor@ucsb.edu",
      explanation: "I need a recommendation for graduate school",
      dateRequested: "2022-01-02T12:00",
    };

    axiosMock
      .onPost("/api/recommendationrequests/post")
      .reply(202, recommendationRequest);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("RecommendationRequestForm-requesterEmail")
      ).toBeInTheDocument();
    });

    const requesterEmailInput = screen.getByTestId(
      "RecommendationRequestForm-requesterEmail"
    );
    const professorEmailInput = screen.getByTestId(
      "RecommendationRequestForm-professorEmail"
    );
    const explanationInput = screen.getByTestId(
      "RecommendationRequestForm-explanation"
    );
    const dateRequestedInput = screen.getByTestId(
      "RecommendationRequestForm-dateRequested"
    );
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    fireEvent.change(requesterEmailInput, {
      target: { value: "student@ucsb.edu" },
    });
    fireEvent.change(professorEmailInput, {
      target: { value: "professor@ucsb.edu" },
    });
    fireEvent.change(explanationInput, {
      target: { value: "I need a recommendation for graduate school" },
    });
    fireEvent.change(dateRequestedInput, {
      target: { value: "2022-01-02T12:00" },
    });

    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      requesterEmail: "student@ucsb.edu",
      professorEmail: "professor@ucsb.edu",
      explanation: "I need a recommendation for graduate school",
      dateRequested: "2022-01-02T12:00",
    });

    expect(mockToast).toBeCalledWith(
      "New Recommendation Request Created - id: 17"
    );
    expect(mockNavigate).toBeCalledWith({ to: "/recommendationrequest" });
  });
});
