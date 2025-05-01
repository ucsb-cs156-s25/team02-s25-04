import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

export default function UCSBMenuItemReviewCreatePage() {
  // Stryker disable all : placeholder for future implementation
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create page not yet implemented</h1>
      </div>
    </BasicLayout>
  );
}

// import React from "react";
// import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
// import UCSBMenuItemReviewForm from "main/components/UCSBMenuItemReviews/UCSBMenuItemReviewForm";
// import { Navigate } from "react-router-dom";
// import { useBackendMutation } from "main/utils/useBackend";
// import { toast } from "react-toastify";

// export default function UCSBMenuItemReviewCreatePage({ storybook = false }) {
//   const objectToAxiosParams = (review) => ({
//     url: "/api/ucsbdiningcommonsmenuitemreview/post",
//     method: "POST",
//     params: review,
//   });

//   const onSuccess = (review) => {
//     toast(`New Review Created - id: ${review.id}`);
//   };

//   const mutation = useBackendMutation(objectToAxiosParams, { onSuccess });

//   const { isSuccess } = mutation;

//   const onSubmit = async (data) => {
//     mutation.mutate(data);
//   };

//   if (isSuccess && !storybook) {
//     return <Navigate to="/ucsbmenuitemreview" />;
//   }

//   return (
//     <BasicLayout>
//       <div className="pt-2">
//         <h1>Create New UCSBMenuItemReview</h1>
//         <UCSBMenuItemReviewForm submitAction={onSubmit} />
//       </div>
//     </BasicLayout>
//   );
// }
