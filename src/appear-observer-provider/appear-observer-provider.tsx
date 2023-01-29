import {
  createContext,
  createRef,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef
} from 'react'
import { PanResponder, View } from 'react-native'
import { noop, VoidCallback } from '../core'
import {
  AppearObserverProviderProps,
  AppearObserverProviderValue
} from './types'

export const AppearObserverContext = createContext<AppearObserverProviderValue>(
  {
    parentRef: createRef(),
    interactionModeEnabled: false,
    onInteraction: () => noop
  }
)

export const AppearObserverProvider = ({
  parentRef,
  enableInteractionMode = true,
  children
}: PropsWithChildren<AppearObserverProviderProps>) => {
  const interactionListeners = useRef(new Set<VoidCallback>()).current

  const onPanResponderCapture = useCallback(() => {
    if (interactionListeners.size) {
      interactionListeners.forEach(listener => listener())
    }
    return false
  }, [interactionListeners])

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: () => false,
      onShouldBlockNativeResponder: () => false,
      onStartShouldSetPanResponderCapture: onPanResponderCapture,
      onMoveShouldSetPanResponderCapture: onPanResponderCapture
    })
  ).current

  const onInteraction = useCallback(
    (callback: VoidCallback) => {
      interactionListeners.add(callback)

      return () => interactionListeners.delete(callback)
    },
    [interactionListeners]
  )

  const value: AppearObserverProviderValue = useMemo(
    () => ({
      parentRef,
      interactionModeEnabled: enableInteractionMode,
      onInteraction
    }),
    [enableInteractionMode, onInteraction, parentRef]
  )

  let childComponent = children

  if (enableInteractionMode) {
    childComponent = <View {...panResponder.panHandlers}>{children}</View>
  }

  return (
    <AppearObserverContext.Provider value={value}>
      {childComponent}
    </AppearObserverContext.Provider>
  )
}

export const useAppearObserverProvider = () => useContext(AppearObserverContext)
