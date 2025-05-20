import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import {
  ElementBoundaries,
  VoidCallback,
  createElementBoundaries,
  delay,
  elementHasZeroSize,
  getIntersectionPercentage,
  listenIterable,
  measureInWindow,
  useForceUpdate,
  useImmediateReaction
} from '../core'
import { useObservableTargetRef } from '../utils'
import { AppearObserverProps } from './types'
import { useObserverConfiguration } from './use-observer-configuration'
import { useObserverInteractivityHandler } from './use-observer-interactivity-handler'

export const useAppearObserver = (props: AppearObserverProps) => {
  const {
    elementRef: elementRefProp,
    parentRef,
    onAppear,
    onDisappear,
    onEnable,
    onDisable,
    enabled,
    interactionListeners,
    options
  } = useObserverConfiguration(props)

  const refProps = useObservableTargetRef(elementRefProp)

  const { ref: elementRef } = refProps

  const {
    interactionModeEnabled,
    recalculateParentBoundaries,
    visibilityThreshold,
    optimizeOutOfScreen,
    parentOffsets,
    useScreenIfNoParent,
    intervalDelay
  } = options

  const { width: windowWidth, height: windowHeight } = useWindowDimensions()

  const windowBoundaries: ElementBoundaries = useMemo(
    () => ({
      top: 0 + parentOffsets.top,
      right: windowWidth + parentOffsets.right,
      bottom: windowHeight + parentOffsets.bottom,
      left: 0 + parentOffsets.left
    }),
    [parentOffsets, windowWidth, windowHeight]
  )

  const currentParentBoundaries = useRef<ElementBoundaries | undefined>(undefined)

  const elementIsCurrentlyVisible = useRef(false)

  const wasEnabled = useRef(enabled)

  const [isObserving, setIsObserving] = useState(enabled)

  const [updateKey, forceUpdate] = useForceUpdate()

  const { onVisibilityChange, resetInteractivityHandler } =
    useObserverInteractivityHandler({
      ...interactionListeners,
      interactionModeEnabled,
      onStateUpdate: setIsObserving
    })

  const restartObserver = useCallback(() => {
    elementIsCurrentlyVisible.current = false
    currentParentBoundaries.current = undefined
    wasEnabled.current = enabled

    resetInteractivityHandler()
    setIsObserving(enabled)
    forceUpdate()
  }, [enabled, resetInteractivityHandler, forceUpdate])

  useImmediateReaction(() => {
    restartObserver()
  }, [parentRef, elementRef, enabled])

  const getParentBoundaries = useCallback(async () => {
    let parentBoundaries = currentParentBoundaries.current

    if (!parentBoundaries || recalculateParentBoundaries) {
      const measurements = await measureInWindow(parentRef?.current)

      if (!elementHasZeroSize(measurements)) {
        const boundaries = createElementBoundaries(measurements)

        parentBoundaries = {
          top: boundaries.top + parentOffsets.top,
          right: boundaries.right + parentOffsets.right,
          bottom: boundaries.bottom + parentOffsets.bottom,
          left: boundaries.left + parentOffsets.left
        }

        currentParentBoundaries.current = parentBoundaries
      }
    }

    return parentBoundaries
  }, [parentOffsets, parentRef, recalculateParentBoundaries])

  const observeElementVisibility = useCallback(
    async function* () {
      while (isObserving) {
        // Initial delay to wait for layout
        // makes observer do one cycle instead of two initially
        await delay(1)

        const elementMeasurements = await measureInWindow(elementRef.current)

        const elementBoundaries = createElementBoundaries(elementMeasurements)

        let elementIsOutOfScreen = false

        if (recalculateParentBoundaries && optimizeOutOfScreen) {
          const elementIntersectsWithWindow =
            getIntersectionPercentage(elementBoundaries, windowBoundaries) > 0

          if (!elementIntersectsWithWindow) {
            elementIsOutOfScreen = true

            yield false
            await delay(intervalDelay * 2)
          }
        }

        if (!elementIsOutOfScreen) {
          const parentBoundaries =
            useScreenIfNoParent && !parentRef
              ? windowBoundaries
              : await getParentBoundaries()

          if (!parentBoundaries) {
            yield false
          } else {
            yield getIntersectionPercentage(
              elementBoundaries,
              parentBoundaries
            ) >= visibilityThreshold
          }
        }

        await delay(intervalDelay)
      }
    },
    [
      isObserving,
      elementRef,
      visibilityThreshold,
      optimizeOutOfScreen,
      useScreenIfNoParent,
      parentRef,
      windowBoundaries,
      getParentBoundaries,
      intervalDelay,
      recalculateParentBoundaries
    ]
  )

  useEffect(() => {
    let stopObserving: VoidCallback

    if (enabled) {
      stopObserving = listenIterable(
        observeElementVisibility(),
        elementIsVisible => {
          if (elementIsCurrentlyVisible.current !== elementIsVisible) {
            elementIsCurrentlyVisible.current = elementIsVisible

            if (elementIsVisible) {
              onAppear?.()
            } else {
              onDisappear?.()
            }
          }

          onVisibilityChange()
        }
      )
    }

    return () => stopObserving?.()
  }, [
    enabled,
    observeElementVisibility,
    onAppear,
    onDisappear,
    onVisibilityChange,
    updateKey
  ])

  useEffect(() => {
    if (enabled !== wasEnabled.current) {
      if (enabled) {
        onEnable?.()
      } else {
        onDisable?.()
      }
    }

    wasEnabled.current = enabled
  }, [enabled, onEnable, onDisable])

  return {
    restart: restartObserver,
    refProps
  }
}
