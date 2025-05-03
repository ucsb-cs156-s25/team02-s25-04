import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";
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

describe("ArticlesCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    jest.clearAllMocks();
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
  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /articles", async () => {
    const queryClient = new QueryClient();
    const articles = {
      id: 2,
      title: "FZ - Copied files from team01 for Backend",
      url: "https://github.com/ucsb-cs156-s25/team02-s25-04/commit/090e4183ffa92de16915b01db3ea787ed239f1f1",
      explanation: "Copied files from team01 for Backend",
      email: "fahimzaman@ucsb.edu",
      dateAdded: "2025-04-29T08:45:00",
    };

    axiosMock.onPost("/api/articles/post").reply(202, articles);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText("Title");
    expect(titleInput).toBeInTheDocument();

    const urlInput = screen.getByLabelText("Url");
    expect(urlInput).toBeInTheDocument();

    const explanationInput = screen.getByLabelText("Explanation");
    expect(explanationInput).toBeInTheDocument();

    const emailInput = screen.getByLabelText("Email");
    expect(emailInput).toBeInTheDocument();

    const dateAddedInput = screen.getByLabelText("Date Added (iso format)");
    expect(dateAddedInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(titleInput, {
      target: { value: "FZ - Copied files from team01 for Backend" },
    });
    fireEvent.change(urlInput, {
      target: {
        value:
          "https://github.com/ucsb-cs156-s25/team02-s25-04/commit/090e4183ffa92de16915b01db3ea787ed239f1f1",
      },
    });
    fireEvent.change(explanationInput, {
      target: { value: "Copied files from team01 for Backend" },
    });
    fireEvent.change(emailInput, { target: { value: "fahimzaman@ucsb.edu" } });
    fireEvent.change(dateAddedInput, {
      target: { value: "2025-04-29T08:45:00" },
    });

    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      title: "FZ - Copied files from team01 for Backend",
      url: "https://github.com/ucsb-cs156-s25/team02-s25-04/commit/090e4183ffa92de16915b01db3ea787ed239f1f1",
      explanation: "Copied files from team01 for Backend",
      email: "fahimzaman@ucsb.edu",
      dateAdded: "2025-04-29T08:45",
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toHaveBeenCalledWith(
      "New articles Created - id: 2 title: FZ - Copied files from team01 for Backend",
    );
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/articles" });
  });
});
