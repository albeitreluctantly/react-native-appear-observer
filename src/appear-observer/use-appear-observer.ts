import { useCallback, useEffect, useRef } from 'react'
import { useAppearObserverProvider } from '../appear-observer-provider'
import {
  createElementBoundaries,
  delay,
  ElementBoundaries,
  elementHasZeroSize,
  elementIntersectsWithParent,
  listenIterable,
  measureInWindow
} from '../core'
import { AppearObserverProps } from './types'
import { useObserverOptions } from './use-observer-options'
import { useObserverStateHandler } from './use-observer-state-handler'

export const useAppearObserver = ({
  elementRef,
  parentRef: parentRefProp,
  onAppear,
  onDisappear,
  options
}: AppearObserverProps) => {
  const { visibilityThreshold, recalculateParentBoundaries, intervalDelay } =
    useObserverOptions(options)

  const { parentRef: parentRefContext } = useAppearObserverProvider()

  const parentRef = parentRefProp || parentRefContext

  const { isObserving, onVisibilityChange } = useObserverStateHandler({
    elementRef
  })

  const currentParentBoundaries = useRef<ElementBoundaries | undefined>()

  const elementIsCurrentlyVisible = useRef(false)

  const getParentBoundaries = useCallback(async () => {
    let parentBoundaries = currentParentBoundaries.current

    if (!parentBoundaries || recalculateParentBoundaries) {
      const measurements = await measureInWindow(parentRef?.current)

      if (!elementHasZeroSize(measurements)) {
        parentBoundaries = createElementBoundaries(measurements)

        currentParentBoundaries.current = parentBoundaries
      }
    }

    return parentBoundaries
  }, [parentRef, recalculateParentBoundaries])

  const observeElementVisibility = useCallback(
    async function* () {
      while (isObserving) {
        await delay(1)

        const parentBoundaries = await getParentBoundaries()

        if (!parentBoundaries) {
          return
        }

        const elementMeasurements = await measureInWindow(elementRef.current)

        if (elementHasZeroSize(elementMeasurements)) {
          return
        }

        const { x, y, width, height } = elementMeasurements

        const verticalVisibilityThreshold = height * visibilityThreshold
        const horizontalVisibilityThreshold = width * visibilityThreshold

        const elementBoundaries = createElementBoundaries({
          x: x + horizontalVisibilityThreshold,
          y: y + verticalVisibilityThreshold,
          width,
          height
        })

        yield elementIntersectsWithParent(elementBoundaries, parentBoundaries)

        await delay(intervalDelay)
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

  useEffect(() => {
    const stopObserving = listenIterable(
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

    return () => stopObserving()
  }, [observeElementVisibility, onAppear, onDisappear, onVisibilityChange])
}
