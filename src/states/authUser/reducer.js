import { ActionType } from './action';

function authUserReducer(authUser = null, action = {}) {
  const { type, payload } = action;
  const actions = {
    [ActionType.SET_AUTH_USER]: () => payload.authUser,
    [ActionType.UNSET_AUTH_USER]: () => null,
    DEFAULT: () => authUser,
  };

  return (actions[type] || actions.DEFAULT)();
}

export default authUserReducer;
