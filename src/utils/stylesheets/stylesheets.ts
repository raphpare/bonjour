export const injectStyleTag = (id: string, cssText: string) => {
    if (!document.getElementById(id)) {
        document.head.insertAdjacentHTML(
            'beforeend',
            `<style id="${id}">${cssText}</style>`
        );
    }
};
