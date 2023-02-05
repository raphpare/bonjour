import { B5rEvent } from './event';

export type B5rUpdateCallback = () => void;

export type B5rEventClickCallback = (
    pointerEvent: PointerEvent,
    eventClicked: B5rEvent
) => void;

export interface B5rCallbacks {
    updateCallbacks: B5rUpdateCallback[];
    eventClickCallbacks: B5rEventClickCallback[];
}
