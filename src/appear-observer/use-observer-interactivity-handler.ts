import { useCallback, useEffect, useRef } from 'react'
import { ObserverInteractivityHandlerProps } from './types'

export const useObserverInteractivityHandler = ({
  interactionModeEnabled,
  onInteractionStart,
  onInteractionEnd,
  onStateUpdate,
  initialCyclesCount
}: ObserverInteractivityHandlerProps) => {
  const currentCyclesCount = useRef(0)
  const interactionStarted = useRef(false)

  const idleModeTimeout = useRef<ReturnType<typeof setTimeout>>()

  const resetTimeout = useCallback(() => {
    idleModeTimeout.current && clearTimeout(idleModeTimeout.current)
  }, [])

  const resetInteractivityHandler = useCallback(() => {
    resetTimeout()
    currentCyclesCount.current = 0
    interactionStarted.current = false
  }, [resetTimeout])

  useEffect(() => {
    if (interactionModeEnabled) {
      const unsubscribeStart = onInteractionStart(() => {
        interactionStarted.current = true
        resetTimeout()
        onStateUpdate(true)
      })
      const unsubscribeEnd = onInteractionEnd(() => {
        // Other interaction endings reset timeout started on previous ones
        // E.g. onMomentumScrollEnds resets timeout from onTouchEnd
        resetTimeout()
        idleModeTimeout.current = setTimeout(() => {
          onStateUpdate(false)
        }, 5000)
      })

      return () => {
        unsubscribeStart()
        unsubscribeEnd()
      }
    }
  }, [
    interactionModeEnabled,
    onInteractionStart,
    onInteractionEnd,
    resetTimeout,
    onStateUpdate
  ])

  useEffect(() => {
    return () => resetTimeout()
  }, [resetTimeout])

  const onVisibilityChange = useCallback(() => {
    if (interactionModeEnabled) {
      if (currentCyclesCount.current < initialCyclesCount) {
        currentCyclesCount.current = currentCyclesCount.current + 1
      } else if (!interactionStarted.current) {
        onStateUpdate(false)
      }
    }
  }, [interactionModeEnabled, onStateUpdate])

  return {
    onVisibilityChange,
    resetInteractivityHandler
  }
}
