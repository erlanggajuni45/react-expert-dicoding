import { ActionType } from './action';

const initialState = { loadingCount: 0 };

const uiReducer = (loadingCount = initialState.loadingCount, action = {}) => {
  const { type } = action;

  const actions = {
    [ActionType.START_LOADING]: () => (loadingCount += 1),
    [ActionType.FINISH_LOADING]: () => Math.max(0, loadingCount - 1),
    DEFAULT: () => loadingCount,
  };

  return (actions[type] || actions.DEFAULT)();
};

export default uiReducer;
