import { ElementBoundaries } from '../core';
import { InteractionListeners } from '../utils';
import { AppearObserverOptions, AppearObserverProps } from './types';
type ObserverConfiguration = Omit<AppearObserverProps, 'options' | 'interactionListeners'> & {
    options: Omit<Required<AppearObserverOptions>, 'parentOffsets'> & {
        parentOffsets: ElementBoundaries;
    };
    interactionListeners: Required<InteractionListeners>;
};
export declare const useObserverConfiguration: ({ elementRef, parentRef, onAppear, onDisappear, onEnable, onDisable, enabled, interactionListeners, options }: AppearObserverProps) => ObserverConfiguration;
export {};
