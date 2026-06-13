import api from '../../api';
import { finishLoadingActionCreator, startLoadingActionCreator } from '../ui/action';

const ActionType = {
  RECEIVE_THREADS: 'RECEIVE_THREADS',
  ADD_THREAD: 'ADD_THREAD',
};

const receiveThreadsActionCreator = (threads) => ({
  type: ActionType.RECEIVE_THREADS,
  payload: { threads },
});

const addThreadActionCreator = (thread) => ({ type: ActionType.ADD_THREAD, payload: { thread } });

const asyncGetThreads = () => {
  return async (dispatch) => {
    dispatch(startLoadingActionCreator());
    try {
      const threads = await api.getAllThreads();
      dispatch(receiveThreadsActionCreator(threads));
    } catch (err) {
      alert(err.message);
      throw err;
    } finally {
      dispatch(finishLoadingActionCreator());
    }
  };
};

const asyncAddThread = ({ title, body, category }) => {
  return async (dispatch) => {
    dispatch(startLoadingActionCreator());
    try {
      const thread = await api.createThread({ title, body, category });
      dispatch(addThreadActionCreator(thread));
    } finally {
      dispatch(finishLoadingActionCreator());
    }
  };
};

export {
  ActionType,
  receiveThreadsActionCreator,
  addThreadActionCreator,
  asyncAddThread,
  asyncGetThreads,
};
