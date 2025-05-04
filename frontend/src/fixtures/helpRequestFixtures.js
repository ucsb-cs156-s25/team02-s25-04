const helpRequestFixtures = {
  oneHelpRequest: {
    id: 2,
    requesterEmail: "fahimzaman@ucsb.edu",
    teamId: "s25-6pm-4",
    tableOrBreakoutRoom: "4",
    requestTime: "2025-04-30T18:27:59.04",
    explanation: "I have issues creating controller to Update a HelpRequest",
    solved: false,
  },
  threeHelpRequests: [
    {
      id: 1,
      requesterEmail: "fahimzaman@ucsb.edu",
      teamId: "s25-6pm-4",
      tableOrBreakoutRoom: "4",
      requestTime: "2025-04-29T23:26:00",
      explanation: "I had issues setting up controller to Post a HelpRequest",
      solved: false,
    },

    {
      id: 3,
      requesterEmail: "fahimzaman@ucsb.edu",
      teamId: "s25-6pm-4",
      tableOrBreakoutRoom: "4",
      requestTime: "2025-04-29T23:26:00",
      explanation: "I can't deploy my website to dokku",
      solved: true,
    },
    {
      id: 4,
      requesterEmail: "fahimzaman@ucsb.edu",
      teamId: "s25-6pm-4",
      tableOrBreakoutRoom: "4",
      requestTime: "2025-04-29T23:29:00",
      explanation: "I can't figure out how to delete a help request post",
      solved: true,
    },
  ],
};

export { helpRequestFixtures };
