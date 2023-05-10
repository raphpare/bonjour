import { Meta, StoryFn } from '@storybook/html';
import { getMonthViewDefaultTemplate } from './commons';
import { EVENT_MOCK_3_DAY } from '../../mocks/events.mocks';

export default {
    title: 'month-view/Methods',
} as Meta;

const setEvents: StoryFn = (args): HTMLElement => {
    const { refRoot, monthView } = getMonthViewDefaultTemplate({
        monthOptions: args,
    });
    monthView.setEvents(EVENT_MOCK_3_DAY);
    return refRoot;
};

export const MethodSetEvent = setEvents.bind({});
