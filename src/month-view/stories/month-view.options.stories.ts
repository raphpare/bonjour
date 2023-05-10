import { Meta, StoryFn } from '@storybook/html';
import { getMonthViewDefaultTemplate } from './commons';
import { B5rMonthClassNames } from '../month-view.def';
import { injectStyleTag } from '../../utils/stylesheets';
import { EVENT_MOCK_3_DAY } from '../../mocks/events.mocks';

export default {
    title: 'month-view/Constructor Options',
} as Meta;

const Template: StoryFn = (args): HTMLElement => {
    const { refRoot, monthView } = getMonthViewDefaultTemplate({
        monthOptions: args,
    });

    monthView.setEvents(EVENT_MOCK_3_DAY);

    return refRoot;
};

const TemplateClassNames: StoryFn = (args): HTMLElement => {
    const { refRoot, monthView } = getMonthViewDefaultTemplate({
        monthOptions: args,
    });

    const cssText = `
        .test-event {
            background-color: blue;
            border: 1px solid red;
        }
        .test-headerRow {
            background-color: purple;
        }
        .test-row {
            margin: 2px 0;
            border: 1px solid #c5c5c5;
        }
        .test-rowSelected {
            background-color: gray;
            border: 1px dashed gray;
        }
        .test-headerCell {
            font-weight: bold;
            text-transform: uppercase;
        }
        .test-cell {
            background-color: #FFC107;
            color: #777777;
            margin: 2px;
        }
        .test-cellCurrentDate {
            background-color: #e20d0d;
        }
        .test-cellSelectedDate {
            border: 1px dashed gray;
            color: white;
            background: #3a3a3a;
        }
        .test-todayCell {
            background-color: #039d17;
        }
        .test-weekendCell {
            background-color: font-weight: bold;
        }
        .test-dayNumber {
            border: 1px solid red;
            border-radius: 10px;
        }
    `;

    injectStyleTag('styleTagTestClassMonthView', cssText);

    monthView.setEvents(EVENT_MOCK_3_DAY);

    return refRoot;
};

export const ClassNames = TemplateClassNames.bind({});

ClassNames.args = {
    classNames: {
        event: 'test-event',
        headerRow: 'test-headerRow',
        row: 'test-row',
        rowSelected: 'test-rowSelected',
        headerCell: 'test-headerCell',
        cell: 'test-cell',
        cellCurrentDate: 'test-cellCurrentDate',
        cellSelectedDate: 'test-cellSelectedDate',
        todayCell: 'test-todayCell',
        weekendCell: 'test-weekendCell',
        dayNumber: 'test-dayNumber',
    } as B5rMonthClassNames,
};
ClassNames.storyName = 'options.classNames';

export const DesignTokens = Template.bind({});
DesignTokens.args = {
    designTokens: {
        ['--cell-height']: '20px',
        ['--cell-align-items']: 'center',
        ['--cell-padding']: '2px',
        ['--day-min-width']: '15px',
        ['--day-min-height']: '15px',
        ['--day-color']: '#2a2a2a',
        ['--day-color-hover']: 'yellow',
        ['--day-color-focus']: 'yellow',
        ['--day-color-active']: 'yellow',
        ['--day-background']: 'orange',
        ['--day-background-hover']: '#ffb700',
        ['--day-background-focus']: '#ffb700',
        ['--day-background-active']: '#ffb700',
        ['--day-border-radius']: '2px',
        ['--today-color']: 'blue',
        ['--today-background']: '#60ccfa',
        ['--background']: '#d6d6d6',
        ['--selected-row-background']: '#a4ec5d',
        ['--header-background']: '#e88fc9',
    },
};
