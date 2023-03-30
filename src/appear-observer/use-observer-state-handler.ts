import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppearObserverProvider } from '../appear-observer-provider'
import { useImmediateEffect } from '../core'
import { ObserverStateHandlerProps } from './types'

export const useObserverStateHandler = ({
  elementRef
}: ObserverStateHandlerProps) => {
  const {
    parentRef,
    interactionModeEnabled,
    onInteractionStart,
    onInteractionEnd
  } = useAppearObserverProvider()

  const [isObserving, setIsObserving] = useState(Boolean(parentRef))

  const isInitialMeasurement = useRef(true)

  const idleModeTimeout = useRef<ReturnType<typeof setTimeout>>()

  const resetTimeout = useCallback(() => {
    idleModeTimeout.current && clearTimeout(idleModeTimeout.current)
  }, [])

  const resetState = useCallback(() => {
    resetTimeout()
    isInitialMeasurement.current = true
    setIsObserving(Boolean(parentRef))
  }, [parentRef, resetTimeout])

  useImmediateEffect(() => {
    resetState()
  }, [interactionModeEnabled, parentRef, elementRef])

  useEffect(() => {
    if (interactionModeEnabled) {
      const unsubscribeStart = onInteractionStart(() => {
        resetTimeout()
        setIsObserving(true)
      })
      const unsubscribeEnd = onInteractionEnd(() => {
        // Other interaction endings reset timeout started on previous ones
        // E.g. onMomentumScrollEnds resets timeout from onTouchEnd
        resetTimeout()
        idleModeTimeout.current = setTimeout(() => {
          setIsObserving(false)
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
    resetTimeout
  ])

  const onVisibilityChange = useCallback(() => {
    if (interactionModeEnabled) {
      if (isInitialMeasurement.current) {
        setIsObserving(false)
      }
      isInitialMeasurement.current = false
    }
  }, [interactionModeEnabled])

  return {
    isObserving,
    onVisibilityChange,
    resetState
  }
}
