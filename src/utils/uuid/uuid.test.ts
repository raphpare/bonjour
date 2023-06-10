import { generateUuid } from './uuid.utils';

describe('utils/uuid', () => {
    describe('generateUuid', () => {
        it('should genrate a uuid', () => {
            const uuid = generateUuid();
            const uuidRegex =
                /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

            expect(uuid).toMatch(uuidRegex);
        });
    });
});
