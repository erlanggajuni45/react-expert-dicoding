import api from '../../api';
import { finishLoadingActionCreator, startLoadingActionCreator } from '../ui/action';

const ActionType = {
  RECEIVE_LEADERBOARD: 'RECEIVE_LEADERBOARD',
};

const receiveLeaderboardsActionCreator = (leaderboards) => ({
  type: ActionType.RECEIVE_LEADERBOARD,
  payload: { leaderboards },
});

const asyncGetLeaderboards = () => {
  return async (dispatch) => {
    dispatch(startLoadingActionCreator());
    try {
      const leaderboards = await api.getLeaderboards();
      dispatch(receiveLeaderboardsActionCreator(leaderboards));
    } finally {
      dispatch(finishLoadingActionCreator());
    }
  };
};

export { ActionType, receiveLeaderboardsActionCreator, asyncGetLeaderboards };
