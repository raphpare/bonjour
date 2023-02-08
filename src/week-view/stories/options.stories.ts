import { Meta, StoryFn } from '@storybook/html';
import {
    B5rWeekClassName,
    B5rWeekOptions,
    B5rWeekViewMode,
} from '../week-view.def';
import { DEFAULT_OPTIONS } from '../week-view.utils';
import { getWeekViewDefaultTemplate } from './commons';

const argsTypeMode = {
    control: 'select',
    options: Object.values(B5rWeekViewMode),
};

export default {
    title: 'week-view/Constructor Options',
} as Meta<B5rWeekOptions>;

const dateNow = new Date();

const Template: StoryFn<B5rWeekOptions> = (args): HTMLElement => {
    const { refRoot } = getWeekViewDefaultTemplate({
        weekOptions: args,
    });

    return refRoot;
};

export const Default = Template.bind({});
Default.argTypes = {
    mode: argsTypeMode,
};
Default.args = {
    ...DEFAULT_OPTIONS,
};

export const Mode = Template.bind({});
Mode.argTypes = {
    mode: argsTypeMode,
};
Mode.args = {
    mode: B5rWeekViewMode.ThreeDays,
};

export const CurrentDate = Template.bind({});
CurrentDate.args = {
    currentDate: new Date(dateNow.setDate(dateNow.getDate() + 7)),
};

export const Locale = Template.bind({});
Locale.args = {
    locale: 'ja',
};

export const TimeZone = Template.bind({});
TimeZone.args = {
    timeZone: 'America/Los_Angeles',
};

export const DesignTokens = Template.bind({});
DesignTokens.args = {
    designTokens: {
        ['--time-area-width']: '50px',
        ['--hour-height']: '10px',
        ['--border-color']: 'blue',
        ['--weekend-background']: 'yellow',
        ['--today-background']: 'red',
        ['--background']: '#ecffd7',
    },
};

const TemplateClassNames: StoryFn<B5rWeekOptions> = (args): HTMLElement => {
    const { refRoot } = getWeekViewDefaultTemplate({
        showBtnToday: true,
        showBtnNext: true,
        showBtnPrevious: true,
        weekOptions: args,
    });

    const cssText = `
        .test-class__header {
            transform: translate(0, -10px);
        }

        .test-class__body {
            max-height: 280px;
            overflow: auto;
        }

        .test-class__header-column {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #eefff9;
        }

        .test-class__header-column.test-class--today,
        .test-class__header-column.test-class--weekend  {
            flex-direction: column;
        }

        .test-class__header-column.test-class--today {
            background: #ffeef7;
        }

        .test-class__header-column.test-class--weekend  {
            background: #dadada;
        }

        .test-class__header-day-number {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 34px;
            height: 34px;
            border: 1px solid #868686;
        }

        .test-class__header-day-number.test-class--weekend  {
            border-radius: 3px;
            transform: rotate(20deg);
        }

        .test-class__header-day-number.test-class--today {
            border-color: #000;
            border-radius: 50%;
            background: #000;
            color: #fff;
        }

        .test-class__header-day-name.test-class--weekend {
            font-weight: bold;
            transform: rotate(-5deg);
        }

        .test-class__header-day-name.test-class--today {
            font-weight: bold;
            font-family: sans-serif;
        }

        .test-class__header-day-week.test-class--today {
            border: 1px solid #868686;
        }

        .test-class__body-column {
            background: #c0ffe8;
        }

        .test-class__body-column.test-class--today {
            background: #fcd6ea;
        }

        .test-class__body-column.test-class--weekend {
            background: #b8b8b8;
        }
    `;

    const styleTagId = 'styleTagTestClassWeekView';
    if (!document.getElementById(styleTagId)) {
        document.head.insertAdjacentHTML(
            'beforeend',
            `<style id="${styleTagId}">${cssText}</style>`
        );
    }

    return refRoot;
};

export const ClassNames = TemplateClassNames.bind({});
ClassNames.args = {
    classNames: {
        header: 'test-class__header',
        body: 'test-class__body',
        headerColumn: 'test-class__header-column',
        headerDayNumber: 'test-class__header-day-number',
        headerDayName: 'test-class__header-day-name',
        bodyColumn: 'test-class__body-column',
        todayModifier: 'test-class--today',
        weekendModifier: 'test-class--weekend',
    } as B5rWeekClassName,
};
