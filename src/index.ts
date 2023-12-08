import {
    $query,
    $update,
    Record,
    StableBTreeMap,
    Vec,
    match,
    Result,
    nat64,
    ic,
    Opt,
    Principal,
  } from "azle";
  import { v4 as uuidv4 } from "uuid";
  
  // Type definition for a single vote
  type Vote = Record<{
    poll_question: string;
    id: string;
    user: Principal;
    created_at: nat64;
    value: boolean;
    comments: Opt<string>;
  }>;
  
  // Type definition for creating a vote
  type CreateVote = Record<{
    value: boolean;
    comments?: Opt<string>;
  }>;
  
  // Type definition for summarizing vote statistics
  type SummarisedVoteStatistics = Record<{
    poll_question: string;
    yes: number;
    no: number;
  }>;
  
  // The polling question displayed to users
  const POLL_QUESTION = "PUT A BETTER QUESTION HERE?" as const;
  
  // Storage for votes using a StableBTreeMap
  const voteStorage = new StableBTreeMap<string, Vote>(0, 44, 512);
  
  /**
   * Retrieves the polling question.
   * @returns A Result object containing the polling question string.
   */
  export function getPollingQuestion(): Result<string, string> {
    return Result.Ok<string, string>(POLL_QUESTION);
  }
  
  /**
   * Checks if a user has already voted.
   * @param user - The Principal representing the user.
   * @returns True if the user has already voted, false otherwise.
   */
  function checkIfUserHasAlreadyVoted(user: Principal): boolean {
    const values = voteStorage.values();
    return !!values.find((vote) => vote.user.toString() === user.toString());
  }
  
  $update
  /**
   * Creates a new vote.
   * @param arg - The CreateVote argument containing the vote details.
   * @returns A Result object containing the created Vote or an error message.
   */
  export function createVote(arg: CreateVote): Result<Vote | string, string> {
    if (!arg.value || typeof arg.value !== "boolean") {
      return Result.Err<string, string>("Invalid vote value");
    }
  
    if (checkIfUserHasAlreadyVoted(ic.caller())) {
      return Result.Err<string, string>("You have already voted");
    }
  
    const vote: Vote = {
      poll_question: POLL_QUESTION,
      id: uuidv4(),
      created_at: ic.time(),
      value: arg.value,
      comments: arg?.comments ? arg.comments : Opt.None,
      user: ic.caller(),
    };
  
    voteStorage.insert(vote.id, vote);
  
    return Result.Ok<Vote, string>(vote);
  }
  
  $query
  /**
   * Retrieves all the votes.
   * @returns A Result object containing an array of all the votes or an error message.
   */
  export function getAllTheVotes(): Result<Vec<Vote>, string> {
    return Result.Ok<Vec<Vote>, string>(voteStorage.values());
  }
  
  $query
  /**
   * Retrieves summarised vote statistics.
   * @returns A Result object containing the summarised vote statistics or an error message.
   */
  export function getSummarisedVotes(): Result<SummarisedVoteStatistics, string> {
    const values = voteStorage.values();
  
    const summary: SummarisedVoteStatistics = {
      poll_question: POLL_QUESTION,
      yes: values.filter((vote) => vote.value === true).length,
      no: values.filter((vote) => vote.value === false).length,
    };
  
    return Result.Ok<SummarisedVoteStatistics, string>(summary);
  }
  
  $update
  /**
   * Deletes a user's vote.
  //  * @returns A Result object indicating the success or failure of vote deletion.
   */
  export function deleteAUsersVote(): Result<string, string> {
    const values = voteStorage.values();
  
    const voteToDelete = values.find(
      (vote) => vote.user.toString() === ic.caller().toString()
    );
  
    if (!voteToDelete) {
      return Result.Err<string, string>("You have not voted");
    }
  
    voteStorage.remove(voteToDelete.id);
  
    return Result.Ok<string, string>("We have removed your vote");
  }
  
  // UUID workaround
  globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
      let array = new Uint8Array(32);
  
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
  
      return array;
    },
  };