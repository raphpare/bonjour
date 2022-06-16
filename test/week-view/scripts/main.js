import { BjWeekView } from '../../../../lib/index.esm.js';
import { EVENTS_MOCK } from '../../mocks/events.mocks.js';

const bonjourWeekView = new BjWeekView(
    document.getElementById('calendar'), 
    { 
        mode: '7-day',
        currentDate: new Date(),
        classNames: {
            event: {
                title: 'style-1-event-title',
                subtitle: 'style-1-event-subtitle',
            },
            body: 'style-body',
            header: 'style-header',
            headerColumn: 'style-header-column',
            headerDay: 'style-header-day',
            headerMonth: 'style-header-month',
            today: {
                headerColumn: 'style-header-column--today',
                headerDay: 'style-header-day--today',
                headerMonth: 'style-header-month--today',
            }
        },
        customProperties: {
            '--background-weekend': 'rgb(245, 245, 245)',
            '--border-color': 'rgb(220, 220, 220)'
        },
        callbacks: {
            updated: setTextCurrentDateRange,
            eventOnClick: (e, event) => {
                console.log('test-eventOnClick', e, event);
            }
        }
    }
);


console.log('Loading events...');
setTimeout(() => {
    bonjourWeekView.setEvents(EVENTS_MOCK).then(() => {
        console.log('Events are displayed');
    });
}, 10);


const refPreviousButton = document.getElementById('previousButton');
const refNextButton = document.getElementById('nextButton');
const refCurrentDateRange = document.getElementById('currentDateRange');
const refLangueSelect = document.getElementById('langueSelect');
const refTodayButton = document.getElementById('todayButton');
const refModeSelect = document.getElementById('mode');


refPreviousButton.addEventListener('click', () => bonjourWeekView.goToLastWeek());
refNextButton.addEventListener('click', () => bonjourWeekView.goToNextWeek());

refTodayButton.addEventListener('click', () => {
    console.log('Click on today button');
    bonjourWeekView.goToToday().then((res) => {
        console.log('Today view is displayed', res)
    });
});

refLangueSelect.addEventListener('change', (e) => {
    bonjourWeekView.local = e.target.value;
});

refModeSelect.addEventListener('change', () => {
    bonjourWeekView.mode = refModeSelect.value;
});

function setTextCurrentDateRange() {
    const start = bonjourWeekView.fullDatesOfWeek[0].toLocaleString('fr-CA', {  year: 'numeric', month: 'long', day: 'numeric' });
    const end = bonjourWeekView.fullDatesOfWeek[bonjourWeekView.fullDatesOfWeek.length - 1].toLocaleString('fr-CA', {  year: 'numeric', month: 'long', day: 'numeric' });
    refCurrentDateRange.innerHTML = start === end ? start : `${start} - ${end}`;
}

setTextCurrentDateRange();