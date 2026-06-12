import { ActionType } from './action';

const threadsReducer = (threads = [], action = {}) => {
  const { type, payload } = action;

  const actions = {
    [ActionType.RECEIVE_THREADS]: () => payload.threads,
    [ActionType.ADD_THREAD]: () => [payload.thread, ...threads],
    DEFAULT: () => threads,
  };

  return (actions[type] || actions.DEFAULT)();
};

export default threadsReducer;
