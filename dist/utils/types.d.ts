import { ViewProps } from 'react-native';
import { VoidCallback } from '../core';
type TouchInteractionHandlerTypes = 'onTouchStart' | 'onTouchEnd' | 'onTouchMove' | 'onTouchCancel';
export type InteractionHandlers = Partial<Pick<ViewProps, TouchInteractionHandlerTypes>>;
export interface InteractionListeners {
    readonly onInteractionStart: (callback: VoidCallback) => VoidCallback;
    readonly onInteractionEnd: (callback: VoidCallback) => VoidCallback;
}
export interface InteractionRecorders {
    readonly recordInteractionStart: VoidCallback;
    readonly recordInteractionEnd: VoidCallback;
}
export interface InteractionManagerData {
    readonly interactionHandlers: InteractionHandlers;
    readonly interactionListeners: InteractionListeners;
    readonly interactionRecorders: InteractionRecorders;
}
export type ObservableElementProps = Partial<Pick<ViewProps, 'onLayout' | 'collapsable'>>;
export {};
