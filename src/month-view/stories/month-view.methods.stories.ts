import { Meta, StoryFn } from '@storybook/html';
import { getMonthViewDefaultTemplate } from './commons';

export default {
    title: 'month-view/Methods',
} as Meta;

const Template: StoryFn = (args): HTMLElement => {
    const { refRoot } = getMonthViewDefaultTemplate({
        monthOptions: args,
    });

    return refRoot;
};

export const Default = Template.bind({});

const WithSelectDateDayClickCallbackTemplate: StoryFn = (args): HTMLElement => {
    const { refRoot, monthView } = getMonthViewDefaultTemplate({
        monthOptions: args,
    });
    monthView.onDayClick((_event, date) => {
        monthView.selectedDate = date;
    });
    return refRoot;
};

export const WithSelectDateDayClickCallback =
    WithSelectDateDayClickCallbackTemplate.bind({});
WithSelectDateDayClickCallback.args = Default.args;
