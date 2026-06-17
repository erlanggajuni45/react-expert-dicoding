import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../../api';
import {
  asyncSetAuthUser,
  asyncUnsetAuthUser,
  setAuthUserActionCreator,
  unsetAuthUserActionCreator,
} from './action';
import { finishLoadingActionCreator, startLoadingActionCreator } from '../ui/action';

const fakeLoginResponse = 'fake.token.response';

const fakeProfileResponse = {
  id: 'john_doe',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://generated-image-url.jpg',
};

const fakeErrorResponse = new Error('Ups, something went wrong!');

describe('asyncSetAuthUser thunk', () => {
  beforeEach(() => {
    api._login = api.login;
    api._putAccessToken = api.putAccessToken;
    api._getOwnProfile = api.getOwnProfile;
  });

  afterEach(() => {
    api.login = api._login;
    api.putAccessToken = api._putAccessToken;
    api.getOwnProfile = api._getOwnProfile;

    delete api._login;
    delete api._putAccessToken;
    delete api._getOwnProfile;
  });

  it('should dispatch action correctly when login is success', async () => {
    // arrange
    // stub implementation
    api.login = () => Promise.resolve(fakeLoginResponse);
    api.putAccessToken = vi.fn();
    api.getOwnProfile = () => Promise.resolve(fakeProfileResponse);
    // mock dispatch
    const dispatch = vi.fn();

    // action
    await asyncSetAuthUser({ email: 'john@example.com', password: '123456' })(dispatch);

    // assertt
    expect(dispatch).toHaveBeenNthCalledWith(1, startLoadingActionCreator());
    expect(dispatch).toHaveBeenNthCalledWith(2, setAuthUserActionCreator(fakeProfileResponse));
    expect(dispatch).toHaveBeenNthCalledWith(3, finishLoadingActionCreator());
  });

  it('should dispatch startLoading, throw an error, and dispatch finishLoading when login fails', async () => {
    // arrange
    // stub implementation
    api.login = () => Promise.reject(fakeErrorResponse);
    // mock dispatch
    const dispatch = vi.fn();

    // action
    try {
      await asyncSetAuthUser({ email: 'john@example.com', password: 'xxxx' })(dispatch);
      expect.fail('Promise should have been rejected');
    } catch (error) {
      // assert
      expect(error).toEqual(fakeErrorResponse);
      expect(dispatch).toHaveBeenNthCalledWith(1, startLoadingActionCreator());
      expect(dispatch).toHaveBeenNthCalledWith(2, finishLoadingActionCreator());
    }
  });

  it('should dispatch startLoading, throw an error, and dispatch finishLoading when get profile fails', async () => {
    // arrange
    // stub implementation
    api.login = () => Promise.resolve(fakeLoginResponse);
    api.putAccessToken = () => vi.fn();
    api.getOwnProfile = () => Promise.reject(fakeErrorResponse);
    // mock dispatch
    const dispatch = vi.fn();

    // action
    try {
      await asyncSetAuthUser({ email: 'john@example.com', password: '123456' })(dispatch);
      expect.fail('Promise should have been rejected');
    } catch (error) {
      expect(error).toEqual(fakeErrorResponse);
      expect(dispatch).toHaveBeenNthCalledWith(1, startLoadingActionCreator());
      expect(dispatch).toHaveBeenNthCalledWith(2, finishLoadingActionCreator());
    }
  });
});

describe('asyncUnsetAuthUser thunk', () => {
  beforeEach(() => {
    api._putAccessToken = api.putAccessToken;
  });

  afterEach(() => {
    api.putAccessToken = api._putAccessToken;

    delete api._putAccessToken;
  });

  it('should dispatch action correctly and clear access token', async () => {
    // arrange
    api.putAccessToken = vi.fn();
    const dispatch = vi.fn();

    // action
    await asyncUnsetAuthUser()(dispatch);

    // assert
    expect(dispatch).toHaveBeenNthCalledWith(1, startLoadingActionCreator());
    expect(dispatch).toHaveBeenNthCalledWith(2, unsetAuthUserActionCreator());
    expect(dispatch).toHaveBeenNthCalledWith(3, finishLoadingActionCreator());

    expect(api.putAccessToken).toHaveBeenCalledWith('');
  });
});
