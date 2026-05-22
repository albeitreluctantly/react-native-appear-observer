import { useMemo } from 'react';
import { useAppearObserverProvider } from '../appear-observer-provider';
export const useObserverConfiguration = ({ elementRef, parentRef, onAppear, onDisappear, onEnable, onDisable, enabled, interactionListeners, options }) => {
    const { interactionModeEnabled, onInteractionStart, onInteractionEnd } = useAppearObserverProvider();
    const parentOffsets = useMemo(() => {
        const defaults = defaultOptions.parentOffsets;
        const overrides = options?.parentOffsets;
        return {
            top: overrides?.top ?? defaults.top,
            right: overrides?.right ?? defaults.right,
            bottom: overrides?.bottom ?? defaults.bottom,
            left: overrides?.left ?? defaults.left
        };
    }, [
        options?.parentOffsets?.top,
        options?.parentOffsets?.right,
        options?.parentOffsets?.bottom,
        options?.parentOffsets?.left
    ]);
    return useMemo(() => ({
        elementRef,
        parentRef,
        onAppear,
        onDisappear,
        onEnable,
        onDisable,
        enabled: enabled ?? true,
        interactionListeners: {
            onInteractionStart: interactionListeners?.onInteractionStart ?? onInteractionStart,
            onInteractionEnd: interactionListeners?.onInteractionEnd ?? onInteractionEnd
        },
        options: {
            visibilityThreshold: options?.visibilityThreshold ?? defaultOptions.visibilityThreshold,
            intervalDelay: options?.intervalDelay ?? defaultOptions.intervalDelay,
            recalculateParentBoundaries: options?.recalculateParentBoundaries ??
                defaultOptions.recalculateParentBoundaries,
            interactionModeEnabled: options?.interactionModeEnabled ??
                interactionModeEnabled ??
                defaultOptions.interactionModeEnabled,
            parentOffsets,
            optimizeOutOfScreen: options?.optimizeOutOfScreen ?? defaultOptions.optimizeOutOfScreen,
            checkDetachedElements: options?.checkDetachedElements ?? defaultOptions.checkDetachedElements
        }
    }), [
        elementRef,
        enabled,
        interactionListeners?.onInteractionEnd,
        interactionListeners?.onInteractionStart,
        interactionModeEnabled,
        onAppear,
        onDisable,
        onDisappear,
        onEnable,
        onInteractionEnd,
        onInteractionStart,
        options?.interactionModeEnabled,
        options?.intervalDelay,
        options?.optimizeOutOfScreen,
        options?.recalculateParentBoundaries,
        options?.visibilityThreshold,
        options?.checkDetachedElements,
        parentRef,
        parentOffsets
    ]);
};
const defaultOptions = {
    visibilityThreshold: 0.001,
    intervalDelay: 50,
    recalculateParentBoundaries: true,
    interactionModeEnabled: true,
    parentOffsets: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    },
    optimizeOutOfScreen: true,
    checkDetachedElements: false
};
