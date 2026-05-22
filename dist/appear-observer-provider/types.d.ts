import { ReactNode } from 'react';
import { VoidCallback } from '../core';
export interface AppearObserverProviderProps {
    readonly children: ReactNode;
    readonly enableInteractionMode?: boolean;
}
export interface AppearObserverProviderValue {
    readonly interactionModeEnabled: boolean;
    readonly onInteractionStart: (callback: VoidCallback) => VoidCallback;
    readonly onInteractionEnd: (callback: VoidCallback) => VoidCallback;
}
