# Bonjour.js – B5R

Accessible and dependency-free calendar JavaScript library: import the code you need and use your UI controls.

<img alt="b5r-bonjour Example" style="width: 100%; margin: 0 auto; max-width: 800px; margin-top: 24px;" src="https://github.com/raphpare/bonjour/blob/main/example.png?raw=true" />

## Getting Started

1. [Install](#install)
2. [Examples](#examples)
3. [Contribution](#contribution)

## Install

### npm

```
$ npm i b5r-bonjour --save
```

### Yarn

```
$ yarn add b5r-bonjour
```

## Examples

### Week View

#### HTML

```HTML
<!-- Calendar -->
<div id="calendarWeekView"></div>


<!-- Your UI controls -->
<button id="btnToday">Today</button>
<button id="btnPrevious">Previous</button>
<button id="btnNext">Next</button>
<button id="btnAdd">Add event</button>
```

#### TypeScript

```TS
import { B5rWeekView } from 'b5r-bonjour/lib/week-view';

const CalendarWeekView = new B5rWeekView(
    document.getElementById('calendarWeekView'),
    {
        mode: '7-days',
    }
);

document
    .getElementById('btnToday')
    .addEventListener('click', () => {
        CalendarWeekView.today()
    });


document
    .getElementById('btnPrevious')
    .addEventListener('click', () => {
        CalendarWeekView.previous()
    });

document
    .getElementById('btnNext')
    .addEventListener('click', () => {
        CalendarWeekView.next()
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

### Build Project

```
$ yarn install
$ yarn run build
```

### Storybook

```
$ yarn install
$ yarn run storybook
```
