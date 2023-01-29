import {
  ElementBoundaries,
  createElementBoundaries,
  listenIterable,
  measureInWindow,
  delay,
  elementHasZeroSize,
  elementIntersectsWithParent
} from '../core'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AppearObserverProps, AppearObserverOptions } from './types'
import { useAppearObserverProvider } from '../appear-observer-provider'

export const useAppearObserver = ({
  elementRef,
  onAppear,
  onDisappear,
  options
}: AppearObserverProps) => {
  const { visibilityThreshold, recalculateParentBoundaries, intervalDelay } =
    useMemo(() => ({ ...defaultOptions, ...options }), [options])

  const { parentRef, interactionModeEnabled, onInteraction } =
    useAppearObserverProvider()

  const [isObserving, setIsObserving] = useState(true)

  const currentParentBoundaries = useRef<ElementBoundaries | undefined>()

  const currentElementBoundaries = useRef<ElementBoundaries | undefined>()

  const elementIsCurrentlyVisible = useRef(false)

  const getParentBoundaries = useCallback(async () => {
    let parentBoundaries: ElementBoundaries

    if (!currentParentBoundaries.current || recalculateParentBoundaries) {
      const measurements = await measureInWindow(parentRef?.current)

      parentBoundaries = createElementBoundaries(measurements)

      if (!elementHasZeroSize(measurements)) {
        currentParentBoundaries.current = parentBoundaries
      }
    } else {
      parentBoundaries = currentParentBoundaries.current
    }

    return parentBoundaries
  }, [parentRef, recalculateParentBoundaries])

  const observeElementVisibility = useCallback(
    async function* () {
      while (isObserving) {
        await delay(1)
        const parentBoundaries = await getParentBoundaries()

        const elementMeasurements = await measureInWindow(elementRef.current)

        if (!elementHasZeroSize(elementMeasurements)) {
          const { x, y, width, height } = elementMeasurements

          const verticalVisibilityThreshold = height * visibilityThreshold
          const horizontalVisibilityThreshold = width * visibilityThreshold

          const elementBoundaries = createElementBoundaries({
            x: x + horizontalVisibilityThreshold,
            y: y + verticalVisibilityThreshold,
            width,
            height
          })

          currentElementBoundaries.current = elementBoundaries

          yield elementIntersectsWithParent(elementBoundaries, parentBoundaries)

          await delay(intervalDelay)
        }
      }
    },
    [
      isObserving,
      getParentBoundaries,
      elementRef,
      visibilityThreshold,
      intervalDelay
    ]
  )

  const idleModeTimeout = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (interactionModeEnabled) {
      const unsubscribe = onInteraction(() => {
        idleModeTimeout.current && clearTimeout(idleModeTimeout.current)
        setIsObserving(true)
        idleModeTimeout.current = setTimeout(() => setIsObserving(false), 2000)
      })

      return () => unsubscribe()
    }
  }, [interactionModeEnabled, onInteraction])

  useEffect(() => {
    if (isObserving) {
      const stopObserving = listenIterable<boolean>(
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
        }
      )

      return () => stopObserving()
    }
  }, [isObserving, observeElementVisibility, onAppear, onDisappear])
}

const defaultOptions: Required<AppearObserverOptions> = {
  visibilityThreshold: 0,
  intervalDelay: 50,
  recalculateParentBoundaries: true
}
