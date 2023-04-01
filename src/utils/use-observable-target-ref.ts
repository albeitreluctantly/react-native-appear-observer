import { ForwardedRef, useRef } from 'react'
import { AnyElementRef, noop } from '../core'

export const useObservableTargetRef = (
  ref?: AnyElementRef | ForwardedRef<AnyElementRef>
) => {
  const defaultRef = useRef<AnyElementRef>(null)

  return {
    ref: (ref || defaultRef) as AnyElementRef,
    // Fixes for android
    onLayout: noop,
    collapsable: false
  }
}
