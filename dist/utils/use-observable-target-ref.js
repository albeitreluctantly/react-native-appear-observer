import { useRef } from 'react';
import { noop } from '../core';
export const useObservableTargetRef = (ref) => {
    const defaultRef = useRef(null);
    return {
        ref: (ref || defaultRef),
        // Fixes for android
        onLayout: noop,
        collapsable: false
    };
};
