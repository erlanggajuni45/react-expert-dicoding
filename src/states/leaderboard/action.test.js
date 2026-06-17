import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../../api';
import { asyncGetLeaderboards, receiveLeaderboardsActionCreator } from './action';
import { finishLoadingActionCreator, startLoadingActionCreator } from '../ui/action';

const fakeLeaderboardResponse = [
  {
    user: {
      id: 'users-1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://generated-image-url.jpg',
    },
    score: 10,
  },
  {
    user: {
      id: 'users-2',
      name: 'Jane Doe',
      email: 'jane@example.com',
      avatar: 'https://generated-image-url.jpg',
    },
    score: 5,
  },
];

const fakeErrorResponse = new Error('Ups, something went wrong!');

describe('asyncGetLeaderboards thunk', () => {
  beforeEach(() => {
    api._getLeaderboards = api.getLeaderboards;
  });

  afterEach(() => {
    api.getLeaderboards = api._getLeaderboards;

    delete api._getLeaderboards;
  });

  it('should dispatch action correctly when data fetching success', async () => {
    // arrange
    api.getLeaderboards = () => Promise.resolve(fakeLeaderboardResponse);
    const dispatch = vi.fn();

    // action
    await asyncGetLeaderboards()(dispatch);

    // assert
    expect(dispatch).toHaveBeenNthCalledWith(1, startLoadingActionCreator());
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      receiveLeaderboardsActionCreator(fakeLeaderboardResponse),
    );
    expect(dispatch).toHaveBeenNthCalledWith(3, finishLoadingActionCreator());
  });

  it('should dispatch start and finish loading only when data fetching failed', async () => {
    // arrange
    api.getLeaderboards = () => Promise.reject(fakeErrorResponse);
    const dispatch = vi.fn();

    // action
    try {
      await asyncGetLeaderboards()(dispatch);
      expect.fail('Promise should have been rejected');
    } catch (error) {
      expect(error).toEqual(fakeErrorResponse);
      expect(dispatch).toHaveBeenNthCalledWith(1, startLoadingActionCreator());
      expect(dispatch).toHaveBeenNthCalledWith(2, finishLoadingActionCreator());
    }
  });
});
