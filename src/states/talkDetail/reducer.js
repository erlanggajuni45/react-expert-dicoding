import { ActionType } from './action';

function talkDetailReducer(talkDetail = null, action = {}) {
  const { payload, type } = action;

  const actions = {
    [ActionType.RECEIVE_TALK_DETAIL]: () => payload.talkDetail,
    [ActionType.CLEAR_TALK_DETAIL]: () => null,
    [ActionType.TOGGLE_LIKE_TALK_DETAIL]: () => ({
      ...talkDetail,
      likes: talkDetail.likes.includes(payload.userId)
        ? talkDetail.likes.filter((id) => id !== payload.userId)
        : talkDetail.likes.concat([payload.userId]),
    }),
    DEFAULT: () => talkDetail,
  };

  return (actions[type] || actions.DEFAULT)();
}

export default talkDetailReducer;
