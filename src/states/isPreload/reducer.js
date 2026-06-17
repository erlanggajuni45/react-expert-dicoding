import { ActionType } from './action';

const isPreloadReducer = (isPreload = true, action = {}) => {
  const { payload, type } = action;
  const actions = {
    [ActionType.SET_IS_PRELOAD]: () => payload.isPreload,
    DEFAULT: () => isPreload,
  };

  return (actions[type] || actions.DEFAULT)();
};

export default isPreloadReducer;
