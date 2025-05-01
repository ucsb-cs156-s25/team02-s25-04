import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbMenuItemReviewFixtures } from "fixtures/ucsbMenuItemReviewFixtures";
import { http, HttpResponse } from "msw";

import UCSBMenuItemReviewIndexPage from "main/pages/UCSBMenuItemReview/UCSBMenuItemReviewIndexPage";

export default {
  title: "pages/UCSBMenuItemReview/UCSBMenuItemReviewIndexPage",
  component: UCSBMenuItemReviewIndexPage,
};

const Template = () => <UCSBMenuItemReviewIndexPage storybook={true} />;

export const Empty = Template.bind({});
Empty.parameters = {
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
    http.get("/api/ucsbmenuitemreview/all", () => {
      return HttpResponse.json([], { status: 200 });
    }),
  ],
};

export const ThreeItemsOrdinaryUser = Template.bind({});
ThreeItemsOrdinaryUser.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly);
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither);
    }),
    http.get("/api/ucsbmenuitemreview/all", () => {
      return HttpResponse.json(ucsbMenuItemReviewFixtures.threeReviews);
    }),
  ],
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.adminUser);
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither);
    }),
    http.get("/api/ucsbmenuitemreview/all", () => {
      return HttpResponse.json(ucsbMenuItemReviewFixtures.threeReviews);
    }),
    http.delete("/api/ucsbmenuitemreview", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
