import { useCallback, useRef, useState } from 'react';
export const noop = () => void null;
export const createElementBoundaries = ({ x, y, width, height }) => ({
    top: y,
    right: x + width,
    bottom: y + height,
    left: x
});
export const getIntersectionPercentage = (element1, element2) => {
    const topIntersection = Math.min(element1.bottom, element2.bottom);
    const bottomIntersection = Math.max(element1.top, element2.top);
    const leftIntersection = Math.max(element1.left, element2.left);
    const rightIntersection = Math.min(element1.right, element2.right);
    const widthIntersection = rightIntersection - leftIntersection;
    const heightIntersection = topIntersection - bottomIntersection;
    const overlapArea = widthIntersection < 0 || heightIntersection < 0
        ? 0
        : widthIntersection * heightIntersection;
    const element1Area = (element1.right - element1.left) * (element1.bottom - element1.top);
    return toPrecise((overlapArea / element1Area) * 100);
};
const toPrecise = (number) => Math.floor(number * 1000) / 1000;
export const elementHasZeroSize = (elementMeasures) => {
    return elementMeasures.width === 0 || elementMeasures.height === 0;
};
// React native element refs actually contain measure props
// like measureInWindow, but it's not reflected in types
export const measureInWindow = (element) => {
    return new Promise(resolve => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-extra-semi
            ;
            element.measureInWindow((x = 0, y = 0, width = 0, height = 0) => {
                resolve({ x, y, width, height });
            });
        }
        catch (e) {
            resolve(fallbackMeasurements);
        }
    });
};
const fallbackMeasurements = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
};
export const isAsyncIterable = (value) => {
    return Symbol.asyncIterator in Object(value);
};
export const iterateAsyncIterable = async (generator, handler, stopper) => {
    let generatorIsDone = false;
    const stoppableHandler = (value) => {
        if (stopper?.stop)
            return;
        handler(value);
    };
    while (!generatorIsDone) {
        if (stopper?.stop) {
            generatorIsDone = true;
            return;
        }
        const { value, done } = await generator.next();
        if (!(done && value === undefined)) {
            if (isAsyncIterable(value)) {
                await iterateAsyncIterable(value, stoppableHandler, stopper);
            }
            else {
                stoppableHandler(value);
            }
        }
        generatorIsDone = Boolean(done);
    }
};
export const listenIterable = (generator, handler) => {
    const stopper = { stop: false };
    iterateAsyncIterable(generator, handler, stopper);
    return () => {
        stopper.stop = true;
    };
};
export const delay = (duration) => new Promise(resolve => setTimeout(resolve, duration));
const shallowCompareArrays = (value1, value2) => {
    return (value1.length === value2.length &&
        value1.every((element, index) => element === value2[index]));
};
export const useImmediateReaction = (callback, deps) => {
    const previousDeps = useRef(deps);
    if (!shallowCompareArrays(deps, previousDeps.current)) {
        previousDeps.current = deps;
        callback();
    }
};
export const useForceUpdate = () => {
    const [updateKey, setUpdateKey] = useState(0);
    const forceUpdate = useCallback(() => {
        setUpdateKey(key => key + 1);
    }, []);
    return [updateKey, forceUpdate];
};
const getClass = {}.toString;
// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (value) => Boolean(value) && getClass.call(value) === '[object Function]';
