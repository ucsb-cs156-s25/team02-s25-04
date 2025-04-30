import React from "react";
import UCSBMenuItemReviewForm from "main/components/UCSBMenuItemReview/UCSBMenuItemReviewForm";
import { ucsbMenuItemReviewFixtures } from "fixtures/ucsbMenuItemReviewFixtures";

export default {
  title: "components/UCSBMenuItemReview/UCSBMenuItemReviewForm",
  component: UCSBMenuItemReviewForm,
};

const Template = (args) => <UCSBMenuItemReviewForm {...args} />;

export const Create = Template.bind({});
Create.args = {
  buttonLabel: "Create",
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};

export const Update = Template.bind({});
Update.args = {
  initialContents: ucsbMenuItemReviewFixtures.oneReview,
  buttonLabel: "Update",
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};
