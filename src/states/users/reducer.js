import { ActionType } from './action';

const usersReducer = (users = [], action = {}) => {
  const { type, payload } = action;

  const actions = {
    [ActionType.RECEIVE_USERS]: () => payload.users,
    DEFAULT: () => users,
  };

  return (actions[type] || actions.DEFAULT)();
};

export default usersReducer;
