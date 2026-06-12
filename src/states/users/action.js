import api from '../../api';
import { finishLoadingActionCreator, startLoadingActionCreator } from '../ui/action';

const ActionType = {
  RECEIVE_USERS: 'RECEIVE_USERS',
};

const receiveUsersActionCreator = (users) => ({
  type: ActionType.RECEIVE_USERS,
  payload: { users },
});

const asyncRegisterUser = ({ name, email, password }) => {
  return async (dispatch) => {
    dispatch(startLoadingActionCreator());

    try {
      await api.register({ name, email, password });
    } catch (err) {
      alert(err.message);
    } finally {
      dispatch(finishLoadingActionCreator());
    }
  };
};

const asyncGetAllUsers = () => {
  return async (dispatch) => {
    dispatch(startLoadingActionCreator());

    try {
      const users = await api.getAllUsers();
      dispatch(receiveUsersActionCreator(users));
    } catch (err) {
      alert(err.message);
      throw err;
    } finally {
      dispatch(finishLoadingActionCreator());
    }
  };
};

export { ActionType, receiveUsersActionCreator, asyncGetAllUsers, asyncRegisterUser };
