import { ScrollViewProps } from 'react-native'
import { VoidCallback } from '../core'

type InteractionHandlerTypes =
  | 'onScroll'
  | 'onScrollBeginDrag'
  | 'onScrollEndDrag'
  | 'onTouchStart'
  | 'onTouchEnd'
  | 'onTouchMove'
  | 'onTouchCancel'

export type InteractionHandlers = Partial<
  Pick<ScrollViewProps, InteractionHandlerTypes>
>

export interface InteractionListeners {
  readonly onInteractionStart: (callback: VoidCallback) => VoidCallback
  readonly onInteractionEnd: (callback: VoidCallback) => VoidCallback
}

export interface InteractionRecorders {
  readonly recordInteractionStart: VoidCallback
  readonly recordInteractionEnd: VoidCallback
}

export interface UseInteractionHandler {
  readonly interactionHandlers: InteractionHandlers
  readonly interactionListeners: InteractionListeners
  readonly interactionRecorders: InteractionRecorders
}

export type ObservableElementProps = Partial<
  Pick<ScrollViewProps, 'onLayout' | 'collapsable'>
>
