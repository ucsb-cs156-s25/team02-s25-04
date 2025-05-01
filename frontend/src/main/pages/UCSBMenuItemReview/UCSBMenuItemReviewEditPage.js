import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams, Navigate } from "react-router-dom";
import UCSBMenuItemReviewForm from "main/components/UCSBMenuItemReview/UCSBMenuItemReviewForm";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBMenuItemReviewEditPage({ storybook = false }) {
  let { id } = useParams();

  const { data: review } = useBackend(
    [`/api/ucsbmenuitemreview?id=${id}`],
    {
      method: "GET",
      url: "/api/ucsbmenuitemreview",
      params: { id },
    }
  );

  const objectToAxiosPutParams = (review) => ({
    url: "/api/ucsbmenuitemreview",
    method: "PUT",
    params: { id: review.id },
    data: review,
  });

  const onSuccess = (review) => {
    toast(`Review Updated - id: ${review.id}`);
  };

  const mutation = useBackendMutation(objectToAxiosPutParams, { onSuccess });

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/ucsbmenuitemreview" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit UCSBMenuItemReview</h1>
        {review && (
          <UCSBMenuItemReviewForm
            initialContents={review}
            submitAction={onSubmit}
            buttonLabel="Update"
          />
        )}
      </div>
    </BasicLayout>
  );
}
