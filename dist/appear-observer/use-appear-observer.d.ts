import { AppearObserverProps } from './types';
export declare const useAppearObserver: (props: AppearObserverProps) => {
    restart: () => void;
    refProps: {
        ref: import("../core").AnyElementRef;
        onLayout: () => any;
        collapsable: boolean;
    };
};
