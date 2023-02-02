import { RefObject } from 'react'

export interface ElementBoundaries {
  readonly top: number
  readonly right: number
  readonly bottom: number
  readonly left: number
}

export interface ElementMeasurements {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

export type VoidCallback = () => void

export type AnyElement = object

export type ElementRef = RefObject<AnyElement>
