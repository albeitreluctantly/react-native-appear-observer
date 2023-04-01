import { useMemo } from 'react'
import { useAppearObserverProvider } from '../appear-observer-provider'
import { InteractionListeners } from '../utils'
import { AppearObserverOptions, AppearObserverProps } from './types'

export const useObserverConfiguration = ({
  elementRef,
  parentRef,
  onAppear,
  onDisappear,
  onEnable,
  onDisable,
  enabled = true,
  interactionListeners,
  options
}: AppearObserverProps): Omit<
  AppearObserverProps,
  'options' | 'interactionListeners'
> & {
  options: Required<AppearObserverOptions>
  interactionListeners: Required<InteractionListeners>
} => {
  const {
    parentRef: parentRefContext,
    interactionModeEnabled,
    parentOffsets: parentOffsets,
    onInteractionStart,
    onInteractionEnd
  } = useAppearObserverProvider()

  return useMemo(
    () => ({
      elementRef,
      parentRef: parentRef || parentRefContext,
      onAppear,
      onDisappear,
      onEnable,
      onDisable,
      enabled,
      interactionListeners: {
        onInteractionStart:
          interactionListeners?.onInteractionStart || onInteractionStart,
        onInteractionEnd:
          interactionListeners?.onInteractionEnd || onInteractionEnd
      },
      options: {
        visibilityThreshold:
          options?.visibilityThreshold || defaultOptions.visibilityThreshold,
        intervalDelay: options?.intervalDelay || defaultOptions.intervalDelay,
        recalculateParentBoundaries:
          options?.recalculateParentBoundaries ||
          defaultOptions.recalculateParentBoundaries,
        interactionModeEnabled:
          options?.interactionModeEnabled ||
          interactionModeEnabled ||
          defaultOptions.interactionModeEnabled,
        parentOffsets:
          options?.parentOffsets ||
          parentOffsets ||
          defaultOptions.parentOffsets,
        optimizeOutOfScreen:
          options?.optimizeOutOfScreen || defaultOptions?.optimizeOutOfScreen,
        useScreenIfNoParent:
          options?.useScreenIfNoParent || defaultOptions.useScreenIfNoParent
      }
    }),
    [
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
      options?.parentOffsets,
      options?.recalculateParentBoundaries,
      options?.useScreenIfNoParent,
      options?.visibilityThreshold,
      parentOffsets,
      parentRef,
      parentRefContext
    ]
  )
}

const defaultOptions: Required<AppearObserverOptions> = {
  visibilityThreshold: 0,
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
  useScreenIfNoParent: true
}
