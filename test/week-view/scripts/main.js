import { BjWeekView } from '../../../lib/week-view.esm.js';
import { EVENTS_MOCK } from '../../mocks/events.mocks.js';

const refModeInitialOption = document.getElementById('modeInitialOption');
const refCurrentDate = document.getElementById('currentDate');
const refCode = document.getElementById('code');
const refCustomCSSPropertiesInit = document.querySelectorAll('.custom-properties-init');

const refPreviousButton = document.getElementById('previousButton');
const refNextButton = document.getElementById('nextButton');
const refTodayButton = document.getElementById('todayButton');
const refEventsData =  document.getElementById('eventsData');
const refSetEventsButton = document.getElementById('setEventsButton');
const refDestoyButton = document.getElementById('destoyButton');

const refModeAttribute =  document.getElementById('modeAttribute');
const refLocalAttribute =  document.getElementById('localAttribute');
const refCurrentDateAttribute =  document.getElementById('currentDateAttribute');
const refDatesDisplayedAttribute = document.getElementById('datesDisplayedAttribute');

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
    options.currentDate = new Date(currentDate + ' 00:00');
    updateWeekView();
}

function cleanIt(obj) {
    const cleaned = JSON.stringify(obj, null, 4);
    return cleaned.replace(/^[\t ]*"[^:\n\r]+(?<!\\)":/gm, (match) => match.replace(/"/g, ''));
}

const setDatesDisplayed = () => {
    refCurrentDateAttribute.value = weekView.currentDate.toISOString();
    refDatesDisplayedAttribute.innerHTML = cleanIt(weekView.datesDisplayed).replace(/"[A-z0-9\.\:\-]{1,}"/g, 
        (match) => `new Date('${match.replace(/"/g , '')}')`
    );
}

const updateWeekView = () => {
    if(weekView) {
        weekView.destroy();
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
    setDatesDisplayed();
   
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


updateWeekView();
refModeInitialOption.addEventListener('change', () => setOptionMode(refModeInitialOption.value));
refCurrentDate.addEventListener('change', () => setOptionCurrentDate(refCurrentDate.value));

refSetEventsButton.addEventListener('click', () => disabledInitialWeekOptions(weekView.setEvents(EVENTS_MOCK)));
refTodayButton.addEventListener('click', () => disabledInitialWeekOptions(weekView.goToToday()));
refPreviousButton.addEventListener('click', () => disabledInitialWeekOptions(weekView.previous()));
refNextButton.addEventListener('click', () => disabledInitialWeekOptions(weekView.next()));
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

refCurrentDateAttribute.addEventListener('change', () => {
    weekView.currentDate = new Date(refCurrentDateAttribute.value);
});
refCurrentDateAttribute.value = weekView.currentDate.toISOString();

refModeAttribute.addEventListener('change', () => {
    weekView.mode = refModeAttribute.value;
});
refModeAttribute.value = weekView.mode;

refEventsData.innerHTML = `weekView.setEvents(${cleanIt(EVENTS_MOCK)
    .replace(/"[0-9]{4}-[0-9]{2}-[0-9]{2}[A-z0-9\.\:\-]{1,}"/g, (match) => `new Date('${match.replace(/"/g, '')}')`)
    .replace(/"/g , `'`)
});`;

setDatesDisplayed();