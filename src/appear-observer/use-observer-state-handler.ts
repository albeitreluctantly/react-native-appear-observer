import { useCallback, useEffect, useRef } from 'react'
import { useAppearObserverProvider } from '../appear-observer-provider'
import { ObserverStateHandlerProps } from './types'

export const useObserverStateHandler = ({
  onStateUpdate
}: ObserverStateHandlerProps) => {
  const { interactionModeEnabled, onInteractionStart, onInteractionEnd } =
    useAppearObserverProvider()

  const isInitialMeasurement = useRef(true)

  const idleModeTimeout = useRef<ReturnType<typeof setTimeout>>()

  const resetTimeout = useCallback(() => {
    idleModeTimeout.current && clearTimeout(idleModeTimeout.current)
  }, [])

  const resetStateHandler = useCallback(() => {
    resetTimeout()
    isInitialMeasurement.current = true
  }, [resetTimeout])

  useEffect(() => {
    if (interactionModeEnabled) {
      const unsubscribeStart = onInteractionStart(() => {
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

  const onVisibilityChange = useCallback(() => {
    if (interactionModeEnabled) {
      if (isInitialMeasurement.current) {
        onStateUpdate(false)
      }
      isInitialMeasurement.current = false
    }
  }, [interactionModeEnabled, onStateUpdate])

  return {
    onVisibilityChange,
    resetStateHandler
  }
}
