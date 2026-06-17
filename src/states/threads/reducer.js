import { ActionType } from './action';

const threadsReducer = (threads = [], action = {}) => {
  const { type, payload } = action;

  const actions = {
    [ActionType.RECEIVE_THREADS]: () => payload.threads,
    [ActionType.ADD_THREAD]: () => [payload.thread, ...threads],
    [ActionType.APPLY_VOTE_THREAD]: () => {
      const { userId, threadId, voteType } = payload.vote;

      return threads.map((thread) => {
        if (thread.id === threadId) {
          const filteredUpVotes = thread.upVotesBy.filter((id) => id !== userId);
          const filteredDownVotes = thread.downVotesBy.filter((id) => id !== userId);

          return {
            ...thread,
            upVotesBy: voteType === 1 ? [...filteredUpVotes, userId] : filteredUpVotes,
            downVotesBy: voteType === -1 ? [...filteredDownVotes, userId] : filteredDownVotes,
          };
        }
        return thread;
      });
    },
    DEFAULT: () => threads,
  };

  return (actions[type] || actions.DEFAULT)();
};

export default threadsReducer;
