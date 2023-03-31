import { AnyElementRef, VoidCallback } from '../core'

export interface AppearObserverProps {
  elementRef: AnyElementRef
  parentRef?: AnyElementRef
  onAppear?: VoidCallback
  onDisappear?: VoidCallback
  options?: AppearObserverOptions
}

export interface AppearObserverOptions {
  visibilityThreshold?: number
  intervalDelay?: number
  recalculateParentBoundaries?: boolean
  enabled?: boolean
}

export interface ObserverStateHandlerProps {
  readonly elementRef: AnyElementRef
  readonly parentRef: AnyElementRef
}
