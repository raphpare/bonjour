import {
    addClassOnElement,
    removeClassOnElement,
    addDesignTokenOnElement,
} from './dom.utils';

describe('utils/dom', () => {
    describe('addClassOnElement', () => {
        it('should add the specified class to the element', () => {
            const element = document.createElement('div');
            const className = 'test-class';

            addClassOnElement(element, className);

            expect(element.classList.contains(className)).toBe(true);
        });

        it('should not add the class if the element or className is not provided', () => {
            const element = document.createElement('div');
            const className = 'test-class';

            addClassOnElement(null as unknown as HTMLElement, className);
            addClassOnElement(element, '');

            expect(element.classList.contains(className)).toBe(false);
        });
    });

    describe('removeClassOnElement', () => {
        it('should remove the specified class from the element', () => {
            const element = document.createElement('div');
            const className = 'test-class';

            element.classList.add(className);

            removeClassOnElement(element, className);

            expect(element.classList.contains(className)).toBe(false);
        });

        it('should not remove the class if the element or className is not provided', () => {
            const element = document.createElement('div');
            const className = 'test-class';

            element.classList.add(className);

            removeClassOnElement(null as unknown as HTMLElement, className);
            removeClassOnElement(element, '');

            expect(element.classList.contains(className)).toBe(true);
        });
    });

    describe('addDesignTokenOnElement', () => {
        it('should set the specified design tokens as style properties on the element', () => {
            const element = document.createElement('div');
            const designTokens = {
                '--color': 'red',
                '--font-size': '16px',
            };

            addDesignTokenOnElement(element, designTokens);

            expect(element.style.getPropertyValue('--color')).toBe('red');
            expect(element.style.getPropertyValue('--font-size')).toBe('16px');
        });

        it('should not set the design tokens if the element or designTokens is not provided', () => {
            const element = document.createElement('div');
            const designTokens = {
                '--color': 'red',
                '--font-size': '16px',
            };

            addDesignTokenOnElement(element, designTokens);
            addDesignTokenOnElement(
                null as unknown as HTMLElement,
                designTokens
            );
            addDesignTokenOnElement(element, {});

            expect(element.style.getPropertyValue('--color')).toBe('red');
            expect(element.style.getPropertyValue('--font-size')).toBe('16px');
        });
    });
});
