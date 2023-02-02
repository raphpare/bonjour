import { Meta, StoryFn } from '@storybook/html';
import { EVENTS_MOCKS } from '../../mocks/events.mocks';
import { B5rWeekView } from '../week-view';

export default {
    title: 'week-view/methods',
} as Meta;

const TemplateSetEvents: StoryFn = (args): HTMLElement => {
    const refRoot = document.createElement('div');
    const weekView = new B5rWeekView(refRoot, args);
    weekView.setEvents(EVENTS_MOCKS);
    return refRoot;
};

export const SetEvents = TemplateSetEvents.bind({});
SetEvents.storyName = 'setEvent()';

const TemplateNext: StoryFn = (args): HTMLElement => {
    const refRoot = document.createElement('div');
    const weekView = new B5rWeekView(refRoot, args);
    weekView.next();
    return refRoot;
};

export const Next = TemplateNext.bind({});
Next.storyName = 'next()';

const TemplatePrevious: StoryFn = (args): HTMLElement => {
    const refRoot = document.createElement('div');
    const weekView = new B5rWeekView(refRoot, args);
    weekView.previous();
    return refRoot;
};

export const Previous = TemplatePrevious.bind({});
Previous.storyName = 'previous()';

const TemplateToday: StoryFn = (args): HTMLElement => {
    const refRoot = document.createElement('div');
    const weekView = new B5rWeekView(refRoot, args);
    weekView.today();
    return refRoot;
};

export const Today = TemplateToday.bind({});
Today.storyName = 'today()';
