import { describe, expect, it } from 'vitest';
import threadsReducer from './reducer';
import { ActionType } from './action';

const initThreadState = () => [
  {
    id: 'thread-1',
    title: 'Thread Pertama',
    body: 'Ini adalah thread pertama',
    category: 'General',
    createdAt: '2021-06-21T07:00:00.000Z',
    ownerId: 'users-1',
    upVotesBy: [],
    downVotesBy: [],
    totalComments: 0,
  },
];

describe('threadsReducer function', () => {
  it('should return the initial state when given by unknown action', () => {
    // arrange
    const initialState = [];
    const action = {
      type: 'UNKNOWN',
    };

    // action
    const nextState = threadsReducer(initialState, action);

    // assert
    expect(nextState).toEqual(initialState);
  });

  it('should return the threads when given by RECEIVE_THREADS action', () => {
    // arrange
    const initialState = [];
    const action = { type: ActionType.RECEIVE_THREADS, payload: { threads: initThreadState() } };

    // action
    const nextState = threadsReducer(initialState, action);

    // assert
    expect(nextState).toEqual(action.payload.threads);
  });

  it('should return the threads with new thread when given by ADD_THREAD action', () => {
    // arrange
    const initialState = initThreadState();
    const action = {
      type: ActionType.ADD_THREAD,
      payload: {
        thread: {
          id: 'thread-2',
          title: 'Thread Kedua',
          body: 'Ini adalah thread kedua',
          category: 'General',
          createdAt: '2021-06-21T07:00:00.000Z',
          ownerId: 'users-2',
          upVotesBy: [],
          downVotesBy: [],
          totalComments: 0,
        },
      },
    };

    // action
    const nextState = threadsReducer(initialState, action);

    // assert
    expect(nextState).toEqual([action.payload.thread, ...initialState]);
  });

  it('should return the threads with applied vote when given by APPLY_VOTE_THREAD action', () => {
    // arrange
    const initialState = initThreadState();
    const actionUpVote = {
      type: ActionType.APPLY_VOTE_THREAD,
      payload: {
        vote: {
          id: 'vote-1',
          userId: 'users-1',
          threadId: 'thread-1',
          voteType: 1,
        },
      },
    };

    // action: up vote thread
    const stateAfterUpVote = threadsReducer(initialState, actionUpVote);

    // assert
    expect(stateAfterUpVote).toEqual(
      initialState.map((thread) => {
        if (thread.id === actionUpVote.payload.vote.threadId) {
          return { ...thread, upVotesBy: [actionUpVote.payload.vote.userId], downVotesBy: [] };
        }
        return thread;
      }),
    );

    // arrange
    const actionDownVote = {
      type: ActionType.APPLY_VOTE_THREAD,
      payload: {
        vote: {
          id: 'vote-1',
          userId: 'users-1',
          threadId: 'thread-1',
          voteType: -1,
        },
      },
    };

    // action: down vote thread
    const stateAfterDownVote = threadsReducer(stateAfterUpVote, actionDownVote);

    // assert
    expect(stateAfterDownVote).toEqual(
      stateAfterUpVote.map((thread) => {
        if (thread.id === actionDownVote.payload.vote.threadId) {
          return { ...thread, upVotesBy: [], downVotesBy: [actionDownVote.payload.vote.userId] };
        }
        return thread;
      }),
    );

    // arrange
    const actionNeutralVote = {
      type: ActionType.APPLY_VOTE_THREAD,
      payload: {
        vote: {
          id: 'vote-1',
          userId: 'users-1',
          threadId: 'thread-1',
          voteType: 0,
        },
      },
    };

    // action: neutral vote
    const stateAfterNeutralVote = threadsReducer(stateAfterDownVote, actionNeutralVote);

    // assert
    expect(stateAfterNeutralVote).toEqual(
      stateAfterDownVote.map((thread) => {
        if ((thread.id = actionNeutralVote.payload.vote.threadId)) {
          return { ...thread, upVotesBy: [], downVotesBy: [] };
        }
        return thread;
      }),
    );
  });
});
