import api from '../../utils/api';
import { receiveUsersActionCreator } from '../users/action';
import { receiveTalksActionCreator } from '../talks/action';

function asyncPopulateUsersAndTalks() {
  return async (dispatch) => {
    try {
      const users = await api.getAllUsers();
      const talks = await api.getAllTalks();

      dispatch(receiveUsersActionCreator(users));
      dispatch(receiveTalksActionCreator(talks));
    } catch (error) {
      alert(error.message);
    }
  };
}

export { asyncPopulateUsersAndTalks };
