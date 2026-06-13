import { ActionType } from './action';

const threadDetailReducer = (threadDetail = null, action = {}) => {
  const { type, payload } = action;

  const actions = {
    [ActionType.RECEIVE_THREAD_DETAIL]: () => payload.threadDetail,
    [ActionType.ADD_COMMENT_THREAD]: () => ({
      ...threadDetail,
      comments: [payload.comment, ...threadDetail.comments],
    }),
    [ActionType.APPLY_VOTE_THREAD_DETAIL]: () => {
      const { userId, voteType } = payload.vote;

      if (!threadDetail) return threadDetail;

      const thread = threadDetail;
      const filteredUpVotes = thread.upVotesBy.filter((id) => id !== userId);
      const filteredDownVotes = thread.downVotesBy.filter((id) => id !== userId);

      return {
        ...thread,
        upVotesBy: voteType === 1 ? [...filteredUpVotes, userId] : filteredUpVotes,
        downVotesBy: voteType === -1 ? [...filteredDownVotes, userId] : filteredDownVotes,
      };
    },
    DEFAULT: () => threadDetail,
  };

  return (actions[type] || actions.DEFAULT)();
};

export default threadDetailReducer;
