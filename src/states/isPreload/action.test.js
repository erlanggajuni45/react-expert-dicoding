import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../../api';
import { asyncPreloadProcess, setIsPreloadActionCreator } from './action';
import { finishLoadingActionCreator, startLoadingActionCreator } from '../ui/action';
import { setAuthUserActionCreator } from '../authUser/action';

const fakeProfileResponse = {
  id: 'john_doe',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://generated-image-url.jpg',
};

const fakeErrorResponse = new Error('Ups, something went wrong!');

describe('asyncPreloadProcess thunk', () => {
  beforeEach(() => {
    api._getAccessToken = api.getAccessToken;
    api._getOwnProfile = api.getOwnProfile;
  });

  afterEach(() => {
    api.getAccessToken = api._getAccessToken;
    api.getOwnProfile = api._getOwnProfile;

    delete api._getAccessToken;
    delete api._getOwnProfile;
  });

  it('should dispatch action correctly when preload is success and token is not empty', async () => {
    // arrange
    api.getAccessToken = () => 'fake-token-access';
    api.getOwnProfile = () => Promise.resolve(fakeProfileResponse);
    const dispatch = vi.fn();

    // action
    await asyncPreloadProcess()(dispatch);

    // assert
    expect(dispatch).toHaveBeenNthCalledWith(1, startLoadingActionCreator());
    expect(dispatch).toHaveBeenNthCalledWith(2, setAuthUserActionCreator(fakeProfileResponse));
    expect(dispatch).toHaveBeenNthCalledWith(3, setIsPreloadActionCreator(false));
    expect(dispatch).toHaveBeenNthCalledWith(4, finishLoadingActionCreator());
  });

  it('should dispatch startLoading, do early return, setIsPreload, and finishLoading when access token is empty', async () => {
    // arrange
    api.getAccessToken = () => '';
    api.getOwnProfile = vi.fn();
    const dispatch = vi.fn();

    // action
    await asyncPreloadProcess()(dispatch);

    // assert
    expect(dispatch).toHaveBeenNthCalledWith(1, startLoadingActionCreator());
    expect(dispatch).toHaveBeenNthCalledWith(2, setIsPreloadActionCreator(false));
    expect(dispatch).toHaveBeenNthCalledWith(3, finishLoadingActionCreator());

    expect(dispatch).not.toHaveBeenCalledWith(setAuthUserActionCreator(fakeProfileResponse));
    expect(api.getOwnProfile).not.toHaveBeenCalled();
  });

  it('should dispatch startLoading, throw error, setAuthUser, setIsPreload and finishLoading when fetching profile failed', async () => {
    // arrange
    api.getAccessToken = () => 'fake-token-access';
    api.getOwnProfile = () => Promise.reject(fakeErrorResponse);
    const dispatch = vi.fn();
    window.alert = vi.fn();

    // action
    await asyncPreloadProcess()(dispatch);

    // assert
    expect(dispatch).toHaveBeenNthCalledWith(1, startLoadingActionCreator());
    expect(dispatch).toHaveBeenNthCalledWith(2, setAuthUserActionCreator(null));
    expect(dispatch).toHaveBeenNthCalledWith(3, setIsPreloadActionCreator(false));
    expect(dispatch).toHaveBeenNthCalledWith(4, finishLoadingActionCreator());

    expect(window.alert).toHaveBeenCalledWith(fakeErrorResponse.message);
  });
});
