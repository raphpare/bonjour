/**
 * Injects a style tag into the document head with the specified ID and CSS text.
 * If a style tag with the same ID already exists, the function does nothing.
 * @param id - The ID of the style tag.
 * @param cssText - The CSS text to be injected.
 */
export const injectStyleTag = (id: string, cssText: string) => {
    if (document.getElementById(id)) return;

    document.head.insertAdjacentHTML(
        'beforeend',
        `<style id="${id}">${cssText}</style>`
    );
};
