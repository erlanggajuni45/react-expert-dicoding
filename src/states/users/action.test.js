import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../../api';
import { asyncGetAllUsers, asyncRegisterUser, receiveUsersActionCreator } from './action';
import { finishLoadingActionCreator, startLoadingActionCreator } from '../ui/action';

const fakeErrorResponse = new Error('Ups, something went wrong!');

describe('asyncRegisterUser thunk', () => {
  beforeEach(() => {
    api._register = api.register;
  });

  afterEach(() => {
    api.register = api._register;

    delete api._register;
  });

  it('should dispatch action correctly when register is success', async () => {
    // arrange
    api.register = () => Promise.resolve();
    const dispatch = vi.fn();

    // action
    await asyncRegisterUser({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })(dispatch);

    // assert
    expect(dispatch).toHaveBeenNthCalledWith(1, startLoadingActionCreator());
    expect(dispatch).toHaveBeenNthCalledWith(2, finishLoadingActionCreator());
  });

  it('should dispatch startLoading, throw an error, and dispatch finishLoading when register fails', async () => {
    // arrange
    api.register = () => Promise.reject(fakeErrorResponse);
    const dispatch = vi.fn();

    // action
    try {
      await asyncRegisterUser({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
      })(dispatch);
      expect.fail('Promise should have been rejected');
    } catch (error) {
      // assert
      expect(error).toEqual(fakeErrorResponse);
      expect(dispatch).toHaveBeenNthCalledWith(1, startLoadingActionCreator());
      expect(dispatch).toHaveBeenNthCalledWith(2, finishLoadingActionCreator());
    }
  });
});
describe('asyncGetAllUsers thunk', () => {
  beforeEach(() => {
    api._getAllUsers = api.getAllUsers;
  });

  afterEach(() => {
    api.getAllUsers = api._getAllUsers;

    delete api._getAllUsers;
  });

  it('should dispatch action correctly when data fetching success', async () => {
    // arrange
    const fakeUsersResponse = [
      {
        id: 'users-1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://generated-image-url.jpg',
      },
      {
        id: 'users-2',
        name: 'Jane Doe',
        email: 'jane@example.com',
        avatar: 'https://generated-image-url.jpg',
      },
    ];
    api.getAllUsers = () => Promise.resolve(fakeUsersResponse);
    const dispatch = vi.fn();

    // action
    await asyncGetAllUsers()(dispatch);

    // assert
    expect(dispatch).toHaveBeenCalled();
    expect(dispatch).toHaveBeenNthCalledWith(1, startLoadingActionCreator());
    expect(dispatch).toHaveBeenNthCalledWith(2, receiveUsersActionCreator(fakeUsersResponse));
    expect(dispatch).toHaveBeenNthCalledWith(3, finishLoadingActionCreator());
  });

  it('should dispatch start and finish loading only when data fetching failed', async () => {
    // arrange
    api.getAllUsers = () => Promise.reject(fakeErrorResponse);
    const dispatch = vi.fn();
    window.alert = vi.fn();

    // action
    try {
      await asyncGetAllUsers()(dispatch);
    } catch (error) {
      // assert
      expect(error).toEqual(fakeErrorResponse);
      expect(dispatch).toHaveBeenNthCalledWith(1, startLoadingActionCreator());
      expect(dispatch).toHaveBeenNthCalledWith(2, finishLoadingActionCreator());
      expect(window.alert).toHaveBeenCalledWith(error.message);
    }
  });
});
