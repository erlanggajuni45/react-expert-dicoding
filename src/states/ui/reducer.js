import { ActionType } from './action';

const initialState = {
  loadingCount: 0,
};

const uiReducer = (state = initialState, action = {}) => {
  const { type, payload } = action;

  const actions = {
    [ActionType.START_LOADING]: () => (state.loadingCount += 1),
    [ActionType.FINISH_LOADING]: () => Math.max(0, state.loadingCount - 1),
    [ActionType.SET_LOADING]: () =>
      payload ? (state.loadingCount += 1) : Math.max(0, state.loadingCount - 1),
    DEFAULT: () => state,
  };

  return (actions[type] || actions.DEFAULT)();
};

export default uiReducer;
