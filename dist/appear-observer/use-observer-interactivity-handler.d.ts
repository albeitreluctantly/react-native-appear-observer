import { ObserverInteractivityHandlerProps } from './types';
export declare const useObserverInteractivityHandler: ({ interactionModeEnabled, onInteractionStart, onInteractionEnd, onStateUpdate }: ObserverInteractivityHandlerProps) => {
    onVisibilityChange: () => void;
    resetInteractivityHandler: () => void;
};
