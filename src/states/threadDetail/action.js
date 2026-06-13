import api from '../../api';
import { finishLoadingActionCreator, startLoadingActionCreator } from '../ui/action';

const ActionType = {
  RECEIVE_THREAD_DETAIL: 'RECEIVE_THREAD_DETAIL',
  ADD_COMMENT_THREAD: 'ADD_COMMENT_THREAD',
};

const receiveThreadDetailActionCreator = (threadDetail) => ({
  type: ActionType.RECEIVE_THREAD_DETAIL,
  payload: { threadDetail },
});

const addCommentThreadActionCreator = (comment) => ({
  type: ActionType.ADD_COMMENT_THREAD,
  payload: { comment },
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

export {
  ActionType,
  receiveThreadDetailActionCreator,
  asyncGetThreadDetail,
  asyncAddCommentThread,
};
