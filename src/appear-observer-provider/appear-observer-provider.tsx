import { createContext, useContext, useMemo } from 'react'
import { View } from 'react-native'
import { noop } from '../core'
import { useInteractionManager } from '../utils'
import {
  AppearObserverProviderProps,
  AppearObserverProviderValue
} from './types'

export const AppearObserverContext = createContext<AppearObserverProviderValue>(
  {
    interactionModeEnabled: true,
    onInteractionStart: () => noop,
    onInteractionEnd: () => noop
  }
)

export const AppearObserverProvider = ({
  enableInteractionMode = true,
  children
}: AppearObserverProviderProps) => {
  const { interactionHandlers, interactionListeners } = useInteractionManager()

  const value: AppearObserverProviderValue = useMemo(
    () => ({
      interactionModeEnabled: enableInteractionMode,
      ...interactionListeners
    }),
    [enableInteractionMode, interactionListeners]
  )

  const touchProps = enableInteractionMode ? interactionHandlers : {}

  return (
    <AppearObserverContext.Provider value={value}>
      <View style={{ flex: 1 }} {...touchProps}>
        {children}
      </View>
    </AppearObserverContext.Provider>
  )
}

export const useAppearObserverProvider = () => useContext(AppearObserverContext)
