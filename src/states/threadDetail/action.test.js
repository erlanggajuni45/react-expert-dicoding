import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../../api';
import { asyncGetThreadDetail, receiveThreadDetailActionCreator } from './action';
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
      expect(error).toEqual(fakeErrorResponse);
      expect(dispatch).toHaveBeenNthCalledWith(1, startLoadingActionCreator());
      expect(dispatch).toHaveBeenNthCalledWith(2, finishLoadingActionCreator());
    }
  });
});

// describe('asyncAddCommentThread thunk', () => {});

// describe('asyncApplyVoteThreadDetail thunk', () => {});

// describe('asyncApplyVoteComment thunk', () => {});
