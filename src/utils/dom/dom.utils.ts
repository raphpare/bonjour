export const addClassOnElement = (element: HTMLElement, className?: string) => {
    if (!element || !className) return;
    element.classList.add(className);
};

export const removeClassOnElement = (
    element: HTMLElement,
    className?: string
) => {
    if (!element || !className) return;
    element.classList.remove(className);
};

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
