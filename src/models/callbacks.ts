import { B5rEvent } from './event';

export type B5rViewUpdateCallbacks = () => void;

export type B5rEventClickCallback = (
    pointerEvent: PointerEvent,
    eventClicked: B5rEvent
) => void;

export interface B5rCallbacks {
    viewUpdateCallbacks: B5rViewUpdateCallbacks[];
    eventClickCallbacks: B5rEventClickCallback[];
}
