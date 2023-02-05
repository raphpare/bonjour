import { Meta, StoryFn } from '@storybook/html';
import { EVENTS_MOCKS } from '../../mocks/events.mocks';
import { B5rWeekView } from '../week-view';
import { B5rWeekOptions } from '../week-view.utils';

export default {
    title: 'week-view/attributes',
} as Meta;

const Template: StoryFn<B5rWeekOptions> = (args): HTMLElement => {
    const refRoot = document.createElement('div');

    refRoot.innerText = 'Todo';

    return refRoot;
};

export const Default = Template.bind({});
