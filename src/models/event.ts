export interface B5rEvent {
    id: string;
    title: string;
    subtitle?: string;
    allDay?: boolean;
    dateRange: {
        start: Date;
        end: Date;
    };
    classNames?: B5rEventClassName;
    designTokens?: B5rEventDesignTokens;
    ariaLabel?: string;
    disabled?: boolean;
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
    root?: string;
    title?: string;
    subtitle?: string;
}

export interface B5rEventDesignTokens {
    ['--color']?: string;
    ['--color-hover']?: string;
    ['--color-focus']?: string;
    ['--color-active']?: string;
    ['--background']?: string;
    ['--background-hover']?: string;
    ['--background-focus']?: string;
    ['--background-active']?: string;
    ['--border-radius']?: string;
}
