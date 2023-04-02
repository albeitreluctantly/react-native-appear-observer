import { ReactNode } from 'react'
import { AnyElementRef, ElementBoundaries, VoidCallback } from '../core'
import {
  InteractionHandlers,
  InteractionRecorders,
  ObservableElementProps
} from '../utils'

export interface AppearObserverProviderProps
  extends InteractionHandlers,
    ObservableElementProps {
  readonly ref?: AnyElementRef
  readonly enableInteractionMode?: boolean
  readonly children:
    | ReactNode
    | ((
        props: InteractionHandlers & ObservableElementProps,
        interactionRecorders: InteractionRecorders
      ) => ReactNode)
  readonly offsets?: Partial<ElementBoundaries>
}

export interface AppearObserverProviderValue {
  readonly parentRef: AnyElementRef | undefined
  readonly interactionModeEnabled: boolean
  readonly parentOffsets: ElementBoundaries
  readonly onInteractionStart: (callback: VoidCallback) => VoidCallback
  readonly onInteractionEnd: (callback: VoidCallback) => VoidCallback
}
