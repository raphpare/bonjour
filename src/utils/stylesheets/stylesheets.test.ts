import { injectStyleTag } from './stylesheets.utils';

describe('utils/stylesheets', () => {
    describe('injectStyleTag', () => {
        it('should inject a style tag into the document head', () => {
            // Mock the required document functions and properties
            const getElementByIdMock = jest.spyOn(document, 'getElementById');
            getElementByIdMock.mockReturnValue(null);

            const insertAdjacentHTMLMock = jest.spyOn(
                document.head,
                'insertAdjacentHTML'
            );

            const id = 'test-id';
            const cssText = 'body { color: red; }';

            // Call the function
            injectStyleTag(id, cssText);

            // Verify the behavior and expectations
            expect(getElementByIdMock).toHaveBeenCalledWith(id);
            expect(insertAdjacentHTMLMock).toHaveBeenCalledWith(
                'beforeend',
                `<style id="${id}">${cssText}</style>`
            );

            // Restore the original functions
            getElementByIdMock.mockRestore();
            insertAdjacentHTMLMock.mockRestore();
        });
    });
});
