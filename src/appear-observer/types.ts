import { RefObject } from 'react'
import { VoidCallback } from '../core'

export interface AppearObserverProps {
  elementRef: RefObject<any>
  parentRef?: RefObject<any>
  onAppear?: VoidCallback
  onDisappear?: VoidCallback
  options?: AppearObserverOptions
}

export interface AppearObserverOptions {
  visibilityThreshold?: number
  intervalDelay?: number
  recalculateParentBoundaries?: boolean
}

export interface ObserverStateHandlerProps {
  readonly elementRef: RefObject<any>
}
