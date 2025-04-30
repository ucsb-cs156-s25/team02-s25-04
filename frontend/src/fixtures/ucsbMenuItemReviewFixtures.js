const ucsbMenuItemReviewFixtures = {
  oneReview: {
    id: 1,
    itemId: 42,
    reviewerEmail: "student@ucsb.edu",
    stars: 4,
    dateReviewed: "2023-05-15T12:00",
    comments: "Very tasty!",
  },
  threeReviews: [
    {
      id: 1,
      itemId: 42,
      reviewerEmail: "student@ucsb.edu",
      stars: 4,
      dateReviewed: "2023-05-15T12:00",
      comments: "Very tasty!",
    },
    {
      id: 2,
      itemId: 20,
      reviewerEmail: "admin@ucsb.edu",
      stars: 5,
      dateReviewed: "2022-04-03T12:00:00",
      comments: "barkbark",
    },
    {
      id: 3,
      itemId: 30,
      reviewerEmail: "guest@ucsb.edu",
      stars: 2,
      dateReviewed: "2022-07-04T12:00:00",
      comments: "barkbarkbark",
    },
  ],
};

export { ucsbMenuItemReviewFixtures };
