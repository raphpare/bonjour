import { Meta, StoryFn } from '@storybook/html';
import { EVENTS_MOCKS } from '../../mocks/events.mocks';
import { getDefaultTemplate } from './commons';

export default {
    title: 'week-view/Methods',
} as Meta;

const TemplateSetEvents: StoryFn = (args): HTMLElement => {
    const { refRoot, weekView } = getDefaultTemplate({
        weekOptions: args,
    });

    weekView.setEvents(EVENTS_MOCKS);

    return refRoot;
};

export const SetEvents = TemplateSetEvents.bind({});
SetEvents.storyName = 'setEvent()';

const TemplatePrevious: StoryFn = (args): HTMLElement => {
    const { refRoot, weekView } = getDefaultTemplate({
        showBtnPrevious: true,
        weekOptions: args,
    });

    weekView.previous();

    return refRoot;
};

export const Previous = TemplatePrevious.bind({});
Previous.storyName = 'previous()';

const TemplateNext: StoryFn = (args): HTMLElement => {
    const { refRoot, weekView } = getDefaultTemplate({
        showBtnNext: true,
        weekOptions: args,
    });

    weekView.next();

    return refRoot;
};

export const Next = TemplateNext.bind({});
Next.storyName = 'next()';

const TemplateToday: StoryFn = (args): HTMLElement => {
    const { refRoot, weekView } = getDefaultTemplate({
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

const TemplateOnUpdate: StoryFn = (args): HTMLElement => {
    const { refRoot, refHeader, weekView } = getDefaultTemplate({
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
        console.log('The week view is updated');
        refCurrentdate.innerText = weekView.currentDate.toLocaleDateString();
    });

    return refRoot;
};

export const OnUpdate = TemplateOnUpdate.bind({});
OnUpdate.storyName = 'onUpdate()';

const TemplateOnEventClick: StoryFn = (args): HTMLElement => {
    const { refRoot, weekView } = getDefaultTemplate({
        showBtnToday: true,
        showBtnNext: true,
        showBtnPrevious: true,
        weekOptions: args,
    });

    weekView.setEvents(EVENTS_MOCKS);

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

export const OnEventClick = TemplateOnEventClick.bind({});
OnEventClick.storyName = 'onEventClick()';
