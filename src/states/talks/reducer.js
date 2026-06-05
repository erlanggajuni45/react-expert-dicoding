import { ActionType } from './action';

function talksReducer(talks = [], action = {}) {
  const { type, payload } = action;

  const actions = {
    [ActionType.RECEIVE_TALKS]: () => payload.talks,
    [ActionType.ADD_TALK]: () => [payload.talk, ...talks],
    [ActionType.TOGGLE_LIKE_TALK]: () =>
      talks.map((talk) => {
        if (talk.id === payload.talkId) {
          return {
            ...talk,
            likes: talk.likes.includes(payload.userId)
              ? talk.likes.filter((id) => id !== payload.userId)
              : talk.likes.concat([payload.userId]),
          };
        }
        return talk;
      }),
    DEFAULT: () => talks,
  };

  return (actions[type] || actions.DEFAULT)();
}

export default talksReducer;
