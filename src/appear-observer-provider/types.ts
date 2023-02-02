import { AnyElementRef, VoidCallback } from '../core'

export interface AppearObserverProviderProps {
  readonly parentRef: AnyElementRef
  readonly enableInteractionMode?: boolean
}

export interface AppearObserverProviderValue {
  readonly parentRef: AnyElementRef
  readonly interactionModeEnabled: boolean
  readonly onInteractionStart: (callback: VoidCallback) => VoidCallback
  readonly onInteractionEnd: (callback: VoidCallback) => VoidCallback
}
