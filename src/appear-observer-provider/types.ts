import { RefObject } from 'react'
import { AnyReactNativeElement, VoidCallback } from '../core'

export interface AppearObserverProviderProps {
  readonly parentRef: RefObject<AnyReactNativeElement>
  readonly enableInteractionMode?: boolean
}

export interface AppearObserverProviderValue {
  readonly parentRef: RefObject<AnyReactNativeElement>
  readonly interactionModeEnabled: boolean
  readonly onInteraction: (callback: VoidCallback) => VoidCallback
}
