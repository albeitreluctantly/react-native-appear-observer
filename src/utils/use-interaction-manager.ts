import { useCallback, useMemo, useRef } from 'react'
import { VoidCallback } from '../core'
import { InteractionHandlers, InteractionManagerData } from './types'

export const useInteractionManager = ({
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onTouchCancel
}: InteractionHandlers = {}): InteractionManagerData => {
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
      onTouchStart: event => {
        recordInteractionStart()
        onTouchStart?.(event)
      },
      onTouchMove: event => {
        recordInteractionStart()
        onTouchMove?.(event)
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
      onTouchStart,
      onTouchMove,
      recordInteractionEnd,
      onTouchEnd,
      onTouchCancel
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
