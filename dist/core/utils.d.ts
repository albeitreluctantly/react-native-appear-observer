import { DependencyList } from 'react';
import { AnyElement, ElementBoundaries, ElementMeasurements, VoidCallback } from './types';
export declare const noop: () => any;
export declare const createElementBoundaries: ({ x, y, width, height }: ElementMeasurements) => ElementBoundaries;
export declare const getIntersectionPercentage: (element1: ElementBoundaries, element2: ElementBoundaries) => number;
export declare const elementHasZeroSize: (elementMeasures: ElementMeasurements) => boolean;
export declare const measureInWindow: (element: AnyElement | undefined | null) => Promise<ElementMeasurements>;
export declare const isAsyncIterable: (value: unknown) => boolean;
export declare const iterateAsyncIterable: <T>(generator: AsyncIterableIterator<T>, handler: (value: T) => void, stopper?: {
    stop: boolean;
}) => Promise<void>;
export declare const listenIterable: <T>(generator: AsyncIterableIterator<T>, handler: (value: T) => void) => () => void;
export declare const delay: (duration: number) => Promise<void>;
export declare const useImmediateReaction: (callback: VoidCallback, deps: DependencyList) => void;
export declare const useForceUpdate: () => readonly [number, () => void];
export declare const isFunction: (value: unknown) => value is Function;
