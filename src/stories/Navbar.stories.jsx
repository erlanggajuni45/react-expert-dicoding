import React from 'react';
import Navbar from '../components/Navbar';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router';

const mockStore = (preloadedState) =>
  configureStore({
    reducer: {
      authUser: (state = preloadedState?.authUser || null) => state,
    },
  });

export default {
  title: 'Navbar',
  component: Navbar,
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

const Template = (args) => <Navbar {...args} />;

export const Default = Template.bind({});
Default.args = {};
Default.parameters = {
  storeState: {
    authUser: null,
  },
};

export const LoggedIn = Template.bind({});
LoggedIn.args = {};
LoggedIn.parameters = {
  storeState: {
    authUser: {
      id: 'user-1',
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
  },
};
