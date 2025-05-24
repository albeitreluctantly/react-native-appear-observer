import { useCallback, useMemo, useRef } from 'react';
export const useInteractionManager = ({ onScroll, onScrollBeginDrag, onScrollEndDrag, onMomentumScrollEnd, onTouchStart, onTouchMove, onTouchEnd, onTouchCancel } = {}) => {
    const interactionStartListeners = useRef(new Set()).current;
    const interactionEndListeners = useRef(new Set()).current;
    const onInteractionStart = useCallback((callback) => {
        interactionStartListeners.add(callback);
        return () => interactionStartListeners.delete(callback);
    }, [interactionStartListeners]);
    const onInteractionEnd = useCallback((callback) => {
        interactionEndListeners.add(callback);
        return () => interactionEndListeners.delete(callback);
    }, [interactionEndListeners]);
    const recordInteractionStart = useCallback(() => {
        if (interactionStartListeners.size) {
            interactionStartListeners.forEach(listener => listener());
        }
    }, [interactionStartListeners]);
    const recordInteractionEnd = useCallback(() => {
        if (interactionEndListeners.size) {
            interactionEndListeners.forEach(listener => listener());
        }
    }, [interactionEndListeners]);
    const interactionHandlers = useMemo(() => ({
        onScroll: event => {
            recordInteractionStart();
            onScroll?.(event);
        },
        onScrollBeginDrag: event => {
            recordInteractionStart();
            onScrollBeginDrag?.(event);
        },
        onTouchStart: event => {
            recordInteractionStart();
            onTouchStart?.(event);
        },
        onTouchMove: event => {
            recordInteractionStart();
            onTouchMove?.(event);
        },
        onScrollEndDrag: event => {
            recordInteractionEnd();
            onScrollEndDrag?.(event);
        },
        onMomentumScrollEnd: event => {
            recordInteractionEnd();
            onMomentumScrollEnd?.(event);
        },
        onTouchEnd: event => {
            recordInteractionEnd();
            onTouchEnd?.(event);
        },
        onTouchCancel: event => {
            recordInteractionEnd();
            onTouchCancel?.(event);
        }
    }), [
        recordInteractionStart,
        onScroll,
        onScrollBeginDrag,
        onTouchStart,
        onTouchMove,
        recordInteractionEnd,
        onScrollEndDrag,
        onTouchEnd,
        onTouchCancel,
        onMomentumScrollEnd
    ]);
    return {
        interactionHandlers,
        interactionListeners: {
            onInteractionStart,
            onInteractionEnd
        },
        interactionRecorders: {
            recordInteractionStart,
            recordInteractionEnd
        }
    };
};
