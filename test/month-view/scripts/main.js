import { B5rMonthView } from '../../../lib/month-view.esm.js';
import { EVENTS_MOCKS } from '../../../lib/mocks/events.mocks.esm.js';

console.log(EVENTS_MOCKS);

const refNextButton = document.getElementById('nextButton');
const refPreviousButton = document.getElementById('previousButton');
const refTodayButton = document.getElementById('todayButton');

const monthView = new B5rMonthView(
    document.getElementById('calendar'),
    EVENTS_MOCKS,
    {
        currentDate: new Date(),
        classNames: {
            event: 'style-1-event',
            title: 'style-1-event-title',
            subtitle: 'style-1-event-subtitle',
        },
    }
);

refNextButton.addEventListener('click', () => {
    monthView.next();
});

refPreviousButton.addEventListener('click', () => {
    monthView.previous();
});

refTodayButton.addEventListener('click', () => {
    monthView.today();
});
