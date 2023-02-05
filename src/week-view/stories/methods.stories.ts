import { Meta, StoryFn } from '@storybook/html';
import { EVENTS_MOCKS } from '../../mocks/events.mocks';
import { B5rWeekView } from '../week-view';
import { B5rWeekOptions } from '../week-view.utils';

export default {
    title: 'week-view/methods',
} as Meta;

const getDefaultTemplate = (options: {
    showBtnToday?: boolean;
    showBtnNext?: Boolean;
    showBtnPrevious?: boolean;
    weekOptions: B5rWeekOptions;
}) => {
    const refRoot = document.createElement('div');
    const refHeader = document.createElement('div');
    const refBtnToday = document.createElement('button');
    const refBtnPrevious = document.createElement('button');
    const refBtnNext = document.createElement('button');
    const refWeekView = document.createElement('div');

    refHeader.setAttribute(
        'style',
        `display: flex; gap: 16px; margin-bottom: 16px`
    );

    refBtnToday.innerText = 'Today';
    refBtnPrevious.innerText = '<';
    refBtnPrevious.title = 'Previous';
    refBtnNext.innerText = '>';
    refBtnNext.title = 'Next';

    options.weekOptions = {
        ...options.weekOptions,
        currentDate: new Date(),
    };

    const weekView = new B5rWeekView(refWeekView, options.weekOptions);

    refBtnToday.addEventListener('click', () => weekView.today());
    refBtnPrevious.addEventListener('click', () => weekView.previous());
    refBtnNext.addEventListener('click', () => weekView.next());

    if (options.showBtnToday) refHeader.append(refBtnToday);
    if (options.showBtnPrevious) refHeader.append(refBtnPrevious);
    if (options.showBtnNext) refHeader.append(refBtnNext);

    if (options.showBtnToday || options.showBtnPrevious || options.showBtnNext)
        refRoot.append(refHeader);
    refRoot.append(refWeekView);

    return {
        refRoot,
        refHeader,
        weekView,
    };
};

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

const TemplateOnViewUpdate: StoryFn = (args): HTMLElement => {
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

    weekView.onViewUpdate(() => {
        console.log('The week view is updated');
        refCurrentdate.innerText = weekView.currentDate.toLocaleDateString();
    });

    return refRoot;
};

export const OnViewUpdate = TemplateOnViewUpdate.bind({});
OnViewUpdate.storyName = 'onViewUpdate()';

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
