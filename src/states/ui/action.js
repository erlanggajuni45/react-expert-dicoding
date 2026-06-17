const ActionType = {
  START_LOADING: 'START_LOADING',
  FINISH_LOADING: 'FINISH_LOADING',
  SET_LOADING: 'SET_LOADING',
};

const startLoadingActionCreator = () => ({ type: ActionType.START_LOADING });
const finishLoadingActionCreator = () => ({ type: ActionType.FINISH_LOADING });
const setLoadingActionCreator = (isLoading) => ({
  type: ActionType.SET_LOADING,
  payload: isLoading,
});

export {
  ActionType,
  startLoadingActionCreator,
  finishLoadingActionCreator,
  setLoadingActionCreator,
};
