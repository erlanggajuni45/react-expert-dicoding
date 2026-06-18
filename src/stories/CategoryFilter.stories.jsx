import CategoryFilter from '../components/CategoryFilter';

export default {
    title: 'CategoryFilter',
    component: CategoryFilter,
};

const Template = (args) => <CategoryFilter {...args} />;

export const Default = Template.bind({});
Default.args = {
    categories: ['General', 'Question', 'Idea'],
    selected: null,
    onSelected: () => { },
};

export const WithSelectedCategory = Template.bind({});
WithSelectedCategory.args = {
    categories: ['General', 'Question', 'Idea'],
    selected: 'General',
    onSelected: () => { },
};

export const WithQuestionCategory = Template.bind({});
WithQuestionCategory.args = {
    categories: ['General', 'Question', 'Idea'],
    selected: 'Question',
    onSelected: () => { },
};

export const WithIdeaCategory = Template.bind({});
WithIdeaCategory.args = {
    categories: ['General', 'Question', 'Idea'],
    selected: 'Idea',
    onSelected: () => { },
};

export const InvalidPayload = Template.bind({});
InvalidPayload.args = {
    categories: null,
    selected: null,
    onSelected: null,
};

