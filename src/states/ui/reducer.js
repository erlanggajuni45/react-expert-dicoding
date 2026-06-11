import { ActionType } from './action';

const uiReducer = (loadingCount = 0, action = {}) => {
  const { type, payload } = action;

  const actions = {
    [ActionType.START_LOADING]: () => (loadingCount += 1),
    [ActionType.FINISH_LOADING]: () => Math.max(0, loadingCount - 1),
    DEFAULT: () => loadingCount,
  };

  return (actions[type] || actions.DEFAULT)();
};

export default uiReducer;
