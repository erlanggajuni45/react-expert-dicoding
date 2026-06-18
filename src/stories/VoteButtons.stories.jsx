import React from 'react';
import VoteButtons from '../components/VoteButtons';

export default {
  title: 'VoteButtons',
  component: VoteButtons,
};

const Template = (args) => <VoteButtons {...args} />;

export const Default = Template.bind({});
Default.args = {
  upCount: 0,
  downCount: 0,
  upActive: false,
  downActive: false,
  onUp: () => {},
  onDown: () => {},
};

export const WithUpVotes = Template.bind({});
WithUpVotes.args = {
  upCount: 5,
  downCount: 0,
  upActive: true,
  downActive: false,
  onUp: () => {},
  onDown: () => {},
};

export const WithDownVotes = Template.bind({});
WithDownVotes.args = {
  upCount: 0,
  downCount: 3,
  upActive: false,
  downActive: true,
  onUp: () => {},
  onDown: () => {},
};

export const InvalidPayload = Template.bind({});
InvalidPayload.args = {
  upCount: null,
  downCount: null,
  upActive: null,
  downActive: null,
  onUp: null,
  onDown: null,
};
