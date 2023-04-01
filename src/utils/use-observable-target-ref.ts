import { ForwardedRef, RefObject, useRef } from 'react'
import { AnyElementRef, noop } from '../core'

export const useObservableTargetRef = (
  ref?: RefObject<AnyElementRef> | ForwardedRef<AnyElementRef>
) => {
  const defaultRef = useRef<AnyElementRef>(null)

  return {
    ref: (ref || defaultRef) as RefObject<AnyElementRef>,
    // Fixes for android
    onLayout: noop,
    collapsable: false
  }
}
