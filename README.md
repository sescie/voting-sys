# Voting System

This repository contains code for a simple voting system implemented using TypeScript. The system allows users to create votes, retrieve vote statistics, and delete their own votes. It provides basic functionalities for managing and summarizing votes.

## Functionality

The code provides the following functionalities:

- Retrieving the polling question: The `getPollingQuestion` function retrieves the question displayed to users in the poll.
- Creating a vote: The `createVote` function allows users to create a new vote with a boolean value (yes or no) and optional comments.
- Retrieving all the votes: The `getAllTheVotes` function retrieves all the votes stored in the system.
- Retrieving summarised vote statistics: The `getSummarisedVotes` function calculates and provides summarised statistics (number of yes and no votes) for the poll.
- Deleting a user's vote: The `deleteAUsersVote` function allows users to delete their own votes.


## Run My Canister Locally

bash
npm run dfx_install
npm install
dfx start --background --clean
dfx deploy
dfx stop


## Innovative Points for Improvement

While the current implementation provides basic functionality for a voting system, there are several innovative points and they include User Authentication and Authorization ,Dynamic Poll Questions, Vote Expiry and Time Limits, Vote Weightage, Data Visualization

