/// <reference types="react" />
import { AppearObserverProviderProps, AppearObserverProviderValue } from './types';
export declare const AppearObserverContext: import("react").Context<AppearObserverProviderValue>;
export declare const AppearObserverProvider: ({ enableInteractionMode, children }: AppearObserverProviderProps) => import("react").JSX.Element;
export declare const useAppearObserverProvider: () => AppearObserverProviderValue;
