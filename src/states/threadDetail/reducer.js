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
    [ActionType.APPLY_VOTE_COMMENT]: () => {
      const { userId, commentId, voteType } = payload.vote;

      return threadDetail.comments.map((comment) => {
        if (comment.id === commentId) {
          const filteredUpVotes = comment.upVotesBy.filter((id) => id !== userId);
          const filteredDownVotes = comment.downVotesBy.filter((id) => id !== userId);

          return {
            ...comment,
            upVotesBy: voteType === 1 ? [...filteredUpVotes, userId] : filteredUpVotes,
            downVotesBy: voteType === -1 ? [...filteredDownVotes, userId] : filteredDownVotes,
          };
        }
        return comment;
      });
    },

    DEFAULT: () => threadDetail,
  };

  return (actions[type] || actions.DEFAULT)();
};

export default threadDetailReducer;
