const recommendationRequestFixtures = {
  oneRequest: {
    id: 1,
    requesterEmail: "test@test.com",
    professorEmail: "test@test.com",
    explanation: "Test explanation",
    dateRequested: "2021-01-01T00:00:00Z",
  },
  threeRequests: [
    {
      id: 1,
      requesterEmail: "test@test.com",
      professorEmail: "test@test.com",
      explanation: "Test explanation",
      dateRequested: "2021-01-01T00:00:00Z",
    },
    {
      id: 2,
      requesterEmail: "test2@test.com",
      professorEmail: "test2@test.com",
      explanation: "Test explanation 2",
      dateRequested: "2021-01-02T00:00:00Z",
    },
    {
      id: 3,
      requesterEmail: "test3@test.com",
      professorEmail: "test3@test.com",
      explanation: "Test explanation 3",
      dateRequested: "2021-01-03T00:00:00Z",
    },  
  ],
};

export { recommendationRequestFixtures };