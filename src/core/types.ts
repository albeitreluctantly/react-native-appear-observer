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

export type AnyElement = any

export type AnyElementRef = RefObject<AnyElement>

export type WeakenedKeys<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>
