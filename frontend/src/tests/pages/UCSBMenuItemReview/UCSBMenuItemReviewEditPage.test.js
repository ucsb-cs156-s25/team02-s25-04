import { render, screen } from "@testing-library/react";
import UCSBMenuItemReviewEditPage from "main/pages/UCSBMenuItemReview/UCSBMenuItemReviewEditPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

describe("UCSBMenuItemReviewEditPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const queryClient = new QueryClient();
  test("Renders expected content", async () => {
    // arrange

    setupUserOnly();

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBMenuItemReviewEditPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert
    await screen.findByText("Edit page not yet implemented");
  });
});

// import { fireEvent, render, waitFor, screen } from "@testing-library/react";
// import { QueryClient, QueryClientProvider } from "react-query";
// import { MemoryRouter } from "react-router-dom";
// import UCSBMenuItemReviewEditPage from "main/pages/UCSBMenuItemReview/UCSBMenuItemReviewEditPage";
// import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
// import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
// import axios from "axios";
// import AxiosMockAdapter from "axios-mock-adapter";
// import mockConsole from "jest-mock-console";

// const mockToast = jest.fn();
// jest.mock("react-toastify", () => {
//   const originalModule = jest.requireActual("react-toastify");
//   return {
//     __esModule: true,
//     ...originalModule,
//     toast: (x) => mockToast(x),
//   };
// });

// const mockNavigate = jest.fn();
// jest.mock("react-router-dom", () => {
//   const originalModule = jest.requireActual("react-router-dom");
//   return {
//     __esModule: true,
//     ...originalModule,
//     useParams: () => ({
//       id: 17,
//     }),
//     Navigate: (x) => {
//       mockNavigate(x);
//       return null;
//     },
//   };
// });

// describe("UCSBMenuItemReviewEditPage tests", () => {
//   describe("when the backend doesn't return data", () => {
//     const axiosMock = new AxiosMockAdapter(axios);

//     beforeEach(() => {
//       axiosMock.reset();
//       axiosMock.resetHistory();
//       axiosMock
//         .onGet("/api/currentUser")
//         .reply(200, apiCurrentUserFixtures.userOnly);
//       axiosMock
//         .onGet("/api/systemInfo")
//         .reply(200, systemInfoFixtures.showingNeither);
//       axiosMock.onGet("/api/ucsbmenuitemreviews", { params: { id: 17 } }).timeout();
//     });

//     const queryClient = new QueryClient();
//     test("renders header but form is not present", async () => {
//       const restoreConsole = mockConsole();

//       render(
//         <QueryClientProvider client={queryClient}>
//           <MemoryRouter>
//             <UCSBMenuItemReviewEditPage />
//           </MemoryRouter>
//         </QueryClientProvider>,
//       );
//       await screen.findByText("Edit UCSB Menu Item Review");
//       expect(screen.queryByTestId("UCSBMenuItemReviewForm-id")).not.toBeInTheDocument();
//       restoreConsole();
//     });
//   });

//   describe("tests where backend is working normally", () => {
//     const axiosMock = new AxiosMockAdapter(axios);

//     beforeEach(() => {
//       axiosMock.reset();
//       axiosMock.resetHistory();
//       axiosMock
//         .onGet("/api/currentUser")
//         .reply(200, apiCurrentUserFixtures.userOnly);
//       axiosMock
//         .onGet("/api/systemInfo")
//         .reply(200, systemInfoFixtures.showingNeither);
//       axiosMock.onGet("/api/ucsbmenuitemreviews", { params: { id: 17 } }).reply(200, {
//         id: 17,
//         name: "Pi Day",
//         stars: 5,
//         reviewText: "Great day!",
//       });
//       axiosMock.onPut("/api/ucsbmenuitemreviews").reply(200, {
//         id: 17,
//         name: "Christmas Morning",
//         stars: 4,
//         reviewText: "Wonderful holiday!",
//       });
//     });

//     const queryClient = new QueryClient();
//     test("renders without crashing", async () => {
//       render(
//         <QueryClientProvider client={queryClient}>
//           <MemoryRouter>
//             <UCSBMenuItemReviewEditPage />
//           </MemoryRouter>
//         </QueryClientProvider>,
//       );

//       await screen.findByTestId("UCSBMenuItemReviewForm-id");
//     });

//     test("Is populated with the data provided", async () => {
//       render(
//         <QueryClientProvider client={queryClient}>
//           <MemoryRouter>
//             <UCSBMenuItemReviewEditPage />
//           </MemoryRouter>
//         </QueryClientProvider>,
//       );

//       await screen.findByTestId("UCSBMenuItemReviewForm-id");

//       const idField = screen.getByTestId("UCSBMenuItemReviewForm-id");
//       const nameField = screen.getByTestId("UCSBMenuItemReviewForm-name");
//       const starsField = screen.getByTestId("UCSBMenuItemReviewForm-stars");
//       const reviewTextField = screen.getByTestId("UCSBMenuItemReviewForm-reviewText");
//       const submitButton = screen.getByTestId("UCSBMenuItemReviewForm-submit");

//       expect(idField).toHaveValue("17");
//       expect(nameField).toHaveValue("Pi Day");
//       expect(starsField).toHaveValue(5);
//       expect(reviewTextField).toHaveValue("Great day!");
//       expect(submitButton).toBeInTheDocument();
//     });

//     test("Changes when you click Update", async () => {
//       render(
//         <QueryClientProvider client={queryClient}>
//           <MemoryRouter>
//             <UCSBMenuItemReviewEditPage />
//           </MemoryRouter>
//         </QueryClientProvider>,
//       );

//       await screen.findByTestId("UCSBMenuItemReviewForm-id");

//       const idField = screen.getByTestId("UCSBMenuItemReviewForm-id");
//       const nameField = screen.getByTestId("UCSBMenuItemReviewForm-name");
//       const starsField = screen.getByTestId("UCSBMenuItemReviewForm-stars");
//       const reviewTextField = screen.getByTestId("UCSBMenuItemReviewForm-reviewText");
//       const submitButton = screen.getByTestId("UCSBMenuItemReviewForm-submit");

//       expect(idField).toHaveValue("17");
//       expect(nameField).toHaveValue("Pi Day");
//       expect(starsField).toHaveValue(5);
//       expect(reviewTextField).toHaveValue("Great day!");

//       fireEvent.change(nameField, { target: { value: "Christmas Morning" } });
//       fireEvent.change(starsField, { target: { value: 4 } });
//       fireEvent.change(reviewTextField, { target: { value: "Wonderful holiday!" } });

//       fireEvent.click(submitButton);

//       await waitFor(() => expect(mockToast).toBeCalled());
//       expect(mockToast).toBeCalledWith(
//         "UCSB Menu Item Review Updated - id: 17 name: Christmas Morning"
//       );
//       expect(mockNavigate).toBeCalledWith({ to: "/ucsbmenuitemreviews" });

//       expect(axiosMock.history.put.length).toBe(1); // times called
//       expect(axiosMock.history.put[0].data).toBe(
//         JSON.stringify({
//           name: "Christmas Morning",
//           stars: 4,
//           reviewText: "Wonderful holiday!",
//         })
//       ); // posted object
//     });
//   });
// });
