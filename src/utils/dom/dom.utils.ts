/**
 * Adds a class to the specified HTML element.
 * @param element - The HTML element to add the class to.
 * @param className - The class name to add.
 */
export const addClassOnElement = (element: HTMLElement, className?: string) => {
    if (!element || !className) return;
    element.classList.add(className);
};

/**
 * Removes a class from the specified HTML element.
 * @param element - The HTML element to remove the class from.
 * @param className - The class name to remove.
 */
export const removeClassOnElement = (
    element: HTMLElement,
    className?: string
) => {
    if (!element || !className) return;
    element.classList.remove(className);
};

/**
 * Add design tokens as style properties on the specified HTML element.
 * @param element - The HTML element to set the design tokens on.
 * @param designTokens - The design tokens as key-value pairs.
 */
export const addDesignTokenOnElement = (
    element: HTMLElement,
    designTokens?: Record<string, string>
) => {
    if (!element || !designTokens) return;
    for (const propertie in designTokens) {
        if (designTokens[propertie]) {
            element.style.setProperty(propertie, designTokens[propertie]);
        }
    }
};
