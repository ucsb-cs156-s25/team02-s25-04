import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbMenuItemReviewFixtures } from "fixtures/ucsbMenuItemReviewFixtures"; // assuming this fixture exists
import { http, HttpResponse } from "msw";

import UCSBMenuItemReviewEditPage from "main/pages/UCSBMenuItemReview/UCSBMenuItemReviewEditPage";

export default {
  title: "pages/UCSBMenuItemReview/UCSBMenuItemReviewEditPage",
  component: UCSBMenuItemReviewEditPage,
};

const Template = () => <UCSBMenuItemReviewEditPage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
    http.get("/api/ucsbmenuitemreview", () => {
      return HttpResponse.json(ucsbMenuItemReviewFixtures.reviewData[0], {
        status: 200,
      });
    }),
    http.put("/api/ucsbmenuitemreview", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
