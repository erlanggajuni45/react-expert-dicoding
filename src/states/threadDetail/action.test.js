import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../../api';
import {
  addCommentThreadActionCreator,
  applyVoteCommentActionCreator,
  applyVoteThreadDetailActionCreator,
  asyncAddCommentThread,
  asyncApplyVoteComment,
  asyncApplyVoteThreadDetail,
  asyncGetThreadDetail,
  receiveThreadDetailActionCreator,
} from './action';
import { finishLoadingActionCreator, startLoadingActionCreator } from '../ui/action';

const fakeThreadDetailResponse = {
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
};

const fakeCreateCommentResponse = {
  id: 'comment-1',
  content: 'Ini adalah komentar pertama',
  createdAt: '2021-06-21T07:00:00.000Z',
  upVotesBy: [],
  downVotesBy: [],
  owner: {
    id: 'users-1',
    name: 'John Doe',
    email: 'john@example.com',
  },
};

const fakeUpVoteThreadResponse = {
  id: 'vote-1',
  userId: 'users-1',
  threadId: 'thread-1',
  voteType: 1,
};

const fakeDownVoteThreadResponse = {
  id: 'vote-1',
  userId: 'users-1',
  threadId: 'thread-1',
  voteType: -1,
};

const fakeNeutralizeVoteThreadResponse = {
  id: 'vote-1',
  userId: 'users-1',
  threadId: 'thread-1',
  voteType: -1,
};

const fakeUpVoteCommentResponse = {
  id: 'vote-1',
  userId: 'users-1',
  commentId: 'comment-1',
  voteType: 1,
};

const fakeDownVoteCommentResponse = {
  id: 'vote-1',
  userId: 'users-1',
  commentId: 'comment-1',
  voteType: -1,
};

const fakeNeutralizeVoteCommentResponse = {
  id: 'vote-1',
  userId: 'users-1',
  commentId: 'comment-1',
  voteType: 0,
};

const fakeAuthUser = {
  id: 'users-1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://generated-image-url.jpg',
};

const fakeErrorResponse = new Error('Ups, something went wrong!');

describe('asyncGetThreadDetail thunk', () => {
  beforeEach(() => {
    api._getThreadDetail = api.getThreadDetail;
  });

  afterEach(() => {
    api.getThreadDetail = api._getThreadDetail;

    delete api._getThreadDetail;
  });

  it('should dispatch action correctly when data fetching success', async () => {
    // arrange
    api.getThreadDetail = () => Promise.resolve(fakeThreadDetailResponse);
    const dispatch = vi.fn();

    // action
    await asyncGetThreadDetail('thread-1')(dispatch);

    // assert
    expect(dispatch).toHaveBeenNthCalledWith(1, startLoadingActionCreator());
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      receiveThreadDetailActionCreator(fakeThreadDetailResponse),
    );
    expect(dispatch).toHaveBeenNthCalledWith(3, finishLoadingActionCreator());
  });

  it('should dispatch startLoading, throw an error, and finishLoading when get thread detail failed', async () => {
    // arrange
    api.getThreadDetail = () => Promise.reject(fakeErrorResponse);
    const dispatch = vi.fn();

    // action
    try {
      await asyncGetThreadDetail('thread-1')(dispatch);
      expect.fail('Promise should have been rejected');
    } catch (error) {
      // assert
      expect(error).toEqual(fakeErrorResponse);
      expect(dispatch).toHaveBeenNthCalledWith(1, startLoadingActionCreator());
      expect(dispatch).toHaveBeenNthCalledWith(2, finishLoadingActionCreator());
    }
  });
});

describe('asyncAddCommentThread thunk', () => {
  beforeEach(() => {
    api._createComment = api.createComment;
  });

  afterEach(() => {
    api.createComment = api._createComment;

    delete api._createComment;
  });

  it('should dispatch action correctly when adding comment success', async () => {
    // arrange
    api.createComment = () => Promise.resolve(fakeCreateCommentResponse);
    const dispatch = vi.fn();

    // action
    await asyncAddCommentThread({ threadId: 'thread-1', content: 'tes content' })(dispatch);

    // assert
    expect(dispatch).toHaveBeenNthCalledWith(1, startLoadingActionCreator());
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      addCommentThreadActionCreator(fakeCreateCommentResponse),
    );
    expect(dispatch).toHaveBeenNthCalledWith(3, finishLoadingActionCreator());
  });

  it('should dispatch start and finish loading only when failed to add new comment', async () => {
    // arrange
    api.createComment = () => Promise.reject(fakeErrorResponse);
    const dispatch = vi.fn();

    // action
    try {
      await asyncAddCommentThread({ threadId: 'thread-1', content: 'tes content' })(dispatch);
      expect.fail('Promise should have been rejected');
    } catch (error) {
      // assert
      expect(error).toEqual(fakeErrorResponse);
      expect(dispatch).toHaveBeenNthCalledWith(1, startLoadingActionCreator());
      expect(dispatch).toHaveBeenNthCalledWith(2, finishLoadingActionCreator());
    }
  });
});

