export const EVENTS_MOCK = [
    {
        id: 'ABC',
        title: 'A',
        subtitle: 'sub',
        classNames: {
            event: 'TEST-CLASS'
        },
        ariaLabel: 'text',
        disabled: true,
        dateRange: {
            start: new Date('2020-02-01T10:00:00'),
            end: new Date(new Date().setHours(new Date().getHours() + 10))
        }
    },
    {
        id: 'sd53ms4dg',
        title: 'Event A',
        classNames: {
            title: 'title-small'
        },
        dateRange: {
            start: new Date(new Date().setHours(new Date().getHours() - 6)),
            end: new Date(new Date().setHours(new Date().getHours() + 2))
        },
        allDay: true,
    },
    {
        id: '28g33e6',
        title: 'C-',
        dateRange: {
            start: new Date(new Date().setHours(new Date().getHours() - 5)),
            end: new Date(new Date().setHours(new Date().getHours() - 4))
        }
    },
    {
        id: 'vda6',
        title: 'C',
        dateRange: {
            start: new Date(new Date().setHours(new Date().getHours() - 6)),
            end: new Date(new Date().setHours(new Date().getHours() - 4))
        }
    },
    {
        id: '06-22ed4-ffdd',
        title: 'B',
        classNames: {
            event: 'TEST-CLASS'
        },
        dateRange: {
            start: new Date(new Date().setHours(new Date().getHours() - 2)),
            end: new Date(new Date().setHours(new Date().getHours() + 1))
        }
    },
    {
        id: '4f76dw5ga',
        title: 'B-1',
        dateRange: {
            start: new Date(new Date().setHours(new Date().getHours() - 2)),
            end: new Date(new Date().setHours(new Date().getHours() + 1))
        }
    },
    {
        id: 'f76dw0a',
        title: 'Event B-2',
        classNames: {
            event: 'TEST-CLASS'
        },
        dateRange: {
            start: new Date(new Date().setHours(new Date().getHours() - 1)),
            end: new Date(new Date().setHours(new Date().getHours() + 1))
        }
    },
    {
        id: 'aaa',
        title: 'B-3',
        dateRange: {
            start: new Date(new Date().setHours(new Date().getHours() - 24)),
            end: new Date(new Date().setHours(new Date().getHours() + 10074))
        }
    },
    
    {
        id: '3de6jtgsd',
        title: 'Event D',
        dateRange: {
            start: new Date('2022-04-04 12:30:30'),
            end: new Date('2022-04-04 15:30:30')
        }
    },
    {
        id: '3de6jtgsd',
        title: 'Event D',
        dateRange: {
            start: new Date('2022-04-04 12:30:30'),
            end: new Date('2022-04-04 15:30:30')
        }
    },
    {
        id: '2ydf5r46',
        title: 'Event E',
        dateRange: {
            start: new Date('2021-06-06 12:30:30'),
            end: new Date('2021-06-06 15:30:30')
        }
    },
    {
        id: '427ssits68hg',
        title: 'Event F',
        dateRange: {
            start: new Date(),
            end: new Date('2022-06-25 12:30:30')
        },
        allDay: true,
    },
    {
        id: '5sfg6gf',
        title: 'Event G',
        dateRange: {
            start: new Date(),
            end: new Date()
        },
        allDay: true,
    },
    {
        id: '5frge6rdsh',
        title: 'Event H',
        dateRange: {
            start: new Date('2021-06-10 12:30:30'),
            end: new Date()
        },
        allDay: true,
    },
];

export const EVENTS_MOCK_2 = [
    {
        id: '6sdtymhfg',
        title: 'Event A',
        dateRange: {
            start: new Date(),
            end: new Date(new Date().setHours(new Date().getHours() + 2))
        }
    },
    {
        id: '7jvusutc',
        title: 'Event E',
        dateRange: {
            start: new Date('2021-06-10 12:30:30'),
            end: new Date('2021-06-14 15:30:30')
        }
    },
];