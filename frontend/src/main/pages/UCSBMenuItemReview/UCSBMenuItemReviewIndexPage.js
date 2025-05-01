import React from "react";
import { useBackend } from "main/utils/useBackend";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBMenuItemReviewTable from "main/components/UCSBMenuItemReview/UCSBMenuItemReviewTable";
import { Button } from "react-bootstrap";
import { useCurrentUser, hasRole } from "main/utils/currentUser";

export default function UCSBMenuItemReviewIndexPage() {
  const currentUser = useCurrentUser();

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

  const {
    data: reviews,
    error: _error,
    status: _status,
  } = useBackend(
    ["/api/ucsbmenuitemreview/all"],
    { method: "GET", url: "/api/ucsbmenuitemreview/all" },
    [],
  );

  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>UCSBMenuItemReview</h1>
        <UCSBMenuItemReviewTable reviews={reviews} currentUser={currentUser} />
      </div>
    </BasicLayout>
  );
}