describe('asyncApplyVoteThreadDetail thunk', () => {
  beforeEach(() => {
    api._upvoteThread = api.upvoteThread;
    api._downvoteThread = api.downvoteThread;
    api._neutralizeThreadVote = api.neutralizeThreadVote;
  });

  afterEach(() => {
    api.upvoteThread = api._upvoteThread;
    api.downvoteThread = api._downvoteThread;
    api.neutralizeThreadVote = api._neutralizeThreadVote;

    delete api._upvoteThread;
    delete api._downvoteThread;
    delete api._neutralizeThreadVote;
  });

  it('should dispatch action correctly when up vote success', async () => {
    // arrange
    api.upvoteThread = () => Promise.resolve(fakeUpVoteThreadResponse);
    const getState = () => ({ authUser: fakeAuthUser });
    const dispatch = vi.fn();

    // action: up vote thread
    await asyncApplyVoteThreadDetail({ threadId: 'thread-1', voteType: 'up' })(dispatch, getState);

    // assert
    expect(dispatch).toHaveBeenCalledWith(
      applyVoteThreadDetailActionCreator({
        userId: fakeAuthUser.id,
        threadId: 'thread-1',
        voteType: 1,
      }),
    );
  });

  it('should dispatch action correctly when down vote success', async () => {
    // arrange
    api.downvoteThread = () => Promise.resolve(fakeDownVoteThreadResponse);
    const getState = () => ({ authUser: fakeAuthUser });
    const dispatch = vi.fn();

    // action: down vote thread
    await asyncApplyVoteThreadDetail({ threadId: 'thread-1', voteType: 'down' })(
      dispatch,
      getState,
    );

    // assert
    expect(dispatch).toHaveBeenCalledWith(
      applyVoteThreadDetailActionCreator({
        userId: fakeAuthUser.id,
        threadId: 'thread-1',
        voteType: -1,
      }),
    );
  });

  it('should dispatch action correctly when neutralize vote success', async () => {
    // arrange
    api.neutralizeThreadVote = () => Promise.resolve(fakeNeutralizeVoteThreadResponse);
    const getState = () => ({ authUser: fakeAuthUser });
    const dispatch = vi.fn();

    // action: neutralize vote thread
    await asyncApplyVoteThreadDetail({ threadId: 'thread-1', voteType: 'neutral' })(
      dispatch,
      getState,
    );

    // assert
    expect(dispatch).toHaveBeenCalledWith(
      applyVoteThreadDetailActionCreator({
        userId: fakeAuthUser.id,
        threadId: 'thread-1',
        voteType: 0,
      }),
    );
  });

  it('should throw an error if invalid vote type is given and cancel the vote change', async () => {
    // arrange
    const getState = () => ({ authUser: fakeAuthUser });
    const dispatch = vi.fn();

    // action
    try {
      await asyncApplyVoteThreadDetail({ threadId: 'thread-1', voteType: 'xxxxxx' })(
        dispatch,
        getState,
      );
      expect.fail('Promise should have been rejected');
    } catch (error) {
      expect(error).toEqual(new Error('Tipe vote tidak didukung'));
      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        applyVoteThreadDetailActionCreator({
          userId: 'users-1',
          threadId: 'thread-1',
          voteType: 0,
        }),
      );
      expect(dispatch).toHaveBeenNthCalledWith(
        2,
        applyVoteThreadDetailActionCreator({
          userId: 'users-1',
          threadId: 'thread-1',
          voteType: 0,
        }),
      );
    }
  });

  it('should dispatch apply and unapply vote when up vote failed', async () => {
    // arrange
    api.upvoteThread = () => Promise.reject(fakeErrorResponse);
    const getState = () => ({ authUser: fakeAuthUser });
    const dispatch = vi.fn();

    // action: up vote thread
    try {
      await asyncApplyVoteThreadDetail({ threadId: 'thread-1', voteType: 'up' })(
        dispatch,
        getState,
      );
      expect.fail('Promise should have been rejected');
    } catch (error) {
      // assert
      expect(error).toEqual(fakeErrorResponse);
      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        applyVoteThreadDetailActionCreator({
          userId: fakeAuthUser.id,
          threadId: 'thread-1',
          voteType: 1,
        }),
      );
      expect(dispatch).toHaveBeenNthCalledWith(
        2,
        applyVoteThreadDetailActionCreator({
          userId: fakeAuthUser.id,
          threadId: 'thread-1',
          voteType: 0,
        }),
      );
    }
  });

  it('should dispatch apply and unapply vote when down vote failed', async () => {
    // arrange
    api.downvoteThread = () => Promise.reject(fakeErrorResponse);
    const getState = () => ({ authUser: fakeAuthUser });
    const dispatch = vi.fn();

    // action: down vote thread
    try {
      await asyncApplyVoteThreadDetail({ threadId: 'thread-1', voteType: 'down' })(
        dispatch,
        getState,
      );
      expect.fail('Promise should have been rejected');
    } catch (error) {
      // assert
      expect(error).toEqual(fakeErrorResponse);
      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        applyVoteThreadDetailActionCreator({
          userId: fakeAuthUser.id,
          threadId: 'thread-1',
          voteType: -1,
        }),
      );
      expect(dispatch).toHaveBeenNthCalledWith(
        2,
        applyVoteThreadDetailActionCreator({
          userId: fakeAuthUser.id,
          threadId: 'thread-1',
          voteType: 0,
        }),
      );
    }
  });

  it('should dispatch apply and unapply vote when neutralize vote failed', async () => {
    // arrange
    api.neutralizeThreadVote = () => Promise.reject(fakeErrorResponse);
    const getState = () => ({ authUser: fakeAuthUser });
    const dispatch = vi.fn();

    // action: neutralize vote thread
    try {
      await asyncApplyVoteThreadDetail({ threadId: 'thread-1', voteType: 'neutral' })(
        dispatch,
        getState,
      );
      expect.fail('Promise should have been rejected');
    } catch (error) {
      // assert
      expect(error).toEqual(fakeErrorResponse);
      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        applyVoteThreadDetailActionCreator({
          userId: fakeAuthUser.id,
          threadId: 'thread-1',
          voteType: 0,
        }),
      );
      expect(dispatch).toHaveBeenNthCalledWith(
        2,
        applyVoteThreadDetailActionCreator({
          userId: fakeAuthUser.id,
          threadId: 'thread-1',
          voteType: 0,
        }),
      );
    }
  });
});

