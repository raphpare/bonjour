import { BjWeekView } from '../../../../lib/week-view.esm.js';

// Variable: Initial week options
const refModeInitialOption = document.getElementById('modeInitialOption');
const refCurrentDate = document.getElementById('currentDate');
const refCode = document.getElementById('code');
const refCustomCSSPropertiesInit = document.querySelectorAll('.custom-properties-init');

// Variable: Methods
const refPreviousButton = document.getElementById('previousButton');
const refNextButton = document.getElementById('nextButton');
const refTodayButton = document.getElementById('todayButton');
const refEventsExample =  document.getElementById('eventsExemple');
const refSetEventsButton = document.getElementById('setEventsButton');
const refDestoyButton = document.getElementById('destoyButton');

const refModeAttribute =  document.getElementById('modeAttribute');
const refLocalAttribute =  document.getElementById('localAttribute');
const refDatesDisplayedAttribute = document.getElementById('datesDisplayedAttribute');

const eventsExemple = [
    {
        id: '1',
        title: 'Event 1',
        subtitle: 'Subtitle',
        dateRange: {
            start: new Date(),
            end: new Date(new Date().setHours(new Date().getHours() + 1))
        },
    },
    {
        id: '2',
        title: 'Event 2',
        dateRange: {
            start: new Date(new Date().setHours(new Date().getHours())),
            end: new Date(new Date().setHours(new Date().getHours() + 3))
        }
    },
    {
        id: '3',
        title: 'Event 3',
        dateRange: {
            start: new Date(new Date().setHours(new Date().getHours() + 2)),
            end: new Date(new Date().setHours(new Date().getHours() + 4))
        }
    },
    {
        id: '4',
        title: 'Event 4',
        subtitle: 'subtitle',
        dateRange: {
            start: new Date(new Date().setHours(new Date().getHours() - 9)),
            end: new Date(new Date().setHours(new Date().getHours() - 8))
        }
    },
    {
        id: '5',
        title: 'Event 5',
        subtitle: 'subtitle',
        dateRange: {
            start: new Date(new Date().setDate(new Date().getDate() - 1)),
            end: new Date(new Date().setHours(new Date().getHours() - 20))
        }
    },
    
];

let weekView = null;

const options = {
    callbacks: {
        updated: () => {
            console.log('view update');
            setDatesDisplayed();
        },
        eventOnClick: (ponterEvent, event) => {
            console.log(ponterEvent, event);
        }
    }
};

const setOptionMode = (mode) => {
    options.mode = mode === '' ? undefined : mode;
    updateWeekView();
}

const setOptionCurrentDate = (currentDate) => {
    options.currentDate = new Date(currentDate);
    updateWeekView();
}

function cleanIt(obj) {
    const cleaned = JSON.stringify(obj, null, 4);
    return cleaned.replace(/^[\t ]*"[^:\n\r]+(?<!\\)":/gm, (match) => match.replace(/"/g, ''));
}

const setDatesDisplayed = () => {
    refDatesDisplayedAttribute.innerHTML = cleanIt(weekView.datesDisplayed);
}

const updateWeekView = () => {
    if(weekView) {
        weekView.destroy()
    };

    document.getElementById('weekView').removeAttribute('style');
    
    refCode.innerHTML = `const weekView = new BjWeekView(
    document.getElementById('weekView'), ${cleanIt(options)
        .replace('callbacks: {}',`callbacks: {
        updated: () => {
            console.log('view update');
        },
        eventOnClick: (ponterEvent, event) => {
            console.log(ponterEvent, event);
        }
    }`).replace(/"/g, `'`)
        .replace(/currentDate: '[0-9:.TZ\-]{0,}'/, 
            (match) => match.replace(" '", " new Date('").replace(/'$/, "')")
        ).replace(/\-\-[a-z\-]{1,}:/g, 
            (match) => `'${match.replace(':' ,'')}':`
        )
    });`

    weekView = new BjWeekView(
        document.getElementById('weekView'), 
        options,
    );
}

const disabledInitialWeekOptions = (callback) => {
    refModeInitialOption.disabled = true;
    refCurrentDate.disabled = true;
    Array.from(refCustomCSSPropertiesInit).forEach((el) => {
        const refInput = el.querySelector('input');
        refInput.disabled = true;
    });

    document.getElementById('initialWeekOptions').hidden = true;

    callback;
}

const setEvent = () => {
    weekView.setEvents(eventsExemple).then(() => {
        console.log('Events are displayed');
    });
}


updateWeekView();
refModeInitialOption.addEventListener('change', () => setOptionMode(refModeInitialOption.value));
refCurrentDate.addEventListener('change', () => setOptionCurrentDate(refCurrentDate.value));

refSetEventsButton.addEventListener('click', () => disabledInitialWeekOptions(weekView.setEvents(eventsExemple)));
refTodayButton.addEventListener('click', () => disabledInitialWeekOptions(weekView.goToToday()));
refPreviousButton.addEventListener('click', () => disabledInitialWeekOptions(weekView.goToPreviousDate()));
refNextButton.addEventListener('click', () => disabledInitialWeekOptions(weekView.goToNextDate()));
refDestoyButton.addEventListener('click', () => disabledInitialWeekOptions(weekView.destroy()));

Array.from(refCustomCSSPropertiesInit).forEach((el) => {
    const refInput = el.querySelector('input');
    const refLabel = el.querySelector('label');
    refInput.addEventListener('change', () => {
        if (!options.customCSSProperties) {
            options.customCSSProperties = {};
        }
        options.customCSSProperties[refLabel.innerText] = refInput.value ? refInput.value : undefined;

        if (!Object.values(options.customCSSProperties).some(v => v !== undefined)) {
            delete options.customCSSProperties;
        }
        updateWeekView();
    });
});

refLocalAttribute.addEventListener('change', () => {
   weekView.local = refLocalAttribute.value;
});
refLocalAttribute.value = weekView.local;

refModeAttribute.addEventListener('change', () => {
    weekView.mode = refModeAttribute.value;
});
refModeAttribute.value = weekView.mode;

refEventsExample.innerHTML = `weekView.setEvent(${cleanIt(eventsExemple)});`;

setDatesDisplayed();