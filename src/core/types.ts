import {
  FlatList,
  ScrollView,
  SectionList,
  TextInput,
  View,
  Image
} from 'react-native'

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

export type AnyReactNativeElement =
  | View
  | ScrollView
  | FlatList
  | SectionList
  | Text
  | TextInput
  | Image

export type VoidCallback = () => void
