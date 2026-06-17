import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../../api';
import {
  addCommentThreadActionCreator,
  asyncAddCommentThread,
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

// describe('asyncApplyVoteThreadDetail thunk', () => {});

// describe('asyncApplyVoteComment thunk', () => {});
