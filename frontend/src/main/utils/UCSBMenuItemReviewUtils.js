import { toast } from "react-toastify";

export function onDeleteSuccess(message) {
  console.log(message);
  toast(message);
}

export function cellToAxiosParamsDelete(cell) {
  return {
    url: "/api/ucsbmenuitemreview",
    method: "DELETE",
    params: {
      id: cell.row.values.id,
    },
  };
}

export function cellToAxiosParamsEdit(cell) {
  return {
    url: "/api/ucsbmenuitemreview",
    method: "PUT",
    params: {
      id: cell.row.values.id,
    },
    data: {
      id: cell.row.values.id,
      reviewerEmail: cell.row.values.reviewerEmail,
      stars: cell.row.values.stars,
      dateReviewed: cell.row.values.dateReviewed,
      comments: cell.row.values.comments,
      itemId: cell.row.values.itemId,
    },
  };
}
