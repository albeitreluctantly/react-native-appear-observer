/// <reference types="react" />
import { AppearObserverProviderProps, AppearObserverProviderValue } from './types';
export declare const AppearObserverContext: import("react").Context<AppearObserverProviderValue>;
export declare const AppearObserverProvider: import("react").ForwardRefExoticComponent<Omit<AppearObserverProviderProps, "ref"> & import("react").RefAttributes<any>>;
export declare const useAppearObserverProvider: () => AppearObserverProviderValue;