describe('asyncApplyVoteComment thunk', () => {
  beforeEach(() => {
    api._upvoteComment = api.upvoteComment;
    api._downvoteComment = api.downvoteComment;
    api._neutralizeCommentVote = api.neutralizeCommentVote;
  });

  afterEach(() => {
    api.upvoteComment = api._upvoteComment;
    api.downvoteComment = api._downvoteComment;
    api.neutralizeCommentVote = api._neutralizeCommentVote;

    delete api._upvoteComment;
    delete api._downvoteComment;
    delete api._neutralizeCommentVote;
  });

  it('should dispatch action correctly when up vote success', async () => {
    // arrange
    api.upvoteComment = () => Promise.resolve(fakeUpVoteCommentResponse);
    const getState = () => ({ authUser: fakeAuthUser });
    const dispatch = vi.fn();

    // action: up vote thread
    await asyncApplyVoteComment({ threadId: 'thread-1', commentId: 'comment-1', voteType: 'up' })(
      dispatch,
      getState,
    );

    // assert
    expect(dispatch).toHaveBeenCalledWith(
      applyVoteCommentActionCreator({
        userId: fakeAuthUser.id,
        commentId: 'comment-1',
        voteType: 1,
      }),
    );
  });

  it('should dispatch action correctly when down vote success', async () => {
    // arrange
    api.downvoteComment = () => Promise.resolve(fakeDownVoteCommentResponse);
    const getState = () => ({ authUser: fakeAuthUser });
    const dispatch = vi.fn();

    // action: down vote thread
    await asyncApplyVoteComment({ threadId: 'thread-1', commentId: 'comment-1', voteType: 'down' })(
      dispatch,
      getState,
    );

    // assert
    expect(dispatch).toHaveBeenCalledWith(
      applyVoteCommentActionCreator({
        userId: fakeAuthUser.id,
        commentId: 'comment-1',
        voteType: -1,
      }),
    );
  });

  it('should dispatch action correctly when neutralize vote success', async () => {
    // arrange
    api.neutralizeCommentVote = () => Promise.resolve(fakeNeutralizeVoteCommentResponse);
    const getState = () => ({ authUser: fakeAuthUser });
    const dispatch = vi.fn();

    // action: neutralize vote thread
    await asyncApplyVoteComment({
      threadId: 'thread-1',
      commentId: 'comment-1',
      voteType: 'neutral',
    })(dispatch, getState);

    // assert
    expect(dispatch).toHaveBeenCalledWith(
      applyVoteCommentActionCreator({
        userId: fakeAuthUser.id,
        commentId: 'comment-1',
        voteType: 0,
      }),
    );
  });

  it('should throw an error if invalid vote type is given and cancel the vote change', async () => {
    // arrange
    const getState = () => ({ authUser: fakeAuthUser });
    const dispatch = vi.fn();

    // action
    try {
      await asyncApplyVoteComment({
        threadId: 'thread-1',
        commentId: 'comment-1',
        voteType: 'xxxxxx',
      })(dispatch, getState);
      expect.fail('Promise should have been rejected');
    } catch (error) {
      expect(error).toEqual(new Error('Tipe vote tidak didukung'));
      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        applyVoteCommentActionCreator({
          userId: 'users-1',
          commentId: 'comment-1',
          voteType: 0,
        }),
      );
      expect(dispatch).toHaveBeenNthCalledWith(
        2,
        applyVoteCommentActionCreator({
          userId: 'users-1',
          commentId: 'comment-1',
          voteType: 0,
        }),
      );
    }
  });

  it('should dispatch apply and unapply vote when up vote failed', async () => {
    // arrange
    api.upvoteComment = () => Promise.reject(fakeErrorResponse);
    const getState = () => ({ authUser: fakeAuthUser });
    const dispatch = vi.fn();

    // action: up vote thread
    try {
      await asyncApplyVoteComment({
        threadId: 'thread-1',
        commentId: 'comment-1',
        voteType: 'up',
      })(dispatch, getState);
      expect.fail('Promise should have been rejected');
    } catch (error) {
      // assert
      expect(error).toEqual(fakeErrorResponse);
      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        applyVoteCommentActionCreator({
          userId: fakeAuthUser.id,
          commentId: 'comment-1',
          voteType: 1,
        }),
      );
      expect(dispatch).toHaveBeenNthCalledWith(
        2,
        applyVoteCommentActionCreator({
          userId: fakeAuthUser.id,
          commentId: 'comment-1',
          voteType: 0,
        }),
      );
    }
  });

  it('should dispatch apply and unapply vote when down vote failed', async () => {
    // arrange
    api.downvoteComment = () => Promise.reject(fakeErrorResponse);
    const getState = () => ({ authUser: fakeAuthUser });
    const dispatch = vi.fn();

    // action: down vote thread
    try {
      await asyncApplyVoteComment({
        threadId: 'thread-1',
        commentId: 'comment-1',
        voteType: 'down',
      })(dispatch, getState);
      expect.fail('Promise should have been rejected');
    } catch (error) {
      // assert
      expect(error).toEqual(fakeErrorResponse);
      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        applyVoteCommentActionCreator({
          userId: fakeAuthUser.id,
          commentId: 'comment-1',
          voteType: -1,
        }),
      );
      expect(dispatch).toHaveBeenNthCalledWith(
        2,
        applyVoteCommentActionCreator({
          userId: fakeAuthUser.id,
          commentId: 'comment-1',
          voteType: 0,
        }),
      );
    }
  });

  it('should dispatch apply and unapply vote when neutralize vote failed', async () => {
    // arrange
    api.neutralizeCommentVote = () => Promise.reject(fakeErrorResponse);
    const getState = () => ({ authUser: fakeAuthUser });
    const dispatch = vi.fn();

    // action: neutralize vote thread
    try {
      await asyncApplyVoteComment({
        threadId: 'thread-1',
        commentId: 'comment-1',
        voteType: 'neutral',
      })(dispatch, getState);
      expect.fail('Promise should have been rejected');
    } catch (error) {
      // assert
      expect(error).toEqual(fakeErrorResponse);
      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        applyVoteCommentActionCreator({
          userId: fakeAuthUser.id,
          commentId: 'comment-1',
          voteType: 0,
        }),
      );
      expect(dispatch).toHaveBeenNthCalledWith(
        2,
        applyVoteCommentActionCreator({
          userId: fakeAuthUser.id,
          commentId: 'comment-1',
          voteType: 0,
        }),
      );
    }
  });
});
