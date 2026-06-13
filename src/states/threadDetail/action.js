import api from '../../api';
import { finishLoadingActionCreator, startLoadingActionCreator } from '../ui/action';

const ActionType = {
  RECEIVE_THREAD_DETAIL: 'RECEIVE_THREAD_DETAIL',
  ADD_COMMENT_THREAD: 'ADD_COMMENT_THREAD',
  APPLY_VOTE_THREAD_DETAIL: 'APPLY_VOTE_THREAD_DETAIL',
  APPLY_VOTE_COMMENT: 'APPLY_VOTE_COMMENT',
};

const receiveThreadDetailActionCreator = (threadDetail) => ({
  type: ActionType.RECEIVE_THREAD_DETAIL,
  payload: { threadDetail },
});

const addCommentThreadActionCreator = (comment) => ({
  type: ActionType.ADD_COMMENT_THREAD,
  payload: { comment },
});

const applyVoteThreadDetailActionCreator = (vote) => ({
  type: ActionType.APPLY_VOTE_THREAD_DETAIL,
  payload: { vote },
});

const applyVoteCommentActionCreator = (vote) => ({
  type: ActionType.APPLY_VOTE_COMMENT,
  payload: { vote },
});

const asyncGetThreadDetail = (threadId) => {
  return async (dispatch) => {
    dispatch(startLoadingActionCreator());
    try {
      const threadDetail = await api.getThreadDetail(threadId);
      dispatch(receiveThreadDetailActionCreator(threadDetail));
    } finally {
      dispatch(finishLoadingActionCreator());
    }
  };
};

const asyncAddCommentThread = ({ threadId, content }) => {
  return async (dispatch) => {
    dispatch(startLoadingActionCreator());
    try {
      const comment = await api.createComment({ threadId, content });
      dispatch(addCommentThreadActionCreator(comment));
    } finally {
      dispatch(finishLoadingActionCreator());
    }
  };
};

const asyncApplyVoteThreadDetail = ({ threadId, voteType }) => {
  return async (dispatch) => {
    dispatch(startLoadingActionCreator());
    try {
      const voteAction = {
        up: () => api.upvoteThread(threadId),
        down: () => api.downvoteThread(threadId),
        neutral: () => api.neutralizeThreadVote(threadId),
      }[voteType];

      if (!voteAction) throw new Error('Tipe vote tidak didukung');

      const vote = await voteAction();
      dispatch(applyVoteThreadDetailActionCreator(vote));
    } finally {
      dispatch(finishLoadingActionCreator());
    }
  };
};

const asyncApplyVoteComment = ({ threadId, commentId, voteType }) => {
  return async (dispatch) => {
    dispatch(startLoadingActionCreator());
    try {
      const voteAction = {
        up: () => api.upvoteComment({ threadId, commentId }),
        down: () => api.downvoteComment({ threadId, commentId }),
        neutral: () => api.neutralizeCommentVote({ threadId, commentId }),
      }[voteType];

      if (!voteAction) throw new Error('Tipe vote tidak didukung');

      const vote = await voteAction();
      dispatch(applyVoteCommentActionCreator(vote));
    } finally {
      dispatch(finishLoadingActionCreator());
    }
  };
};

export {
  ActionType,
  receiveThreadDetailActionCreator,
  asyncGetThreadDetail,
  asyncAddCommentThread,
  applyVoteThreadDetailActionCreator,
  asyncApplyVoteThreadDetail,
  applyVoteCommentActionCreator,
  asyncApplyVoteComment,
};
