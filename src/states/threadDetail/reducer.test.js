import { describe, expect, it } from 'vitest';
import threadDetailReducer from './reducer';
import { ActionType } from './action';

const initThreadDetailState = () => ({
  id: 'thread-1',
  title: 'Thread Pertama',
  body: 'Ini adalah thread pertama',
  category: 'General',
  createdAt: '2021-06-21T07:00:00.000Z',
  owner: {
    id: 'users-1',
    name: 'John Doe',
    avatar: 'https://generated-image-url.jpg',
  },
  upVotesBy: [],
  downVotesBy: [],
  comments: [
    {
      id: 'comment-1',
      content: 'Ini adalah komentar pertama',
      createdAt: '2021-06-21T07:00:00.000Z',
      owner: {
        id: 'users-1',
        name: 'John Doe',
        avatar: 'https://generated-image-url.jpg',
      },
      upVotesBy: [],
      downVotesBy: [],
    },
  ],
});

describe('threadDetailReducer function', () => {
  it('should return the initial state when given by unknown action', () => {
    // arrange
    const initialState = null;
    const action = { type: 'UNKNOWN' };

    // action
    const nextState = threadDetailReducer(initialState, action);

    // assert
    expect(nextState).toEqual(initialState);
  });

  it('should return the thread detail state when given by RECEIVE_THREAD_DETAIL action', () => {
    // arrange
    const initialState = null;
    const action = {
      type: ActionType.RECEIVE_THREAD_DETAIL,
      payload: {
        threadDetail: initThreadDetailState(),
      },
    };

    // assert
    const nextState = threadDetailReducer(initialState, action);

    // action
    expect(nextState).toEqual(action.payload.threadDetail);
  });

  it('should return the thread detail with the new comment when given by ADD_COMMENT_THREAD action', () => {
    // arrange
    const initialState = initThreadDetailState();
    const action = {
      type: ActionType.ADD_COMMENT_THREAD,
      payload: {
        comment: {
          id: 'comment-2',
          content: 'Ini adalah komentar kedua',
          createdAt: '2026-06-17T07:00:00.000Z',
          upVotesBy: [],
          downVotesBy: [],
          owner: {
            id: 'users-2',
            name: 'Asep',
            email: 'asep@example.com',
          },
        },
      },
    };

    // action
    const nextState = threadDetailReducer(initialState, action);

    // assert
    expect(nextState).toEqual({
      ...initialState,
      comments: [action.payload.comment, ...initialState.comments],
    });
  });

  it('should return the thread detail with applied vote on thread when given by APPLY_VOTE_THREAD_DETAIL action', () => {
    // arrange
    const initialState = initThreadDetailState();
    const actionUpVote = {
      type: ActionType.APPLY_VOTE_THREAD_DETAIL,
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
    const stateAfterUpVote = threadDetailReducer(initialState, actionUpVote);

    // assert
    expect(stateAfterUpVote).toEqual({
      ...initialState,
      upVotesBy: [actionUpVote.payload.vote.userId],
      downVotesBy: [],
    });

    // arrange
    const actionDownVote = {
      type: ActionType.APPLY_VOTE_THREAD_DETAIL,
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
    const stateAfterDownVote = threadDetailReducer(stateAfterUpVote, actionDownVote);

    // assert
    expect(stateAfterDownVote).toEqual({
      ...stateAfterUpVote,
      upVotesBy: [],
      downVotesBy: [actionDownVote.payload.vote.userId],
    });

    // assert
    const actionNeutralVote = {
      type: ActionType.APPLY_VOTE_THREAD_DETAIL,
      payload: {
        vote: {
          id: 'vote-1',
          userId: 'users-1',
          threadId: 'thread-1',
          voteType: 0,
        },
      },
    };

    // action: neutral vote thread
    const stateAfterNeutralVote = threadDetailReducer(stateAfterDownVote, actionNeutralVote);

    // assert
    expect(stateAfterNeutralVote).toEqual({
      ...stateAfterDownVote,
      upVotesBy: [],
      downVotesBy: [],
    });
  });

  it('should return the thread detail with applied vote on thread comment when given by APPLY_VOTE_COMMENT', () => {
    // arrange
    const initialState = initThreadDetailState();
    const actionUpVote = {
      type: ActionType.APPLY_VOTE_COMMENT,
      payload: {
        vote: {
          id: 'vote-1',
          userId: 'users-1',
          commentId: 'comment-1',
          voteType: 1,
        },
      },
    };

    // action: up vote comment
    const stateAfterUpVote = threadDetailReducer(initialState, actionUpVote);

    // assert
    expect(stateAfterUpVote).toEqual({
      ...initialState,
      comments: initialState.comments.map((comment) => {
        if (comment.id === actionUpVote.payload.vote.commentId) {
          return {
            ...comment,
            upVotesBy: [actionUpVote.payload.vote.userId],
            downVotesBy: [],
          };
        }
        return comment;
      }),
    });

    // arrange
    const actionDownVote = {
      type: ActionType.APPLY_VOTE_COMMENT,
      payload: {
        vote: {
          id: 'vote-1',
          userId: 'users-1',
          commentId: 'comment-1',
          voteType: -1,
        },
      },
    };

    // action: down vote comment
    const stateAfterDownVote = threadDetailReducer(stateAfterUpVote, actionDownVote);

    // assert
    expect(stateAfterDownVote).toEqual({
      ...stateAfterUpVote,
      comments: stateAfterUpVote.comments.map((comment) => {
        if (comment.id === actionDownVote.payload.vote.commentId) {
          return {
            ...comment,
            upVotesBy: [],
            downVotesBy: [actionDownVote.payload.vote.userId],
          };
        }
        return comment;
      }),
    });

    // arrange
    const actionNeutralVote = {
      type: ActionType.APPLY_VOTE_COMMENT,
      payload: {
        vote: {
          id: 'vote-1',
          userId: 'users-1',
          commentId: 'comment-1',
          voteType: 0,
        },
      },
    };

    // action: neutral vote comment
    const stateAfterNeutralVote = threadDetailReducer(stateAfterDownVote, actionNeutralVote);

    // assert
    expect(stateAfterNeutralVote).toEqual({
      ...stateAfterDownVote,
      comments: stateAfterDownVote.comments.map((comment) => {
        if (comment.id === actionNeutralVote.payload.vote.commentId) {
          return {
            ...comment,
            upVotesBy: [],
            downVotesBy: [],
          };
        }
        return comment;
      }),
    });
  });
});
