import { Meta, StoryFn } from '@storybook/html';
import { injectStyleTag } from '../../utils/stylesheets';
import {
    B5rWeekClassNames,
    B5rWeekOptions,
    B5rWeekViewMode,
} from '../week-view.def';
import { DEFAULT_OPTIONS } from '../week-view.utils';
import { argsTypeMode, getWeekViewDefaultTemplate } from './commons';

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
Default.storyName = 'Default Options';

export const CurrentDate = Template.bind({});
CurrentDate.args = {
    currentDate: new Date(dateNow.setDate(dateNow.getDate() + 7)),
};
CurrentDate.storyName = 'options.currentDate';

export const Locale = Template.bind({});
Locale.args = {
    locale: 'ja',
};
Locale.storyName = 'options.locale';

export const TimeZone = Template.bind({});
TimeZone.args = {
    timeZone: 'America/Los_Angeles',
};
TimeZone.storyName = 'options.timeZone';

export const Mode = Template.bind({});
Mode.argTypes = {
    mode: argsTypeMode,
};
Mode.args = {
    mode: B5rWeekViewMode.ThreeDays,
};
Mode.storyName = 'options.mode';

export const DesignTokens = Template.bind({});
DesignTokens.args = {
    designTokens: {
        ['--time-area-width']: '150px',
        ['--hour-height']: '80px',
        ['--border-color']: 'blue',
        ['--weekend-background']: 'yellow',
        ['--today-background']: 'red',
        ['--background']: '#ecffd7',
        ['--current-time-color']: 'green',
        ['--current-time-size']: '6px',
        ['--header-position-top']: '100px',
    },
};
DesignTokens.storyName = 'options.designTokens';

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

        .test-class__header-day {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 34px;
            height: 34px;
            border: 1px solid #868686;
        }

        .test-class__header-day.test-class--weekend  {
            border-radius: 3px;
            transform: rotate(20deg);
        }

        .test-class__header-day.test-class--today {
            border-color: #000;
            border-radius: 50%;
            background: #000;
            color: #fff;
        }

        .test-class__header-weekday.test-class--weekend {
            font-weight: bold;
            transform: rotate(-5deg);
        }

        .test-class__header-weekday.test-class--today {
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

    injectStyleTag('styleTagTestClassWeekView', cssText);

    return refRoot;
};

export const ClassNames = TemplateClassNames.bind({});
ClassNames.args = {
    classNames: {
        header: 'test-class__header',
        body: 'test-class__body',
        headerColumn: 'test-class__header-column',
        headerDay: 'test-class__header-day',
        headerWeekday: 'test-class__header-weekday',
        bodyColumn: 'test-class__body-column',
        todayModifier: 'test-class--today',
        weekendModifier: 'test-class--weekend',
    } as B5rWeekClassNames,
};
ClassNames.storyName = 'options.classNames';
