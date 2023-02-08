import { B5rEvent } from '../models/event';

export const generateDateFromNow = (
    day: number,
    heures: number = new Date().getHours(),
    minutes = 0
): Date => {
    const dateNow = new Date();
    return new Date(
        dateNow.getFullYear(),
        dateNow.getMonth(),
        dateNow.getDate() + day,
        heures,
        minutes
    );
};

export const EVENTS_MOCKS: B5rEvent[] = [
    {
        id: '1',
        title: 'Event 1',
        subtitle: 'Subtitle',
        dateRange: {
            start: generateDateFromNow(0, 10, 15),
            end: generateDateFromNow(0, 12, 15),
        },
        designTokens: {
            '--color': '#fff',
            '--color-hover': 'red',
            '--color-focus': 'blue',
            '--color-active': '#ccc',
            '--background': 'red',
            '--background-hover': 'blue',
            '--background-focus': 'green',
            '--background-active': '#000',
            '--border-radius': '20px',
        },
    },
    {
        id: '2',
        title: 'Event 2',
        dateRange: {
            start: generateDateFromNow(0, 9, 30),
            end: generateDateFromNow(0, 10, 30),
        },
    },
    {
        id: '3',
        title: 'Event 3',
        dateRange: {
            start: generateDateFromNow(0, 10),
            end: generateDateFromNow(0, 13),
        },
    },
    {
        id: '4',
        title: 'Event 4',
        subtitle: 'subtitle',
        dateRange: {
            start: generateDateFromNow(0, 16, 30),
            end: generateDateFromNow(0, 17, 30),
        },
    },
    {
        id: '5',
        title: 'Event 5',
        subtitle: 'subtitle',
        dateRange: {
            start: generateDateFromNow(-1, 16),
            end: generateDateFromNow(-1, 17),
        },
    },
    {
        id: '6',
        title: 'Event 6',
        subtitle: 'subtitle',
        dateRange: {
            start: generateDateFromNow(-2, 8),
            end: generateDateFromNow(-2, 14),
        },
    },
    {
        id: '7',
        title: 'Event 7',
        dateRange: {
            start: generateDateFromNow(-2, 11),
            end: generateDateFromNow(-2, 12),
        },
    },
    {
        id: '8',
        title: 'Event 8',
        dateRange: {
            start: generateDateFromNow(-2, 9),
            end: generateDateFromNow(-2, 13),
        },
    },
    {
        id: '9',
        title: 'Event 9',
        dateRange: {
            start: generateDateFromNow(-1, 8),
            end: generateDateFromNow(-1, 11),
        },
    },
    {
        id: '10',
        title: 'Event 10',
        dateRange: {
            start: generateDateFromNow(0, 23, 30),
            end: generateDateFromNow(1, 1),
        },
    },
    {
        id: '11',
        title: 'Event 11',
        dateRange: {
            start: generateDateFromNow(1, 20, 30),
            end: generateDateFromNow(2, 8),
        },
    },
    {
        id: '12',
        title: 'Event 12',
        dateRange: {
            start: generateDateFromNow(3, 1),
            end: generateDateFromNow(20, 5),
        },
    },
    {
        id: '13',
        title: 'Event 13',
        dateRange: {
            start: generateDateFromNow(4, 10),
            end: generateDateFromNow(10, 10),
        },
    },
    {
        id: '14',
        title: 'Event 14',
        dateRange: {
            start: generateDateFromNow(4, 8),
            end: generateDateFromNow(4, 11),
        },
    },
    {
        id: '15',
        title: 'Event 15',
        dateRange: {
            start: generateDateFromNow(4, 13),
            end: generateDateFromNow(4, 16),
        },
    },
    {
        id: '16',
        title: 'Event 16',
        allDay: true,
        dateRange: {
            start: generateDateFromNow(0, 0),
            end: generateDateFromNow(0, 0),
        },
    },
    {
        id: '17',
        title: 'Event 17',
        allDay: true,
        dateRange: {
            start: generateDateFromNow(0, 0),
            end: generateDateFromNow(2, 0),
        },
    },
    {
        id: '18',
        title: 'Event 18',
        allDay: true,
        dateRange: {
            start: generateDateFromNow(4, 0),
            end: generateDateFromNow(10, 0),
        },
    },
    {
        id: '19',
        title: 'Event 19',
        allDay: true,
        dateRange: {
            start: generateDateFromNow(-8, 0),
            end: generateDateFromNow(-4, 0),
        },
    },
    {
        id: '20',
        title: 'Event 20',
        allDay: true,
        dateRange: {
            start: generateDateFromNow(-4, 0),
            end: generateDateFromNow(-4, 0),
        },
    },
    {
        id: '21',
        title: 'Event 21',
        allDay: true,
        dateRange: {
            start: generateDateFromNow(-4, 0),
            end: generateDateFromNow(-3, 0),
        },
    },
    {
        id: '22',
        title: 'Event 22',
        allDay: true,
        dateRange: {
            start: generateDateFromNow(-3, 0),
            end: generateDateFromNow(2, 0),
        },
    },
    {
        id: '23',
        title: 'Event 23',
        allDay: true,
        dateRange: {
            start: generateDateFromNow(-3, 0),
            end: generateDateFromNow(-3, 0),
        },
    },
    {
        id: '24',
        title: 'Event 24',
        allDay: true,
        dateRange: {
            start: generateDateFromNow(-4, 0),
            end: generateDateFromNow(-3, 0),
        },
    },
    {
        id: '25',
        title: 'Event 25',
        allDay: true,
        dateRange: {
            start: generateDateFromNow(-6, 0),
            end: generateDateFromNow(-5, 0),
        },
    },
    {
        id: '26',
        title: 'Event 26',
        allDay: true,
        dateRange: {
            start: generateDateFromNow(-3, 0),
            end: generateDateFromNow(-3, 0),
        },
    },
    {
        id: '27',
        title: 'Event 27',
        allDay: true,
        dateRange: {
            start: generateDateFromNow(-6, 0),
            end: generateDateFromNow(-6, 0),
        },
    },
    {
        id: '28',
        title: 'Event 28',
        allDay: true,
        dateRange: {
            start: generateDateFromNow(-7, 0),
            end: generateDateFromNow(-6, 0),
        },
    },
    {
        id: '29',
        title: 'Event 29',
        allDay: true,
        dateRange: {
            start: generateDateFromNow(-5, 0),
            end: generateDateFromNow(-5, 0),
        },
    },
    {
        id: '30',
        title: 'Event 30',
        allDay: true,
        dateRange: {
            start: generateDateFromNow(-5, 0),
            end: generateDateFromNow(-4, 0),
        },
    },
    {
        id: '31',
        title: 'Event 31',
        allDay: true,
        dateRange: {
            start: generateDateFromNow(-5, 0),
            end: generateDateFromNow(-5, 0),
        },
    },
    {
        id: '32',
        title: 'Event 32',
        dateRange: {
            start: generateDateFromNow(20, 0),
            end: generateDateFromNow(300, 0),
        },
    },
    {
        id: '33',
        title: 'Event 33',
        dateRange: {
            start: generateDateFromNow(0, 9),
            end: generateDateFromNow(0, 18),
        },
    },
    {
        id: '34',
        title: 'Event 34',
        dateRange: {
            start: generateDateFromNow(0, 14),
            end: generateDateFromNow(0, 15, 30),
        },
    },
    {
        id: '35',
        title: 'Event 35',
        dateRange: {
            start: generateDateFromNow(0, 14),
            end: generateDateFromNow(0, 15, 30),
        },
    },
    {
        id: '36',
        title: 'Event 36',
        dateRange: {
            start: generateDateFromNow(0, 11),
            end: generateDateFromNow(0, 14, 30),
        },
    },
    {
        id: '37',
        title: 'Event 37',
        dateRange: {
            start: generateDateFromNow(0, 14),
            end: generateDateFromNow(0, 15, 30),
        },
    },
    {
        id: '38',
        title: 'Event 38',
        dateRange: {
            start: generateDateFromNow(0, 14),
            end: generateDateFromNow(0, 15, 30),
        },
    },
    {
        id: '39',
        title: 'Event 39',
        dateRange: {
            start: generateDateFromNow(0, 11),
            end: generateDateFromNow(0, 12, 30),
        },
    },
    {
        id: '40',
        title: 'Event 40',
        dateRange: {
            start: generateDateFromNow(0, 17),
            end: generateDateFromNow(0, 18, 30),
        },
    },
    {
        id: '41',
        title: 'Event 41',
        dateRange: {
            start: generateDateFromNow(0, 16, 45),
            end: generateDateFromNow(0, 17, 30),
        },
    },
];

export const EVENTS_MOCKS_2 = [
    {
        id: '6sdtymhfg',
        title: 'Event A',
        dateRange: {
            start: new Date(),
            end: new Date(new Date().setHours(new Date().getHours() + 2)),
        },
    },
    {
        id: '7jvusutc',
        title: 'Event E',
        dateRange: {
            start: new Date('2021-06-10 12:30:30'),
            end: new Date('2021-06-14 15:30:30'),
        },
    },
];
