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
  return async (dispatch, getState) => {
    const { authUser } = getState();

    dispatch(
      applyVoteThreadDetailActionCreator({
        userId: authUser.id,
        threadId,
        voteType: voteType === 'up' ? 1 : voteType === 'down' ? -1 : 0,
      }),
    );

    try {
      const voteAction = {
        up: () => api.upvoteThread(threadId),
        down: () => api.downvoteThread(threadId),
        neutral: () => api.neutralizeThreadVote(threadId),
      }[voteType];

      if (!voteAction) throw new Error('Tipe vote tidak didukung');

      await voteAction();
    } catch (e) {
      dispatch(
        applyVoteThreadDetailActionCreator({
          userId: authUser.id,
          threadId,
          voteType: 0,
        }),
      );
      throw e;
    }
  };
};

const asyncApplyVoteComment = ({ threadId, commentId, voteType }) => {
  return async (dispatch, getState) => {
    const { authUser } = getState();

    dispatch(
      applyVoteCommentActionCreator({
        userId: authUser.id,
        commentId,
        voteType: voteType === 'up' ? 1 : voteType === 'down' ? -1 : 0,
      }),
    );

    try {
      const voteAction = {
        up: () => api.upvoteComment({ threadId, commentId }),
        down: () => api.downvoteComment({ threadId, commentId }),
        neutral: () => api.neutralizeCommentVote({ threadId, commentId }),
      }[voteType];

      if (!voteAction) throw new Error('Tipe vote tidak didukung');

      await voteAction();
    } catch (e) {
      dispatch(
        applyVoteCommentActionCreator({
          userId: authUser.id,
          commentId,
          voteType: 0,
        }),
      );
      throw e;
    }
  };
};

export {
  ActionType,
  receiveThreadDetailActionCreator,
  addCommentThreadActionCreator,
  asyncGetThreadDetail,
  asyncAddCommentThread,
  applyVoteThreadDetailActionCreator,
  asyncApplyVoteThreadDetail,
  applyVoteCommentActionCreator,
  asyncApplyVoteComment,
};
