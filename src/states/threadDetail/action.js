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

const addCommentThreadActionCreator = (thread) => ({
  type: ActionType.RECEIVE_THREAD_DETAIL,
  payload: { thread },
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

const asyncAddCommentThread = ({ content }) => {
  return async (dispatch) => {
    dispatch(startLoadingActionCreator());
    try {
      const thread = await api.createComment({ content });
      dispatch(addCommentThreadActionCreator(thread));
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
