import { Meta, StoryFn } from '@storybook/html';

export default {
    title: 'home',
} as Meta;

const TemplateSetEvents: StoryFn = (_args): HTMLElement => {
    const refH1 = document.createElement('h1');
    refH1.innerHTML = 'Welcome to Bonjour.js';
    return refH1;
};

export const Welcome = TemplateSetEvents.bind({});
