import { useMemo } from 'react'
import { AppearObserverOptions } from './types'

export const useObserverOptions = (
  options: AppearObserverOptions | undefined
) => {
  return useMemo(() => ({ ...defaultOptions, ...options }), [options])
}

const defaultOptions: Required<AppearObserverOptions> = {
  visibilityThreshold: 0,
  intervalDelay: 50,
  recalculateParentBoundaries: true
}
