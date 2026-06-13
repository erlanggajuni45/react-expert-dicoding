import { ActionType } from './action';

const threadDetailReducer = (threadDetail = null, action = {}) => {
  const { type, payload } = action;

  const actions = {
    [ActionType.RECEIVE_THREAD_DETAIL]: () => payload.threadDetail,
    [ActionType.ADD_COMMENT_THREAD]: () => ({
      ...threadDetail,
      comments: [payload.comment, ...threadDetail.comments],
    }),
    DEFAULT: () => threadDetail,
  };

  return (actions[type] || actions.DEFAULT)();
};

export default threadDetailReducer;
