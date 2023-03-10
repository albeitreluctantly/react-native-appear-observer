import { DependencyList, useRef } from 'react'
import { View } from 'react-native'
import {
  AnyElement,
  ElementBoundaries,
  ElementMeasurements,
  VoidCallback
} from './types'

export const noop = () => void null

export const createElementBoundaries = ({
  x,
  y,
  width,
  height
}: ElementMeasurements): ElementBoundaries => ({
  top: y,
  right: x,
  bottom: y + height,
  left: x + width
})

export const elementIntersectsWithParent = (
  elementBoundaries: ElementBoundaries,
  parentBoundaries: ElementBoundaries
) => {
  return (
    elementBoundaries.top <= parentBoundaries.bottom &&
    elementBoundaries.bottom >= parentBoundaries.top &&
    elementBoundaries.right <= parentBoundaries.left &&
    elementBoundaries.left >= parentBoundaries.right
  )
}

export const elementHasZeroSize = (elementMeasures: ElementMeasurements) => {
  return elementMeasures.width === 0 || elementMeasures.height === 0
}

// React native element refs actually contain measure props
// like measureInWindow, but it's not reflected in types
export const measureInWindow = (
  element: AnyElement | null
): Promise<ElementMeasurements> => {
  return new Promise(resolve => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;(element as View).measureInWindow((x, y, width, height) => {
        resolve({ x, y, width, height })
      })
    } catch (e) {
      resolve(fallbackMeasurements)
    }
  })
}

const fallbackMeasurements: ElementMeasurements = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
}

export const isAsyncIterable = (value: unknown) => {
  return Symbol.asyncIterator in Object(value)
}

export const iterateAsyncIterable = async <T>(
  generator: AsyncIterableIterator<T>,
  handler: (value: T) => void,
  stopper?: { stop: boolean }
) => {
  let generatorIsDone = false

  const stoppableHandler = (value: T) => {
    if (stopper?.stop) return

    handler(value)
  }

  while (!generatorIsDone) {
    if (stopper?.stop) {
      generatorIsDone = true
      return
    }

    const { value, done } = await generator.next()

    if (!(done && value === undefined)) {
      if (isAsyncIterable(value)) {
        await iterateAsyncIterable(value, stoppableHandler, stopper)
      } else {
        stoppableHandler(value)
      }
    }

    generatorIsDone = Boolean(done)
  }
}

export const listenIterable = <T>(
  generator: AsyncIterableIterator<T>,
  handler: (value: T) => void
) => {
  const stopper = { stop: false }

  iterateAsyncIterable(generator, handler, stopper)

  return () => {
    stopper.stop = true
  }
}

export const delay = (duration: number) =>
  new Promise<void>(resolve => setTimeout(resolve, duration))

const shallowCompareArrays = <T extends Array<any> | ReadonlyArray<any>>(
  value1: T,
  value2: T
) => {
  return (
    value1.length === value2.length &&
    value1.every((element, index) => element === value2[index])
  )
}

export const useImmediateEffect = (
  callback: VoidCallback,
  deps: DependencyList
) => {
  const previousDeps = useRef(deps)

  if (!shallowCompareArrays(deps, previousDeps.current)) {
    previousDeps.current = deps
    callback()
  }
}
