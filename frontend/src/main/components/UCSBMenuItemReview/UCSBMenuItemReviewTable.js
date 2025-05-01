import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/UCSBDateUtils";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function UCSBMenuItemReviewTable({ reviews, currentUser }) {
  const navigate = useNavigate();

  const editCallback = (cell) => {
    navigate("/ucsbmenuitemreview/edit/" + cell.row.values.id);
  };

  // Stryker disable all : hard to test for query caching
  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    ["/api/ucsbmenuitemreview/all"],
  );
  // Stryker restore all

  // Stryker disable next-line all : TODO try to make a good test for this
  const deleteCallback = async (cell) => {
    deleteMutation.mutate(cell);
  };

  const columns = [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "Reviewer Email",
      accessor: "reviewerEmail",
    },
    {
      Header: "Stars",
      accessor: "stars",
    },
    {
      Header: "Date Reviewed",
      accessor: "dateReviewed",
    },
    {
      Header: "Comments",
      accessor: "comments",
    },
    {
      Header: "Item ID",
      accessor: "itemId",
    },
  ];

  if (hasRole(currentUser, "ROLE_ADMIN")) {
    columns.push(
      ButtonColumn("Edit", "primary", editCallback, "UCSBMenuItemReviewTable"),
    );
    columns.push(
      ButtonColumn(
        "Delete",
        "danger",
        deleteCallback,
        "UCSBMenuItemReviewTable",
      ),
    );
  }

  return (
    <OurTable
      data={reviews}
      columns={columns}
      testid={"UCSBMenuItemReviewTable"}
    />
  );
}
