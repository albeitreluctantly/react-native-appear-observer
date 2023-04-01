import {
  Children,
  RefObject,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useMemo
} from 'react'
import { AnyElement, isFunction, noop } from '../core'
import { useInteractionHandler, useObservableTargetRef } from '../utils'
import {
  AppearObserverProviderProps,
  AppearObserverProviderValue
} from './types'

const defaultOffsets = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
}

export const AppearObserverContext = createContext<AppearObserverProviderValue>(
  {
    parentRef: undefined,
    interactionModeEnabled: false,
    parentOffsets: defaultOffsets,
    onInteractionStart: () => noop,
    onInteractionEnd: () => noop
  }
)

export const AppearObserverProvider = forwardRef<
  AnyElement,
  AppearObserverProviderProps
>(
  (
    {
      enableInteractionMode = true,
      children,
      onLayout = noop,
      collapsable = false,
      offsets = defaultOffsets,
      ...interactionHandlerProps
    }: AppearObserverProviderProps,
    ref
  ) => {
    const { interactionHandlers, interactionListeners, interactionRecorders } =
      useInteractionHandler(interactionHandlerProps)

    const refProps = useObservableTargetRef(ref)

    const props = enableInteractionMode
      ? { ...interactionHandlers, ...refProps, onLayout, collapsable }
      : { ...refProps, onLayout, collapsable }

    let childComponent = children

    if (isFunction(childComponent)) {
      childComponent = childComponent(props, interactionRecorders)
    } else {
      const child = Children.only(children)

      if (isValidElement(child)) {
        childComponent = cloneElement(child, props)
      }
    }

    const value: AppearObserverProviderValue = useMemo(
      () => ({
        parentRef: refProps.ref as RefObject<AnyElement>,
        interactionModeEnabled: enableInteractionMode,
        parentOffsets: {
          top: offsets.top,
          right: offsets.right,
          bottom: offsets.bottom,
          left: offsets.left
        },
        ...interactionListeners
      }),
      [
        refProps.ref,
        enableInteractionMode,
        interactionListeners,
        offsets.top,
        offsets.right,
        offsets.bottom,
        offsets.left
      ]
    )

    return (
      <AppearObserverContext.Provider value={value}>
        {childComponent}
      </AppearObserverContext.Provider>
    )
  }
)

export const useAppearObserverProvider = () => useContext(AppearObserverContext)
