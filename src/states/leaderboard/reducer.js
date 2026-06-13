import { ActionType } from './action';

const leaderboardsReducer = (leaderboards = [], action = {}) => {
  const { type, payload } = action;

  const actions = {
    [ActionType.RECEIVE_LEADERBOARD]: () => payload.leaderboards,
    DEFAULT: () => leaderboards,
  };

  return (actions[type] || actions.DEFAULT)();
};

export default leaderboardsReducer;
