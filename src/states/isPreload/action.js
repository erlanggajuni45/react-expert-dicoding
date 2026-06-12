import api from '../../api';
import { setAuthUserActionCreator } from '../authUser/action';
import { finishLoadingActionCreator, startLoadingActionCreator } from '../ui/action';

const ActionType = {
  SET_IS_PRELOAD: 'SET_IS_PRELOAD',
};

const setIsPreloadActionCreator = (isPreload) => ({
  type: ActionType.SET_IS_PRELOAD,
  payload: { isPreload },
});

const asyncPreloadProcess = () => {
  return async (dispatch) => {
    dispatch(startLoadingActionCreator());

    try {
      const authUser = await api.getOwnProfile();
      dispatch(setAuthUserActionCreator(authUser));
    } catch (err) {
      alert(err.message);
      dispatch(setAuthUserActionCreator(null));
    } finally {
      dispatch(setIsPreloadActionCreator(false));
      dispatch(finishLoadingActionCreator());
    }
  };
};

export { ActionType, setIsPreloadActionCreator, asyncPreloadProcess };
