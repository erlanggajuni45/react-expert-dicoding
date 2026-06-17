import api from '../../api';
import { finishLoadingActionCreator, startLoadingActionCreator } from '../ui/action';

const ActionType = {
  SET_AUTH_USER: 'SET_AUTH_USER',
  UNSET_AUTH_USER: 'UNSET_AUTH_USER',
};

const setAuthUserActionCreator = (authUser) => ({
  type: ActionType.SET_AUTH_USER,
  payload: { authUser },
});

const unsetAuthUserActionCreator = () => ({
  type: ActionType.UNSET_AUTH_USER,
  payload: { authUser: null },
});

const asyncSetAuthUser = ({ email, password }) => {
  return async (dispatch) => {
    dispatch(startLoadingActionCreator());
    try {
      const accessToken = await api.login({ email, password });
      api.putAccessToken(accessToken);
      const authUser = await api.getOwnProfile();

      dispatch(setAuthUserActionCreator(authUser));
    } finally {
      dispatch(finishLoadingActionCreator());
    }
  };
};

const asyncUnsetAuthUser = () => {
  return async (dispatch) => {
    dispatch(startLoadingActionCreator());
    dispatch(unsetAuthUserActionCreator());
    api.putAccessToken('');
    dispatch(finishLoadingActionCreator());
  };
};

export {
  ActionType,
  setAuthUserActionCreator,
  unsetAuthUserActionCreator,
  asyncSetAuthUser,
  asyncUnsetAuthUser,
};
