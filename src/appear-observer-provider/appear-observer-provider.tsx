import {
  Children,
  cloneElement,
  createContext,
  createRef,
  isValidElement,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef
} from 'react'
import { noop, VoidCallback } from '../core'
import {
  AppearObserverProviderProps,
  AppearObserverProviderValue
} from './types'

export const AppearObserverContext = createContext<AppearObserverProviderValue>(
  {
    parentRef: createRef(),
    interactionModeEnabled: false,
    onInteractionStart: () => noop,
    onInteractionEnd: () => noop
  }
)

export const AppearObserverProvider = ({
  parentRef,
  enableInteractionMode = true,
  children
}: PropsWithChildren<AppearObserverProviderProps>) => {
  const interactionStartListeners = useRef(new Set<VoidCallback>()).current
  const interactionEndListeners = useRef(new Set<VoidCallback>()).current

  const onInteractionStart = useCallback(
    (callback: VoidCallback) => {
      interactionStartListeners.add(callback)

      return () => interactionStartListeners.delete(callback)
    },
    [interactionStartListeners]
  )

  const onInteractionEnd = useCallback(
    (callback: VoidCallback) => {
      interactionEndListeners.add(callback)

      return () => interactionEndListeners.delete(callback)
    },
    [interactionEndListeners]
  )

  const runInteractionStartListeners = useCallback(() => {
    if (interactionStartListeners.size) {
      interactionStartListeners.forEach(listener => listener())
    }
  }, [interactionStartListeners])

  const runInteractionEndListeners = useCallback(() => {
    if (interactionEndListeners.size) {
      interactionEndListeners.forEach(listener => listener())
    }
  }, [interactionEndListeners])

  const interactionHandlers = useMemo(
    () => ({
      onScrollBeginDrag: runInteractionStartListeners,
      onScrollEndDrag: runInteractionEndListeners,
      onTouchStart: runInteractionStartListeners,
      onTouchEnd: runInteractionEndListeners,
      onTouchMove: runInteractionStartListeners,
      onTouchCancel: runInteractionEndListeners
    }),
    [runInteractionStartListeners, runInteractionEndListeners]
  )

  let childComponent = children

  if (enableInteractionMode) {
    const child = Children.only(children)

    if (isValidElement(child)) {
      childComponent = cloneElement(child, interactionHandlers)
    }
  }

  const value: AppearObserverProviderValue = useMemo(
    () => ({
      parentRef,
      interactionModeEnabled: enableInteractionMode,
      onInteractionStart,
      onInteractionEnd
    }),
    [enableInteractionMode, onInteractionStart, onInteractionEnd, parentRef]
  )

  return (
    <AppearObserverContext.Provider value={value}>
      {childComponent}
    </AppearObserverContext.Provider>
  )
}

export const useAppearObserverProvider = () => useContext(AppearObserverContext)
