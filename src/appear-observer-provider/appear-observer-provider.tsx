import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
  useRef
} from 'react'
import { VoidCallback, isFunction, noop } from '../core'
import {
  AppearObserverProviderProps,
  AppearObserverProviderValue,
  AvailableProps
} from './types'

export const AppearObserverContext = createContext<AppearObserverProviderValue>(
  {
    parentRef: undefined,
    interactionModeEnabled: false,
    onInteractionStart: () => noop,
    onInteractionEnd: () => noop
  }
)

export const AppearObserverProvider = ({
  parentRef,
  enableInteractionMode = true,
  onScroll,
  onScrollBeginDrag,
  onScrollEndDrag,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onTouchCancel,
  children,
  // Fixes for android
  onLayout = noop,
  collapsable = false
}: AppearObserverProviderProps) => {
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

  const interactionProps: AvailableProps = useMemo(
    () => ({
      onScroll: event => {
        runInteractionStartListeners()
        onScroll?.(event)
      },
      onScrollBeginDrag: event => {
        runInteractionStartListeners()
        onScrollBeginDrag?.(event)
      },
      onTouchStart: event => {
        runInteractionStartListeners()
        onTouchStart?.(event)
      },
      onTouchMove: event => {
        runInteractionStartListeners()
        onTouchMove?.(event)
      },

      onScrollEndDrag: event => {
        runInteractionEndListeners()
        onScrollEndDrag?.(event)
      },
      onTouchEnd: event => {
        runInteractionEndListeners()
        onTouchEnd?.(event)
      },
      onTouchCancel: event => {
        runInteractionEndListeners()
        onTouchCancel?.(event)
      },
      onLayout,
      collapsable
    }),
    [
      runInteractionStartListeners,
      onScroll,
      onScrollBeginDrag,
      onTouchStart,
      onTouchMove,
      runInteractionEndListeners,
      onScrollEndDrag,
      onTouchEnd,
      onTouchCancel,
      onLayout,
      collapsable
    ]
  )

  const props = enableInteractionMode
    ? interactionProps
    : { onLayout, collapsable }

  let childComponent = children

  if (isFunction(childComponent)) {
    childComponent = childComponent(
      props,
      runInteractionStartListeners,
      runInteractionEndListeners
    )
  } else {
    const child = Children.only(children)

    if (isValidElement(child)) {
      childComponent = cloneElement(child, props)
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
