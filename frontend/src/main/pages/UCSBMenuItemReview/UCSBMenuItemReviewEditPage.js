import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import UCSBMenuItemReviewForm from "main/components/UCSBMenuItemReview/UCSBMenuItemReviewForm";
import { Navigate } from "react-router-dom";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBMenuItemReviewEditPage({ storybook = false }) {
  let { id } = useParams();

  // Fetch review data based on the provided ID
  const {
    data: review,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/ucsbmenuitemreview?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
      method: "GET",
      url: "/api/ucsbmenuitemreview",
      params: {
        id,
      },
    },
  );

  // Function to prepare PUT request parameters
  const objectToAxiosPutParams = (review) => ({
    url: "/api/ucsbmenuitemreview",
    method: "PUT",
    params: {
      id: review.id,
    },
    data: review, // Review data will be sent as part of the PUT request
  });

  // Success callback when review is updated successfully
  const onSuccess = (review) => {
    toast(`Review Updated - id: ${review.id}`);
  };

  // Mutation setup to perform the PUT request with success callback
  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/ucsbmenuitemreview?id=${id}`],
  );

  const { isSuccess } = mutation;

  // Function to handle form submission and trigger mutation
  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  // Redirect to the main review page if the mutation is successful and not in storybook mode
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
