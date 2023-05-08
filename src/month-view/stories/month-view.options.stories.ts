import { Meta, StoryFn } from '@storybook/html';
import { getMonthViewDefaultTemplate } from './commons';
import { B5rMonthClassNames } from '../month-view.def';
import { injectStyleTag } from '../../utils/stylesheets';

export default {
    title: 'month-view/Constructor Options',
} as Meta;

const TemplateClassNames: StoryFn = (args): HTMLElement => {
    const { refRoot } = getMonthViewDefaultTemplate({
        monthOptions: args,
    });

    const cssText = `
        .test-day {
            background-color: #ffa50069;
            color: #1b1b1b;
            margin: 2px; 
        }
        .test-today {
            background-color: #039d17;
            color: white;
        }
        .test-currentDate {
            background-color: #e20d0d;
            color: white;
        }
        .test-week-selected {
            background-color: gray;
            border: 1px solid gray;
        }
    `;

    injectStyleTag('styleTagTestClassMonthView', cssText);

    return refRoot;
};

export const ClassNames = TemplateClassNames.bind({});

ClassNames.args = {
    classNames: {
        day: 'test-day',
        todayModifier: 'test-today',
        currentDateSelected: 'test-currentDate',
        weekSelectedModifier: 'test-week-selected',
    } as B5rMonthClassNames,
};
ClassNames.storyName = 'options.classNames';
