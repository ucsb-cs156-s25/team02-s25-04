import React from "react";
import { useBackend } from "main/utils/useBackend";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBMenuItemReviewTable from "main/components/UCSBMenuItemReview/UCSBMenuItemReviewTable";
import { Button } from "react-bootstrap";
import { useCurrentUser, hasRole } from "main/utils/currentUser";

export default function UCSBMenuItemReviewIndexPage() {
  const currentUser = useCurrentUser();

  // Create button shown only for users with admin role
  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
      return (
        <Button
          variant="primary"
          href="/ucsbmenuitemreview/create"
          style={{ float: "right" }}
        >
          Create UCSBMenuItemReview
        </Button>
      );
    }
  };

  // Fetch all reviews from the backend API
  const {
    data: reviews,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/ucsbmenuitemreview/all"],
    {
      method: "GET",
      url: "/api/ucsbmenuitemreview/all",
    },
    [],
  );

  return (
    <BasicLayout>
      <div className="pt-2">
        {/* Render the create button if the user is an admin */}
        {createButton()}
        <h1>UCSBMenuItemReview</h1>
        {/* Display the reviews in a table */}
        <UCSBMenuItemReviewTable reviews={reviews} currentUser={currentUser} />
      </div>
    </BasicLayout>
  );
}
