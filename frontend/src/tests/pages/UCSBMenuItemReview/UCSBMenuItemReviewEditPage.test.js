import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBMenuItemReviewEditPage from "main/pages/UCSBMenuItemReview/UCSBMenuItemReviewEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

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
    useParams: () => ({
      id: 5,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("UCSBMenuItemReviewEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/ucsbmenuitemreview", { params: { id: 5 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but form fields are not present", async () => {
      const restoreConsole = mockConsole();
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBMenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await screen.findByText("Edit UCSBMenuItemReview");
      expect(screen.queryByTestId("UCSBMenuItemReviewForm-reviewerEmail")).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);

      axiosMock.onGet("/api/ucsbmenuitemreview", { params: { id: 5 } }).reply(200, {
        id: 5,
        reviewerEmail: "test@ucsb.edu",
        stars: 4,
        dateReviewed: "2023-04-01T12:00",
        itemId: 10,
        comments: "Great item!",
      });

      axiosMock.onPut("/api/ucsbmenuitemreview").reply(200, {
        id: 5,
        reviewerEmail: "updated@ucsb.edu",
        stars: 5,
        dateReviewed: "2023-05-01T08:30",
        itemId: 11,
        comments: "Updated review",
      });
    });

    const queryClient = new QueryClient();
    test("renders without crashing", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBMenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await screen.findByTestId("UCSBMenuItemReviewForm-reviewerEmail");
    });

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBMenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await screen.findByTestId("UCSBMenuItemReviewForm-reviewerEmail");

      expect(screen.getByTestId("UCSBMenuItemReviewForm-id")).toHaveValue("5");
      expect(screen.getByTestId("UCSBMenuItemReviewForm-reviewerEmail")).toHaveValue("test@ucsb.edu");
      expect(screen.getByTestId("UCSBMenuItemReviewForm-stars")).toHaveValue(4);
      expect(screen.getByTestId("UCSBMenuItemReviewForm-dateReviewed")).toHaveValue("2023-04-01T12:00");
      expect(screen.getByTestId("UCSBMenuItemReviewForm-itemId")).toHaveValue(10);
      expect(screen.getByTestId("UCSBMenuItemReviewForm-comments")).toHaveValue("Great item!");
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBMenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );
    
      await screen.findByTestId("UCSBMenuItemReviewForm-reviewerEmail");
    
      fireEvent.change(screen.getByTestId("UCSBMenuItemReviewForm-reviewerEmail"), {
        target: { value: "updated@ucsb.edu" },
      });
      fireEvent.change(screen.getByTestId("UCSBMenuItemReviewForm-stars"), {
        target: { value: "5" }, // string value
      });
      fireEvent.change(screen.getByTestId("UCSBMenuItemReviewForm-dateReviewed"), {
        target: { value: "2023-05-01T08:30" },
      });
      fireEvent.change(screen.getByTestId("UCSBMenuItemReviewForm-itemId"), {
        target: { value: "11" }, // string value
      });
      fireEvent.change(screen.getByTestId("UCSBMenuItemReviewForm-comments"), {
        target: { value: "Updated review" },
      });
    
      fireEvent.click(screen.getByTestId("UCSBMenuItemReviewForm-submit"));
    
      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith("Review Updated - id: 5");
      expect(mockNavigate).toBeCalledWith({ to: "/ucsbmenuitemreview" });
    
      expect(axiosMock.history.put.length).toBe(1);
      expect(axiosMock.history.put[0].params).toEqual({ id: 5 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          id: 5, // include id in the PUT request payload
          reviewerEmail: "updated@ucsb.edu",
          stars: "5", // string
          dateReviewed: "2023-05-01T08:30",
          itemId: "11", // string
          comments: "Updated review",
        })
      );
    });
    
  });
});
