import { Meta, StoryFn } from '@storybook/html';
import { B5rMonthView } from '../month-view';

export default {
    title: 'month-view/Constructor Options',
} as Meta;

const dateNow = new Date();

const Template: StoryFn = (args): HTMLElement => {
    const refRoot = document.createElement('div');
    const refHeader = document.createElement('div');
    const refBtnToday = document.createElement('button');
    const refBtnPrevious = document.createElement('button');
    const refBtnNext = document.createElement('button');
    const refMonthView = document.createElement('div');

    refHeader.setAttribute(
        'style',
        `display: flex; gap: 16px; margin-bottom: 16px`
    );

    refBtnToday.innerText = 'Today';
    refBtnPrevious.innerText = '<';
    refBtnPrevious.title = 'Previous';
    refBtnNext.innerText = '>';
    refBtnNext.title = 'Next';

    const monthView = new B5rMonthView(refMonthView);

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
        console.log('click', event, date);
    });

    refHeader.append(refBtnToday);
    refHeader.append(refBtnPrevious);
    refHeader.append(refBtnNext);

    refRoot.append(refHeader);
    refRoot.append(refMonthView);

    return refRoot;
};

export const Default = Template.bind({});
