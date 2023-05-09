import { Meta, StoryFn } from '@storybook/html';
import { getMonthViewDefaultTemplate } from './commons';
import { EVENTS_MOCKS } from '../../mocks/events.mocks';

export default {
    title: 'month-view/Methods',
} as Meta;

const Template: StoryFn = (args): HTMLElement => {
    const { refRoot } = getMonthViewDefaultTemplate({
        monthOptions: args,
    });

    return refRoot;
};

const setEvents: StoryFn = (args): HTMLElement => {
    const { refRoot, monthView } = getMonthViewDefaultTemplate({
        monthOptions: args,
    });
    monthView.setEvents([
        {
            id: '7jvusutc',
            title: 'Event 1',
            dateRange: {
                start: new Date('2023-04-29 12:30:30'),
                end: new Date('2023-05-2 15:30:30'),
            },
        },
    ]);
    return refRoot;
};

export const MethodSetEvent = setEvents.bind({});
