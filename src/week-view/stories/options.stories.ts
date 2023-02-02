import { Meta, StoryFn } from '@storybook/html';
import { B5rWeekView } from '../week-view';
import {
    B5rWeekOptions,
    B5rWeekViewMode,
    DEFAULT_OPTIONS,
} from '../week-view.utils';

const argsTypeMode = {
    control: 'select',
    options: Object.values(B5rWeekViewMode),
};

export default {
    title: 'week-view/options',
} as Meta<B5rWeekOptions>;

const dateNow = new Date();

const Template: StoryFn<B5rWeekOptions> = (args): HTMLElement => {
    const refRoot = document.createElement('div');
    new B5rWeekView(refRoot, args);
    return refRoot;
};

export const Default = Template.bind({});
Default.argTypes = {
    mode: argsTypeMode,
};
Default.args = {
    ...DEFAULT_OPTIONS,
};

export const Mode = Template.bind({});
Mode.argTypes = {
    mode: argsTypeMode,
};
Mode.args = {
    mode: B5rWeekViewMode.ThreeDays,
};

export const CurrentDate = Template.bind({});
CurrentDate.args = {
    currentDate: new Date(dateNow.setDate(dateNow.getDate() + 7)),
};

export const Locale = Template.bind({});
Locale.args = {
    locale: 'en',
};

export const TimeZone = Template.bind({});
TimeZone.args = {
    timeZone: 'America/Los_Angeles',
};

export const DesignTokens = Template.bind({});
DesignTokens.args = {
    designTokens: {
        ['--time-area-width']: '50px',
        ['--hour-height']: '10px',
        ['--border-color']: '#ccc',
        ['--weekend-background']: 'yellow',
        ['--today-background']: 'red',
    },
};
