import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

export default function UCSBMenuItemReviewIndexPage() {
  // Stryker disable all : placeholder for future implementation
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Index page not yet implemented</h1>
        <p>
          <a href="/placeholder/create">Create</a>
        </p>
        <p>
          <a href="/placeholder/edit/1">Edit</a>
        </p>
      </div>
    </BasicLayout>
  );
}

// import React from "react";
// import { useBackend } from "main/utils/useBackend";
// import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
// import UCSBMenuItemReviewTable from "main/components/UCSBMenuItemReviews/UCSBMenuItemReviewTable";
// import { Button } from "react-bootstrap";
// import { useCurrentUser, hasRole } from "main/utils/currentUser";

// export default function UCSBMenuItemReviewIndexPage() {
//   const currentUser = useCurrentUser();

//   const createButton = () => {
//     if (hasRole(currentUser, "ROLE_ADMIN")) {
//       return (
//         <Button
//           variant="primary"
//           href="/ucsbmenuitemreview/create"
//           style={{ float: "right" }}
//         >
//           Create UCSBMenuItemReview
//         </Button>
//       );
//     }
//   };

//   const { data: reviews, error: _error, status: _status } = useBackend(
//     ["/api/ucsbdiningcommonsmenuitemreview/all"],
//     { method: "GET", url: "/api/ucsbdiningcommonsmenuitemreview/all" },
//     []
//   );

//   return (
//     <BasicLayout>
//       <div className="pt-2">
//         {createButton()}
//         <h1>UCSBMenuItemReviews</h1>
//         <UCSBMenuItemReviewTable reviews={reviews} currentUser={currentUser} />
//       </div>
//     </BasicLayout>
//   );
// }
