import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './ui/reducer';
import usersReducer from './users/reducer';

const store = configureStore({
  reducer: {
    ui: uiReducer,
    users: usersReducer,
  },
});

export default store;
