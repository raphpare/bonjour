import { Meta, StoryFn } from '@storybook/html';
import { EVENTS_MOCKS, EVENTS_SAMEDAY_MOCK } from '../../mocks/events.mocks';
import { getWeekViewDefaultTemplate } from './commons';

export default {
    title: 'week-view/Methods',
} as Meta;

const TemplateSetEvents: StoryFn = (args): HTMLElement => {
    const { refRoot, weekView } = getWeekViewDefaultTemplate({
        weekOptions: args,
    });
    weekView.setEvents([...EVENTS_MOCKS]);

    return refRoot;
};

export const SetEvents = TemplateSetEvents.bind({});
SetEvents.storyName = 'setEvents()';

const TemplateSetEventsSameDay: StoryFn = (args): HTMLElement => {
    const { refRoot, weekView } = getWeekViewDefaultTemplate({
        weekOptions: args,
    });

    weekView.setEvents([...EVENTS_SAMEDAY_MOCK]);

    weekView.onEventClick((pointerEvent, eventClicked) => {
        console.log(
            'Event clicked :',
            eventClicked,
            ' with PointerEvent: ',
            pointerEvent
        );
    });

    return refRoot;
};

export const SetEventsSameDay = TemplateSetEventsSameDay.bind({});
SetEventsSameDay.storyName = 'setEvents() - Same Day';

const TemplateToday: StoryFn = (args): HTMLElement => {
    const { refRoot, weekView } = getWeekViewDefaultTemplate({
        showBtnToday: true,
        showBtnNext: true,
        showBtnPrevious: true,
        weekOptions: args,
    });

    weekView.today();

    return refRoot;
};

export const Today = TemplateToday.bind({});
Today.storyName = 'today()';

const TemplateScrollToCurrentTime: StoryFn = (args): HTMLElement => {
    const { refRoot, weekView } = getWeekViewDefaultTemplate({
        showBtnToday: true,
        showBtnNext: true,
        showBtnPrevious: true,
        weekOptions: args,
    });

    weekView.scrollToCurrentTime();

    return refRoot;
};

export const ScrollToCurrentTime = TemplateScrollToCurrentTime.bind({});
ScrollToCurrentTime.storyName = 'scrollToCurrentTime()';

const TemplatePrevious: StoryFn = (weekOptions): HTMLElement => {
    const { refRoot, weekView } = getWeekViewDefaultTemplate({
        showBtnPrevious: true,
        weekOptions,
    });

    weekView.previous();

    return refRoot;
};

export const Previous = TemplatePrevious.bind({});
Previous.storyName = 'previous()';

const TemplateNext: StoryFn = (args): HTMLElement => {
    const { refRoot, weekView } = getWeekViewDefaultTemplate({
        showBtnNext: true,
        weekOptions: args,
    });

    weekView.next();

    return refRoot;
};

export const Next = TemplateNext.bind({});
Next.storyName = 'next()';

const TemplateDestroy: StoryFn = (args): HTMLElement => {
    const { refRoot, weekView } = getWeekViewDefaultTemplate({
        showBtnToday: true,
        showBtnNext: true,
        showBtnPrevious: true,
        weekOptions: args,
    });

    weekView.setEvents([...EVENTS_MOCKS]);

    setTimeout(() => {
        weekView.destroy();
    }, 1000);

    return refRoot;
};

export const Destroy = TemplateDestroy.bind({});
Destroy.storyName = 'destroy()';

const TemplateOnUpdate: StoryFn = (args): HTMLElement => {
    const { refRoot, refHeader, weekView } = getWeekViewDefaultTemplate({
        showBtnToday: true,
        showBtnNext: true,
        showBtnPrevious: true,
        weekOptions: args,
    });

    const refCurrentdate = document.createElement('h2');
    refCurrentdate.setAttribute('style', `margin: 0`);
    refCurrentdate.innerText = weekView.currentDate.toLocaleDateString();

    refHeader.append(refCurrentdate);

    weekView.onUpdate(() => {
        refCurrentdate.innerText = weekView.currentDate.toLocaleDateString();
    });

    return refRoot;
};

export const OnUpdate = TemplateOnUpdate.bind({});
OnUpdate.storyName = 'onUpdate()';

const TemplateOnEventClick: StoryFn = (args): HTMLElement => {
    const { refRoot, weekView } = getWeekViewDefaultTemplate({
        showBtnToday: true,
        showBtnNext: true,
        showBtnPrevious: true,
        weekOptions: args,
    });
    weekView.setEvents([...EVENTS_MOCKS]);

    weekView.onEventClick((pointerEvent, eventClicked) => {
        console.log(
            'Event clicked :',
            eventClicked,
            ' with PointerEvent: ',
            pointerEvent
        );
    });

    weekView.scrollToCurrentTime();

    return refRoot;
};

export const OnEventClick = TemplateOnEventClick.bind({});
OnEventClick.storyName = 'onEventClick()';
