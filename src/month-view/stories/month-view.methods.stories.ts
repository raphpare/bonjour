import { Meta, StoryFn } from '@storybook/html';
import { getMonthViewDefaultTemplate } from './commons';
import { EVENT_MOCK_3 } from '../../mocks/events.mocks';

export default {
    title: 'month-view/Methods',
} as Meta;

const TemplateSetEvents: StoryFn = (args): HTMLElement => {
    const { refRoot, monthView } = getMonthViewDefaultTemplate({
        monthOptions: args,
    });

    monthView.setEvents(EVENT_MOCK_3);

    monthView.onSelectedDateChange((date) => {
        console.log('onSelectedDateChange :', date);
    });

    monthView.onCurrentDateChange((date) => {
        console.log('onCurrentDateChange : ', date);
    });

    return refRoot;
};

export const SetEvents = TemplateSetEvents.bind({});
SetEvents.storyName = 'setEvents()';
