import { RefObject } from 'react'
import { AnyReactNativeElement, VoidCallback } from '../core'

export interface AppearObserverProps {
  elementRef: RefObject<AnyReactNativeElement>
  parentRef?: RefObject<AnyReactNativeElement>
  onAppear?: VoidCallback
  onDisappear?: VoidCallback
  options?: AppearObserverOptions
}

export interface AppearObserverOptions {
  visibilityThreshold?: number
  intervalDelay?: number
  recalculateParentBoundaries?: boolean
}
