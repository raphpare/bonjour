import { B5rMonthView } from '../month-view';
import { B5rMonthOptions } from '../month-view.def';

export const getMonthViewDefaultTemplate = (options: {
    monthOptions: B5rMonthOptions;
}) => {
    const refRoot = document.createElement('div');
    const refHeader = document.createElement('div');
    const refBtnToday = document.createElement('button');
    const refBtnPrevious = document.createElement('button');
    const refBtnNext = document.createElement('button');
    const refMonthView = document.createElement('div');

    refRoot.setAttribute('style', `max-width: 600px`);
    refHeader.setAttribute(
        'style',
        `display: flex; gap: 16px; margin-bottom: 16px`
    );

    refBtnToday.innerText = 'Today';
    refBtnPrevious.innerText = '<';
    refBtnPrevious.title = 'Previous';
    refBtnNext.innerText = '>';
    refBtnNext.title = 'Next';

    const monthView = new B5rMonthView(refMonthView, options.monthOptions);

    refBtnToday.addEventListener('click', () => {
        monthView.today();
    });

    refBtnPrevious.addEventListener('click', () => {
        monthView.previous();
    });

    refBtnNext.addEventListener('click', () => {
        monthView.next();
    });

    monthView.onDayClick((event, date) => {
        monthView.currentDate = date;
    });

    refHeader.append(refBtnToday);
    refHeader.append(refBtnPrevious);
    refHeader.append(refBtnNext);

    refRoot.append(refHeader);
    refRoot.append(refMonthView);

    return {
        refRoot,
        refHeader,
        monthView,
    };
};
