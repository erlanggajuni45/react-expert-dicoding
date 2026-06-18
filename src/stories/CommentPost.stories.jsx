import React from 'react';
import CommentPost from '../components/CommentPost';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';

const mockStore = (preloadedState) =>
  configureStore({
    reducer: {
      authUser: (state = preloadedState?.authUser || null) => state,
      ui: (state = preloadedState?.ui || { loadingCount: 0 }) => state,
    },
  });

export default {
  title: 'CommentPost',
  component: CommentPost,
  decorators: [
    (Story, context) => {
      const preloadedState = context.parameters.storeState || {};
      const store = mockStore(preloadedState);

      return (
        <Provider store={store}>
          <MemoryRouter>
            <Story />
          </MemoryRouter>
        </Provider>
      );
    },
  ],
};

const Template = (args) => <CommentPost {...args} />;

export const Default = Template.bind({});
Default.args = {
  commentCount: 0,
  threadId: 'thread-1',
};

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  commentCount: 3,
  threadId: 'thread-1',
};
LoggedIn.parameters = {
  storeState: {
    authUser: {
      id: 'user-1',
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
  },
};

export const Loading = Template.bind({});
Loading.args = {
  commentCount: 3,
  threadId: 'thread-1',
};
Loading.parameters = {
  storeState: {
    authUser: {
      id: 'user-1',
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    ui: {
      loadingCount: 1,
    },
  },
};

export const InvalidPayload = Template.bind({});
InvalidPayload.args = {
  commentCount: null,
  threadId: null,
};
