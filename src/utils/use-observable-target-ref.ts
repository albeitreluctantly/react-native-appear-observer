import { useRef } from 'react'
import { AnyElementRef, noop } from '../core'

export const useObservableTargetRef = (ref?: AnyElementRef) => {
  const defaultRef = useRef<AnyElementRef>(null)

  return {
    ref: ref || defaultRef,
    // Fixes for android
    onLayout: noop,
    collapsable: false
  }
}
