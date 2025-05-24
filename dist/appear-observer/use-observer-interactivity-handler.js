import { useCallback, useEffect, useRef } from 'react';
export const useObserverInteractivityHandler = ({ interactionModeEnabled, onInteractionStart, onInteractionEnd, onStateUpdate }) => {
    const isInitialMeasurement = useRef(true);
    const idleModeTimeout = useRef(null);
    const resetTimeout = useCallback(() => {
        idleModeTimeout.current && clearTimeout(idleModeTimeout.current);
    }, []);
    const resetInteractivityHandler = useCallback(() => {
        resetTimeout();
        isInitialMeasurement.current = true;
    }, [resetTimeout]);
    useEffect(() => {
        if (interactionModeEnabled) {
            const unsubscribeStart = onInteractionStart(() => {
                resetTimeout();
                onStateUpdate(true);
            });
            const unsubscribeEnd = onInteractionEnd(() => {
                // Other interaction endings reset timeout started on previous ones
                // E.g. onMomentumScrollEnds resets timeout from onTouchEnd
                resetTimeout();
                idleModeTimeout.current = setTimeout(() => {
                    onStateUpdate(false);
                }, 5000);
            });
            return () => {
                unsubscribeStart();
                unsubscribeEnd();
            };
        }
    }, [
        interactionModeEnabled,
        onInteractionStart,
        onInteractionEnd,
        resetTimeout,
        onStateUpdate
    ]);
    useEffect(() => {
        return () => resetTimeout();
    }, [resetTimeout]);
    const onVisibilityChange = useCallback(() => {
        if (interactionModeEnabled) {
            if (isInitialMeasurement.current) {
                onStateUpdate(false);
            }
            isInitialMeasurement.current = false;
        }
    }, [interactionModeEnabled, onStateUpdate]);
    return {
        onVisibilityChange,
        resetInteractivityHandler
    };
};
