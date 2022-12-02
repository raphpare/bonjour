export interface B5rEvent {
    id: string;
    title: string;
    subtitle?: string;
    allDay?: boolean;
    classNames?: B5rEventClassName;
    ariaLabel?: string;
    disabled?: boolean;
    dateRange: {
        start: Date;
        end: Date;
    };
}

export interface B5rInternalEvent extends B5rEvent {
    _id?: string;
    _overlapped?: {
        index: number;
        eventIds: string[];
    };
    _position?: string;
}

export interface B5rEventClassName {
    title?: string;
    subtitle?: string;
    root?: string;
}
