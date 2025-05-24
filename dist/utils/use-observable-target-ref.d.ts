import { ForwardedRef } from 'react';
import { AnyElementRef } from '../core';
export declare const useObservableTargetRef: (ref?: AnyElementRef | ForwardedRef<AnyElementRef>) => {
    ref: AnyElementRef;
    onLayout: () => any;
    collapsable: boolean;
};
