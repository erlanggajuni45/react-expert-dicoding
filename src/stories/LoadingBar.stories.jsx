import React from 'react';
import LoadingBar from '../components/LoadingBar';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

const mockStore = (preloadedState) =>
  configureStore({
    reducer: {
      ui: (state = preloadedState?.ui || { loadingCount: 0 }) => state,
    },
  });

export default {
  title: 'LoadingBar',
  component: LoadingBar,
  decorators: [
    (Story, context) => {
      const preloadedState = context.parameters.storeState || {};
      const store = mockStore(preloadedState);

      return (
        <Provider store={store}>
          <Story />
        </Provider>
      );
    },
  ],
};

const Template = (args) => <LoadingBar {...args} />;

export const Default = Template.bind({});
Default.args = {};
Default.parameters = {
  storeState: {
    ui: { loadingCount: 0 },
  },
};

export const Loading = Template.bind({});
Loading.args = {};
Loading.parameters = {
  storeState: {
    ui: { loadingCount: 1 },
  },
};
