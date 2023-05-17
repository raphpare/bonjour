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
    const refBtnLangJp = document.createElement('button');
    const refBtnLangEn = document.createElement('button');
    const refMonthView = document.createElement('div');
    const refCurrentDate = document.createElement('span');
    const refSelectedDate = document.createElement('span');

    const texteSelectedDate = 'Selected date: ';
    const texteCurrentDate = 'Current date: ';

    refRoot.setAttribute('style', `max-width: 600px; height: 800px`);
    refHeader.setAttribute(
        'style',
        `display: flex; gap: 16px; margin-bottom: 16px`
    );

    refBtnToday.innerText = 'Today';
    refBtnPrevious.innerText = '<';
    refBtnPrevious.title = 'Previous';
    refBtnNext.innerText = '>';
    refBtnNext.title = 'Next';

    refBtnLangJp.innerText = 'Jp';
    refBtnLangEn.innerText = 'En';

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

    refBtnLangJp.addEventListener('click', () => {
        monthView.locale = 'ja-JP';
    });

    refBtnLangEn.addEventListener('click', () => {
        monthView.locale = 'en-CA';
    });

    monthView.onCurrentDateChange((_date: Date) => {
        refCurrentDate.innerText = `${texteCurrentDate}${_date.toLocaleString()}`;
    });

    monthView.onSelectedDateChange((_date: Date) => {
        refSelectedDate.innerText = `${texteSelectedDate}${_date.toLocaleString()}`;
    });

    refCurrentDate.innerText = `${texteCurrentDate}${monthView.currentDate.toLocaleString()}`;
    refSelectedDate.innerText = `${texteSelectedDate}${monthView.selectedDate.toLocaleString()}`;

    refHeader.append(refCurrentDate);
    refHeader.append(refSelectedDate);
    refHeader.append(refBtnToday);
    refHeader.append(refBtnPrevious);
    refHeader.append(refBtnNext);
    refHeader.append(refBtnLangJp);
    refHeader.append(refBtnLangEn);

    refRoot.append(refHeader);
    refRoot.append(refMonthView);

    return {
        refRoot,
        refHeader,
        monthView,
    };
};
