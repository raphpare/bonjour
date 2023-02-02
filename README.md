# Bonjour.js – B5R

Accessible and dependency-free calendar JavaScript library: import the code you need and use your UI controls.

## Install

```
$ npm i b5r-bonjour --save
```

or

```
$ yarn add b5r-bonjour
```

## WeekView Example

```HTML
<!-- Calendar -->
<div id="calendar"></div>


<!-- Your UI controls -->
<button id="btnToday">Today</button>
<button id="btnPrevious">Previous</button>
<button id="btnNext">Next</button>
<button id="btnAdd">Add event</button>
```

```TS
import { B5rWeekView } from 'b5r-bonjour';

const CalendarWeekView = new B5rWeekView(document.getElementById('calendar'), {
    mode: '7-days'
});

document.getElementById('btnToday').addEventListener('click', () => {
    CalendarWeekView.today();
});

document.getElementById('btnPrevious').addEventListener('click', () => {
    CalendarWeekView.previous();
});

document.getElementById('btnNext').addEventListener('click', () => {
    CalendarWeekView.next();
});

document.getElementById('btnAdd').addEventListener('click', () => {
    CalendarWeekView.setEvents([
        {
            id: '1',
            title: 'Event 1',
            subtitle: 'Subtitle',
            dateRange: {
                start: new Date(),
                end: new Date(new Date().setHours(new Date().getHours() + 2)),
            },
        },
    ]);
});

```

## Contribution

### Build project

```
$ yarn install
```

```
$ yarn run build
```

### Storybook

```
$ yarn install
```

```
$ yarn run storybook
```

```
http://localhost:6006/
```

### Local development

```
$ yarn install
```

```
$ yarn run dev
```

```
http://localhost:3000/
```
