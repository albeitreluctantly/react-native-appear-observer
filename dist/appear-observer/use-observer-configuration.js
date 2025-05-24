import { useMemo } from 'react';
import { useAppearObserverProvider } from '../appear-observer-provider';
export const useObserverConfiguration = ({ elementRef, parentRef, onAppear, onDisappear, onEnable, onDisable, enabled, interactionListeners, options }) => {
    const { parentRef: parentRefContext, interactionModeEnabled, parentOffsets: parentOffsetsContext, onInteractionStart, onInteractionEnd } = useAppearObserverProvider();
    const parentOffsets = options?.parentOffsets;
    const requiredParentOffsets = useMemo(() => {
        if (!parentOffsets?.top === undefined &&
            parentOffsets?.right === undefined &&
            parentOffsets?.bottom === undefined &&
            parentOffsets?.left === undefined) {
            return undefined;
        }
        return defaultOptions.parentOffsets;
    }, [
        parentOffsets?.bottom,
        parentOffsets?.left,
        parentOffsets?.right,
        parentOffsets?.top
    ]);
    return useMemo(() => ({
        elementRef,
        parentRef: parentRef || parentRefContext,
        onAppear,
        onDisappear,
        onEnable,
        onDisable,
        enabled: !parentRef &&
            (options?.useScreenIfNoParent ?? defaultOptions.useScreenIfNoParent)
            ? false
            : enabled ?? true,
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
            parentOffsets: requiredParentOffsets || parentOffsetsContext,
            optimizeOutOfScreen: options?.optimizeOutOfScreen ?? defaultOptions.optimizeOutOfScreen,
            useScreenIfNoParent: options?.useScreenIfNoParent ?? defaultOptions.useScreenIfNoParent
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
        options?.useScreenIfNoParent,
        options?.visibilityThreshold,
        parentOffsetsContext,
        parentRef,
        parentRefContext,
        requiredParentOffsets
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
    useScreenIfNoParent: false
};
