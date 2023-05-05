import { Meta, StoryFn } from '@storybook/html';
import { getMonthViewDefaultTemplate } from './commons';

export default {
    title: 'month-view/Attributes',
} as Meta;

const dateNow = new Date();

const Template: StoryFn = (args): HTMLElement => {
    const { refRoot } = getMonthViewDefaultTemplate({
        monthOptions: args,
    });

    return refRoot;
};

export const CurrentDate = Template.bind({});
CurrentDate.args = {
    currentDate: new Date(
        dateNow.getFullYear(),
        dateNow.getMonth(),
        dateNow.getDate() + 15
    ),
};
CurrentDate.storyName = 'CurrentDate';

export const SelectedDate = Template.bind({});
SelectedDate.args = {
    selectedDate: new Date(
        dateNow.getFullYear(),
        dateNow.getMonth(),
        dateNow.getDate() + 10
    ),
};
SelectedDate.storyName = 'selectedDate';

export const Locale = Template.bind({});
Locale.args = {
    locale: 'fr-CA',
};
Locale.storyName = 'Locale';

export const TimeZone = Template.bind({});
TimeZone.args = {
    timeZone: 'Australia/Sydney',
};
TimeZone.storyName = 'timeZone';
