import { useCallback, useState } from 'react'
import { AnyElementRef } from '../core'
import { AppearObserverOptions } from './types'
import { useAppearObserver } from './use-appear-observer'

export const useIsAppeared = (
  elementRef: AnyElementRef,
  options?: AppearObserverOptions
) => {
  const [isAppeared, setIsAppeared] = useState(false)

  const onAppear = useCallback(() => {
    setIsAppeared(true)
  }, [])

  const onDisappear = useCallback(() => {
    setIsAppeared(false)
  }, [])

  useAppearObserver({ elementRef, onAppear, onDisappear, options })

  return isAppeared
}
