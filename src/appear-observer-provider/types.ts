import { ReactNode } from 'react'
import { ScrollViewProps } from 'react-native'
import { AnyElementRef, VoidCallback } from '../core'

export type AvailablePropTypes =
  | 'onScroll'
  | 'onScrollBeginDrag'
  | 'onScrollEndDrag'
  | 'onTouchStart'
  | 'onTouchEnd'
  | 'onTouchMove'
  | 'onTouchCancel'
  | 'onLayout'
  | 'collapsable'

export type AvailableProps = Partial<Pick<ScrollViewProps, AvailablePropTypes>>

export interface AppearObserverProviderProps extends AvailableProps {
  readonly parentRef: AnyElementRef
  readonly enableInteractionMode?: boolean
  readonly children:
    | ReactNode
    | ((
        defaultProps: AvailableProps,
        runInteractionStartListeners: VoidCallback,
        runInteractionEndListeners: VoidCallback
      ) => ReactNode)
}

export interface AppearObserverProviderValue {
  readonly parentRef: AnyElementRef | undefined
  readonly interactionModeEnabled: boolean
  readonly onInteractionStart: (callback: VoidCallback) => VoidCallback
  readonly onInteractionEnd: (callback: VoidCallback) => VoidCallback
}
