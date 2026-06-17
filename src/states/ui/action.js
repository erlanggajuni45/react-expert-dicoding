const ActionType = {
  START_LOADING: 'START_LOADING',
  FINISH_LOADING: 'FINISH_LOADING',
};

const startLoadingActionCreator = () => ({ type: ActionType.START_LOADING });
const finishLoadingActionCreator = () => ({ type: ActionType.FINISH_LOADING });

export { ActionType, startLoadingActionCreator, finishLoadingActionCreator };
