import React from "react";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

const queryClient = new QueryClient();

export default {
  title: "pages/RecommendationRequest/RecommendationRequestCreatePage",
  component: RecommendationRequestCreatePage,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </QueryClientProvider>
    ),
  ],
};

const Template = () => <RecommendationRequestCreatePage />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    {
      method: "post",
      path: "/api/recommendationrequests",
      response: {
        id: 1,
        requesterEmail: "student@ucsb.edu",
        professorEmail: "professor@ucsb.edu",
        explanation: "I need a recommendation for graduate school",
        dateRequested: "2022-01-02T12:00:00",
      },
    },
  ],
};
