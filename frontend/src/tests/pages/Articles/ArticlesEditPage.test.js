
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

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
      id: 17,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("ArticlesEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
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
      axiosMock.onGet("/api/articles", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Articles");
      expect(screen.queryByTestId("Articles-title")).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
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
      axiosMock.onGet("/api/articles", { params: { id: 17 } }).reply(200, {
        id: 17,
        title: "FZ - Copied files from team01 for Backend",
        url: "https://github.com/ucsb-cs156-s25/team02-s25-04/commit/090e4183ffa92de16915b01db3ea787ed239f1f1",
        explanation: "Copied files from team01 for Backend",
        email: "fahimzaman@ucsb.edu",
        dateAdded: "2025-04-29T08:45:01",
      });
      axiosMock.onPut("/api/articles").reply(200, {
        id: "17",
        title: "FZ - Copied files from team01 for Backend Edit",
        url: "https://github.com/ucsb-cs156-s25/team02-s25-02/commit/090e4183ffa92de16915b01db3ea787ed239f1f1",
        explanation: "Copied files from team01 for Backend Edit",
        email: "renbo@ucsb.edu",
        dateAdded: "2025-04-29T08:25:02",
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("ArticlesForm-id");

      const idField = screen.getByTestId("ArticlesForm-id");
      const titleField = screen.getByTestId("ArticlesForm-title");
      const urlField = screen.getByLabelText("Url");
      const explanationField = screen.getByLabelText("Explanation");
      const emailField = screen.getByLabelText("Email");
      const dateAddedField = screen.getByLabelText("Date Added (iso format)");
      const submitButton = screen.getByText("Update");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(titleField).toBeInTheDocument();
      expect(titleField).toHaveValue(
        "FZ - Copied files from team01 for Backend",
      );
      expect(emailField).toBeInTheDocument();
      expect(urlField).toBeInTheDocument(
        "https://github.com/ucsb-cs156-s25/team02-s25-04/commit/090e4183ffa92de16915b01db3ea787ed239f1f1",
      );
      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue(
        "Copied files from team01 for Backend",
      );
      expect(emailField).toBeInTheDocument();
      expect(emailField).toHaveValue("fahimzaman@ucsb.edu");
      expect(dateAddedField).toBeInTheDocument();
      expect(dateAddedField).toHaveValue("2025-04-29T08:45:01.000");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(titleField, {
        target: { value: "FZ - Copied files from team01 for Backend Edit" },
      });
      fireEvent.change(urlField, {
        target: {
          value:
            "https://github.com/ucsb-cs156-s25/team02-s25-02/commit/090e4183ffa92de16915b01db3ea787ed239f1f1",
        },
      });
      fireEvent.change(explanationField, {
        target: { value: "Copied files from team01 for Backend Edit" },
      });
      fireEvent.change(emailField, {
        target: { value: "renbo@ucsb.edu" },
      });
      fireEvent.change(dateAddedField, {
        target: { value: "2025-04-29T08:25:02" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Articles Updated - id: 17 title: FZ - Copied files from team01 for Backend Edit",
      );

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/articles" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          title: "FZ - Copied files from team01 for Backend Edit",
          url: "https://github.com/ucsb-cs156-s25/team02-s25-02/commit/090e4183ffa92de16915b01db3ea787ed239f1f1",
          explanation: "Copied files from team01 for Backend Edit",
          email: "renbo@ucsb.edu",
          dateAdded: "2025-04-29T08:25:02.000",
        }),
      ); // posted object
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/articles" });
    });
  });
});
