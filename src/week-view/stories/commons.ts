import { B5rWeekView } from '../week-view';
import { B5rWeekOptions } from '../week-view.def';

export const getWeekViewDefaultTemplate = (options: {
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
