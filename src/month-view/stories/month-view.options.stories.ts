import { Meta, StoryFn } from '@storybook/html';
import { getMonthViewDefaultTemplate } from './commons';

export default {
    title: 'month-view/Constructor Options',
} as Meta;

const Template: StoryFn = (args): HTMLElement => {
    const { refRoot } = getMonthViewDefaultTemplate({
        monthOptions: args,
    });

    return refRoot;
};

export const Default = Template.bind({});
Default.args = {
    locale: 'fr',
};
Default.storyName = 'TODO';
