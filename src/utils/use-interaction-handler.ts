import { useCallback, useMemo, useRef } from 'react'
import { VoidCallback } from '../core'
import { InteractionHandlers, UseInteractionHandler } from './types'

export const useInteractionHandler = ({
  onScroll,
  onScrollBeginDrag,
  onScrollEndDrag,
  onMomentumScrollEnd,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onTouchCancel
}: InteractionHandlers): UseInteractionHandler => {
  const interactionStartListeners = useRef(new Set<VoidCallback>()).current
  const interactionEndListeners = useRef(new Set<VoidCallback>()).current

  const onInteractionStart = useCallback(
    (callback: VoidCallback) => {
      interactionStartListeners.add(callback)

      return () => interactionStartListeners.delete(callback)
    },
    [interactionStartListeners]
  )

  const onInteractionEnd = useCallback(
    (callback: VoidCallback) => {
      interactionEndListeners.add(callback)

      return () => interactionEndListeners.delete(callback)
    },
    [interactionEndListeners]
  )

  const recordInteractionStart = useCallback(() => {
    if (interactionStartListeners.size) {
      interactionStartListeners.forEach(listener => listener())
    }
  }, [interactionStartListeners])

  const recordInteractionEnd = useCallback(() => {
    if (interactionEndListeners.size) {
      interactionEndListeners.forEach(listener => listener())
    }
  }, [interactionEndListeners])

  const interactionHandlers: InteractionHandlers = useMemo(
    () => ({
      onScroll: event => {
        recordInteractionStart()
        onScroll?.(event)
      },
      onScrollBeginDrag: event => {
        recordInteractionStart()
        onScrollBeginDrag?.(event)
      },
      onTouchStart: event => {
        recordInteractionStart()
        onTouchStart?.(event)
      },
      onTouchMove: event => {
        recordInteractionStart()
        onTouchMove?.(event)
      },

      onScrollEndDrag: event => {
        recordInteractionEnd()
        onScrollEndDrag?.(event)
      },
      onMomentumScrollEnd: event => {
        recordInteractionEnd()
        onMomentumScrollEnd?.(event)
      },
      onTouchEnd: event => {
        recordInteractionEnd()
        onTouchEnd?.(event)
      },
      onTouchCancel: event => {
        recordInteractionEnd()
        onTouchCancel?.(event)
      }
    }),
    [
      recordInteractionStart,
      onScroll,
      onScrollBeginDrag,
      onTouchStart,
      onTouchMove,
      recordInteractionEnd,
      onScrollEndDrag,
      onTouchEnd,
      onTouchCancel,
      onMomentumScrollEnd
    ]
  )

  return {
    interactionHandlers,
    interactionListeners: {
      onInteractionStart,
      onInteractionEnd
    },
    interactionRecorders: {
      recordInteractionStart,
      recordInteractionEnd
    }
  }
}
