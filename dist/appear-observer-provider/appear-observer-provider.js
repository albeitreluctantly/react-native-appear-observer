import { createContext, useContext, useMemo } from 'react';
import { View } from 'react-native';
import { noop } from '../core';
import { useInteractionManager } from '../utils';
export const AppearObserverContext = createContext({
    interactionModeEnabled: true,
    onInteractionStart: () => noop,
    onInteractionEnd: () => noop
});
export const AppearObserverProvider = ({ enableInteractionMode = true, children }) => {
    const { interactionHandlers, interactionListeners } = useInteractionManager();
    const value = useMemo(() => ({
        interactionModeEnabled: enableInteractionMode,
        ...interactionListeners
    }), [enableInteractionMode, interactionListeners]);
    const touchProps = enableInteractionMode ? interactionHandlers : {};
    return (<AppearObserverContext.Provider value={value}>
      <View style={{ flex: 1 }} {...touchProps}>
        {children}
      </View>
    </AppearObserverContext.Provider>);
};
export const useAppearObserverProvider = () => useContext(AppearObserverContext);
