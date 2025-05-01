import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBMenuItemReviewCreatePage from "main/pages/UCSBMenuItemReview/UCSBMenuItemReviewCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

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

describe("UCSBMenuItemReviewCreatePage tests", () => {
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

  test("renders without crashing", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBMenuItemReviewCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByTestId("UCSBMenuItemReviewForm-itemId");
  });

  test("submits form and navigates correctly", async () => {
    const queryClient = new QueryClient();

    const review = {
      id: 42,
      itemId: 5,
      reviewerEmail: "test@ucsb.edu",
      stars: 4,
      dateReviewed: "2023-10-01T12:00",
      comments: "Great taste!",
    };

    axiosMock
      .onPost("/api/ucsbmenuitemreview/post")
      .reply(202, review);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBMenuItemReviewCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByTestId("UCSBMenuItemReviewForm-itemId");

    fireEvent.change(screen.getByTestId("UCSBMenuItemReviewForm-itemId"), {
      target: { value: "5" },
    });
    fireEvent.change(
      screen.getByTestId("UCSBMenuItemReviewForm-reviewerEmail"),
      {
        target: { value: "test@ucsb.edu" },
      },
    );
    fireEvent.change(screen.getByTestId("UCSBMenuItemReviewForm-stars"), {
      target: { value: "4" },
    });
    fireEvent.change(
      screen.getByTestId("UCSBMenuItemReviewForm-dateReviewed"),
      {
        target: { value: "2023-10-01T12:00" },
      },
    );
    fireEvent.change(screen.getByTestId("UCSBMenuItemReviewForm-comments"), {
      target: { value: "Great taste!" },
    });

    fireEvent.click(screen.getByTestId("UCSBMenuItemReviewForm-submit"));

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      itemId: "5",
      reviewerEmail: "test@ucsb.edu",
      stars: "4",
      dateReviewed: "2023-10-01T12:00",
      comments: "Great taste!",
    });

    expect(mockToast).toBeCalledWith("New Review Created - id: 42");
    expect(mockNavigate).toBeCalledWith({ to: "/ucsbmenuitemreview" });
  });
});
