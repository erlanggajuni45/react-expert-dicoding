import { ActionType } from './action';

const threadDetailReducer = (threadDetail = null, action = {}) => {
  const { type, payload } = action;

  const actions = {
    [ActionType.RECEIVE_THREAD_DETAIL]: () => payload.threadDetail,
    [ActionType.ADD_COMMENT_THREAD]: () => [payload.thread, ...threadDetail],
    DEFAULT: () => threadDetail,
  };

  return (actions[type] || actions.DEFAULT)();
};

export default threadDetailReducer;
