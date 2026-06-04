import { ActionType } from './action';

function isPreloadReducer(isPreload = true, action = {}) {
  const { type, payload } = action;
  const actions = {
    [ActionType.SET_IS_PRELOAD]: () => payload.isPreload,
    DEFAULT: () => isPreload,
  };

  return (actions[type] || actions.DEFAULT)();
}

export default isPreloadReducer;
