/**
 * Generates a random UUID (Universally Unique Identifier).
 * @returns A string representation of the generated UUID.
 */
export const generateUuid = (): string =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
