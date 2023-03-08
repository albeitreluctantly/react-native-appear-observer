import { useCallback, useState } from 'react'
import { AnyElementRef } from '../core'
import { AppearObserverOptions } from './types'
import { useAppearObserver } from './use-appear-observer'

export function useIsAppeared(
  elementRef: AnyElementRef,
  parentRef?: AnyElementRef
): boolean
export function useIsAppeared(
  elementRef: AnyElementRef,
  options?: AppearObserverOptions
): boolean
export function useIsAppeared(
  elementRef: AnyElementRef,
  parentRef?: AnyElementRef,
  options?: AppearObserverOptions
): boolean

export function useIsAppeared(
  elementRef: AnyElementRef,
  parentRefOrOptions?: AnyElementRef | AppearObserverOptions,
  options?: AppearObserverOptions
) {
  const [isAppeared, setIsAppeared] = useState(false)

  const onAppear = useCallback(() => {
    setIsAppeared(true)
  }, [])

  const onDisappear = useCallback(() => {
    setIsAppeared(false)
  }, [])

  const parentRef =
    parentRefOrOptions && 'current' in parentRefOrOptions
      ? parentRefOrOptions
      : undefined

  useAppearObserver({
    elementRef,
    parentRef,
    onAppear,
    onDisappear,
    options:
      options ||
      (parentRef === undefined
        ? (parentRefOrOptions as AppearObserverOptions)
        : undefined)
  })

  return isAppeared
}
