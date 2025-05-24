import { Children, cloneElement, createContext, forwardRef, isValidElement, useContext, useMemo } from 'react';
import { isFunction, noop } from '../core';
import { useInteractionManager, useObservableTargetRef } from '../utils';
const defaultOffsets = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
};
export const AppearObserverContext = createContext({
    parentRef: undefined,
    interactionModeEnabled: true,
    parentOffsets: defaultOffsets,
    onInteractionStart: () => noop,
    onInteractionEnd: () => noop
});
export const AppearObserverProvider = forwardRef(({ enableInteractionMode = true, children, onLayout = noop, collapsable = false, offsets, ...interactionHandlerProps }, ref) => {
    const { interactionHandlers, interactionListeners, interactionRecorders } = useInteractionManager(interactionHandlerProps);
    const refProps = useObservableTargetRef(ref);
    const basicProps = {
        ...refProps,
        onLayout,
        collapsable
    };
    const props = enableInteractionMode
        ? {
            ...interactionHandlers,
            ...basicProps
        }
        : basicProps;
    let childComponent = children;
    if (isFunction(childComponent)) {
        childComponent = childComponent(props, interactionRecorders);
    }
    else {
        const child = Children.only(children);
        if (isValidElement(child)) {
            childComponent = cloneElement(child, props);
        }
    }
    const value = useMemo(() => ({
        parentRef: refProps.ref,
        interactionModeEnabled: enableInteractionMode,
        parentOffsets: {
            top: offsets?.top ?? defaultOffsets.top,
            right: offsets?.right ?? defaultOffsets.right,
            bottom: offsets?.bottom ?? defaultOffsets.bottom,
            left: offsets?.left ?? defaultOffsets.left
        },
        ...interactionListeners
    }), [
        refProps.ref,
        enableInteractionMode,
        interactionListeners,
        offsets?.top,
        offsets?.right,
        offsets?.bottom,
        offsets?.left
    ]);
    return (<AppearObserverContext.Provider value={value}>
        {childComponent}
      </AppearObserverContext.Provider>);
});
export const useAppearObserverProvider = () => useContext(AppearObserverContext);
