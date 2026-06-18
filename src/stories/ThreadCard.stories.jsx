import React from 'react';
import ThreadCard from '../components/ThreadCard';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';

const mockStore = (preloadedState) =>
  configureStore({
    reducer: {
      authUser: (state = preloadedState?.authUser || null) => state,
    },
  });

export default {
  title: 'ThreadCard',
  component: ThreadCard,
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

const Template = (args) => <ThreadCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  thread: {
    id: 'thread-1',
    title: 'Ini adalah judul thread pertama',
    body: 'Ini adalah isi thread pertama',
    category: 'General',
    createdAt: '2022-01-01T00:00:00.000Z',
    upVotesBy: [],
    downVotesBy: [],
    totalComments: 0,
    ownerId: 'user-1',
  },
  owner: {
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
};

export const WithUpVote = Template.bind({});
WithUpVote.args = {
  thread: {
    id: 'thread-1',
    title: 'Ini adalah judul thread pertama',
    body: 'Ini adalah isi thread pertama',
    category: 'General',
    createdAt: '2022-01-01T00:00:00.000Z',
    upVotesBy: ['user-1'],
    downVotesBy: [],
    totalComments: 0,
    ownerId: 'user-1',
  },
  owner: {
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
};

export const WithDownVote = Template.bind({});
WithDownVote.args = {
  thread: {
    id: 'thread-1',
    title: 'Ini adalah judul thread pertama',
    body: 'Ini adalah isi thread pertama',
    category: 'General',
    createdAt: '2022-01-01T00:00:00.000Z',
    upVotesBy: [],
    downVotesBy: ['user-1'],
    totalComments: 0,
    ownerId: 'user-1',
  },
  owner: {
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
};

export const WithUpAndDownVote = Template.bind({});
WithUpAndDownVote.args = {
  thread: {
    id: 'thread-1',
    title: 'Ini adalah judul thread pertama',
    body: 'Ini adalah isi thread pertama',
    category: 'General',
    createdAt: '2022-01-01T00:00:00.000Z',
    upVotesBy: ['user-1'],
    downVotesBy: ['user-2'],
    totalComments: 0,
    ownerId: 'user-1',
  },
  owner: {
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
};

export const WithUserUpVote = Template.bind({});
WithUserUpVote.args = {
  thread: {
    id: 'thread-1',
    title: 'Ini adalah judul thread pertama',
    body: 'Ini adalah isi thread pertama',
    category: 'General',
    createdAt: '2022-01-01T00:00:00.000Z',
    upVotesBy: ['user-1'],
    downVotesBy: [],
    totalComments: 0,
    ownerId: 'user-1',
  },
  owner: {
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
};
WithUserUpVote.parameters = {
  storeState: {
    authUser: {
      id: 'user-1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
  },
};

export const WithUserDownVote = Template.bind({});
WithUserDownVote.args = {
  thread: {
    id: 'thread-1',
    title: 'Ini adalah judul thread pertama',
    body: 'Ini adalah isi thread pertama',
    category: 'General',
    createdAt: '2022-01-01T00:00:00.000Z',
    upVotesBy: [],
    downVotesBy: ['user-1'],
    totalComments: 0,
    ownerId: 'user-1',
  },
  owner: {
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
};

WithUserDownVote.parameters = {
  storeState: {
    authUser: {
      id: 'user-1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
  },
};

export const InvalidProps = Template.bind({});
InvalidProps.args = {
  thread: null,
  owner: null,
};
