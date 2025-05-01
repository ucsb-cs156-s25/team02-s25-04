import React from "react";
import UCSBMenuItemReviewTable from "main/components/UCSBMenuItemReview/UCSBMenuItemReviewTable";
import { ucsbMenuItemReviewFixtures } from "fixtures/ucsbMenuItemReviewFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "components/UCSBMenuItemReview/UCSBMenuItemReviewTable",
  component: UCSBMenuItemReviewTable,
};

const Template = (args) => {
  return <UCSBMenuItemReviewTable {...args} />;
};

export const Empty = Template.bind({});
Empty.args = {
  reviews: [],
};

export const ThreeItemsOrdinaryUser = Template.bind({});
ThreeItemsOrdinaryUser.args = {
  reviews: ucsbMenuItemReviewFixtures.threeReviews,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  reviews: ucsbMenuItemReviewFixtures.threeReviews,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/ucsbmenuitemreview", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
