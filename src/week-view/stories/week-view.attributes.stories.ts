import { Meta, StoryFn } from '@storybook/html';
import { B5rWeekViewMode } from '../week-view.def';
import { B5rWeekOptions } from '../week-view.utils';
import { argsTypeMode, getWeekViewDefaultTemplate } from './commons';

export default {
    title: 'week-view/Attributes',
} as Meta;

const dateNow = new Date();

const Template: StoryFn<B5rWeekOptions> = (args): HTMLElement => {
    const { refRoot } = getWeekViewDefaultTemplate({
        weekOptions: args,
    });

    return refRoot;
};

export const CurrentDate = Template.bind({});
CurrentDate.args = {
    currentDate: new Date(dateNow.setDate(dateNow.getDate() + 20)),
};
CurrentDate.storyName = 'currentDate';

export const Locale = Template.bind({});
Locale.args = {
    locale: 'fr-CA',
};
Locale.storyName = 'locale';

export const TimeZone = Template.bind({});
TimeZone.args = {
    timeZone: 'Europe/Amsterdam',
};
TimeZone.storyName = 'timeZone';

export const Mode = Template.bind({});
Mode.argTypes = {
    mode: argsTypeMode,
};
Mode.args = {
    mode: B5rWeekViewMode.ThreeDays,
};
Mode.storyName = 'mode';
