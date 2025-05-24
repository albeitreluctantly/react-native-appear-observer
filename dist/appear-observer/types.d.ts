import { AnyElementRef, ElementBoundaries, VoidCallback } from '../core';
import { InteractionListeners } from '../utils';
export interface AppearObserverProps {
    readonly elementRef?: AnyElementRef;
    readonly onAppear?: VoidCallback;
    readonly onDisappear?: VoidCallback;
    readonly parentRef?: AnyElementRef;
    readonly onEnable?: VoidCallback;
    readonly onDisable?: VoidCallback;
    readonly enabled?: boolean;
    readonly options?: AppearObserverOptions;
    readonly interactionListeners?: InteractionListeners;
}
export interface AppearObserverOptions {
    readonly visibilityThreshold?: number;
    readonly intervalDelay?: number;
    readonly recalculateParentBoundaries?: boolean;
    readonly interactionModeEnabled?: boolean;
    readonly parentOffsets?: Partial<ElementBoundaries>;
    readonly useScreenIfNoParent?: boolean;
    readonly optimizeOutOfScreen?: boolean;
}
export interface ObserverInteractivityHandlerProps extends InteractionListeners {
    readonly interactionModeEnabled: boolean;
    readonly onStateUpdate: (isActive: boolean) => void;
}
