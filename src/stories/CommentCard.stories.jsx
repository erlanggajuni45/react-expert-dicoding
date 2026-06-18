import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router';
import CommentCard from '../components/CommentCard';

const mockStore = (preloadedState) =>
  configureStore({
    reducer: {
      authUser: (state = preloadedState?.authUser || null) => state,
    },
  });

export default {
  title: 'CommentCard',
  component: CommentCard,
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

const Template = (args) => <CommentCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  comment: {
    id: 'comment-1',
    content: 'Ini adalah komentar pertama',
    createdAt: '2022-01-01T00:00:00.000Z',
    upVotesBy: [],
    downVotesBy: [],
    owner: {
      id: 'user-1',
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
  },
  threadId: 'thread-1',
};

export const WithUpVote = Template.bind({});
WithUpVote.args = {
  comment: {
    id: 'comment-1',
    content: 'Ini adalah komentar pertama',
    createdAt: '2022-01-01T00:00:00.000Z',
    upVotesBy: ['user-1'],
    downVotesBy: [],
    owner: {
      id: 'user-1',
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
  },
  threadId: 'thread-1',
};

export const WithDownVote = Template.bind({});
WithDownVote.args = {
  comment: {
    id: 'comment-1',
    content: 'Ini adalah komentar pertama',
    createdAt: '2022-01-01T00:00:00.000Z',
    upVotesBy: [],
    downVotesBy: ['user-1'],
    owner: {
      id: 'user-1',
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
  },
  threadId: 'thread-1',
};

export const WithUpAndDownVote = Template.bind({});
WithUpAndDownVote.args = {
  comment: {
    id: 'comment-1',
    content: 'Ini adalah komentar pertama',
    createdAt: '2022-01-01T00:00:00.000Z',
    upVotesBy: ['user-1'],
    downVotesBy: ['user-2'],
    owner: {
      id: 'user-1',
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
  },
  threadId: 'thread-1',
};

export const WithUserUpVote = Template.bind({});
WithUserUpVote.args = {
  comment: {
    id: 'comment-1',
    content: 'Ini adalah komentar pertama',
    createdAt: '2022-01-01T00:00:00.000Z',
    upVotesBy: ['user-1'],
    downVotesBy: [],
    owner: {
      id: 'user-1',
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
  },
  threadId: 'thread-1',
};
WithUserUpVote.parameters = {
  storeState: {
    authUser: {
      id: 'user-1',
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
  },
};

export const WithUserDownVote = Template.bind({});
WithUserDownVote.args = {
  comment: {
    id: 'comment-1',
    content: 'Ini adalah komentar pertama',
    createdAt: '2022-01-01T00:00:00.000Z',
    upVotesBy: [],
    downVotesBy: ['user-1'],
    owner: {
      id: 'user-1',
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
  },
  threadId: 'thread-1',
};
WithUserDownVote.parameters = {
  storeState: {
    authUser: {
      id: 'user-1',
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
  },
};

export const InvalidPayload = Template.bind({});
InvalidPayload.args = {
  comment: null,
  threadId: null,
};
