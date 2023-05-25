import { Meta, StoryFn } from '@storybook/html';
import { getMonthViewDefaultTemplate } from './commons';
import { B5rMonthClassNames } from '../month-view.def';
import { injectStyleTag } from '../../utils/stylesheets';
import { EVENT_MOCK_3 } from '../../mocks/events.mocks';

export default {
    title: 'month-view/Constructor Options',
} as Meta;

const Template: StoryFn = (args): HTMLElement => {
    const { refRoot, monthView } = getMonthViewDefaultTemplate({
        monthOptions: args,
    });

    monthView.setEvents(EVENT_MOCK_3);

    return refRoot;
};

const TemplateClassNames: StoryFn = (args): HTMLElement => {
    const { refRoot, monthView } = getMonthViewDefaultTemplate({
        monthOptions: args,
    });

    const cssText = `
        .test-event {
            position: absolute;
            right: 50%;
            bottom: -4px;
            left: 50%;
            background-color: blue;
            width: 6px;
            height: 6px;
            transform: translate(-50%, -50%);
            border-radius: 50%;
        }
        .test-header-row {
            background-color: rgb(221, 226, 230);
        }
        .test-row {
            padding: 4px 0;
            font-family: sans-serif;
        }
        .test-row:not(:first-child) {
            border-top: 1px solid #c5c5c5;
        }
        .test-row-selected {
            position: relative;
        }
        .test-row-selected > * {
            position: relative;
            z-index: 1;
        }
        .test-row-selected::before {
            position: absolute;
            inset: 4px;
            z-index: 0;
            content: '';
            background-color: rgba(221, 226, 230, .5);
            border: 1px dashed #c5c5c5;
            border-radius: 4px;
        }
        .test-header-cell {
            font-weight: bold;
            text-transform: uppercase;
            font-size: .65rem;
        }
        .test-cell {
            position: relative;
            height: 100%;
            outline: none;
        }
        .test-cell:hover .test-day-number {
            border: 1px solid blue;
        }
        .test-row:not(.test-header-row) .test-cell:not(:first-child) {
            border-left: 1px solid #c5c5c5;
        }
        .test-cell-current-date .test-day-number {
            background-color: rgba(233, 181, 1, 0.1);
            border: 1px solid rgb(233, 181, 1);
        }
        .test-cell-selected-date .test-day-number {
            border: 1px solid blue;
        }
        .test-today-cell {
            background-color: rgba(233, 181, 1, 0.1);
        }
        .test-weekend-cell {
            font-weight: bold;
        }
        .test-day-number {
            transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            font-size: .75rem;
            border: 1px solid rgba(255, 255, 255, 0);
            border-radius: 50px;
        }
        .test-day-out-of-month {
            background-color: rgba(255, 99, 71, 0.1);
        }
    `;

    injectStyleTag('styleTagTestClassMonthView', cssText);

    monthView.setEvents(EVENT_MOCK_3);

    return refRoot;
};

export const ClassNames = TemplateClassNames.bind({});

ClassNames.args = {
    classNames: {
        event: 'test-event',
        headerRow: 'test-header-row',
        row: 'test-row',
        rowSelected: 'test-row-selected',
        headerCell: 'test-header-cell',
        cell: 'test-cell',
        cellCurrentDate: 'test-cell-current-date',
        cellSelectedDate: 'test-cell-selected-date',
        todayCell: 'test-today-cell',
        weekendCell: 'test-weekend-cell',
        dayNumber: 'test-day-number',
        dayOutMonth: 'test-day-out-of-month',
    } as B5rMonthClassNames,
};
ClassNames.storyName = 'options.classNames';

export const DesignTokens = Template.bind({});
DesignTokens.args = {
    designTokens: {
        ['--background']: '#d6d6d6',
        ['--cell-height']: '20px',
        ['--cell-align-items']: 'center',
        ['--cell-padding']: '4px',
        ['--day-min-width']: '15px',
        ['--day-min-height']: '15px',
        ['--day-border-radius']: '4px',
        ['--day-border']: '1px solid blue',
        ['--day-color']: '#2a2a2a',
        ['--day-color-hover']: 'yellow',
        ['--day-color-focus']: 'yellow',
        ['--day-color-active']: 'yellow',
        ['--day-background']: 'orange',
        ['--day-background-hover']: '#ffb700',
        ['--day-background-focus']: '#ffb700',
        ['--day-background-active']: '#ffb700',
        ['--day-outside-month-color']: 'grey',
        ['--day-outside-month-background']: 'white',
        ['--day-outside-month-border']: 'none',
        ['--selected-day-color']: 'green',
        ['--selected-day-background']: '#B7F9B2',
        ['--selected-day-border']: '2px solid green',
        ['--current-day-color']: '#DA0000',
        ['--current-day-background']: '#FF9E9E',
        ['--current-day-border']: '2px solid #FF0000',
        ['--today-color']: 'blue',
        ['--today-background']: '#60ccfa',
        ['--today-border']: '2px solid blue',
        ['--row-background']: '#FAC9E6',
        ['--selected-row-background']: '#a4ec5d',
        ['--header-background']: '#e88fc9',
        ['--cell-selected-color']: '#000FFF',
        ['--cell-selected-background']: '#9BF7FF',
    },
};

DesignTokens.storyName = 'options.designTokens';
