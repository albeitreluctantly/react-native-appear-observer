<h1>react-native-appear-observer</h1>

A React Native library to detect element appearance on the screen

<h2>Version 2.0</h2>

Version 2.0 considers the mistakes of first version and expands functionality, briefly it:

- has updated appear observer hook cycle logic
- adds support for enabling, disabling and reseting observer (can be used with react navigation)
- adds full support for usage without provider
- adds support for render props children to provider
- adds support of callbacks to provider, adds onScroll as interaction handler
- adds a utility hook for adding necessary fixes to elements to work on android,
  incorporates it in observer and provider hooks
- adds support for usage without parent, relying on window boundaries (provided offsets considered)
- adds support of settings parent offsets (for cases of floating element above parent)
- drops reqirement of explicit refs
- memoizes the configurations properly so that simple non memoized objects can be used
- changes intersection detection algorithm, incorrect visibility threshold is fixed
- drops support for useIsAppeared (so far)

Proper documentation will be added later!

<h2>Usage</h2>

Wrap the parent component with provider and supply it with parent view ref.

```ts
const App = () => {
  return (
    <AppearObserverProvider>
      <ScrollView>{/* content */}</ScrollView>
    </AppearObserverProvider>
  )
}
```

Or use useAppearObserver hook if you want to attach callback to visibility change without changing state.

```ts
const TestView = ({ onAppear, onDisappear }: any) => {
  const { refProps } = useAppearObserver({
    elementRef,
    onAppear,
    onDisappear
  })

  return <View {...refProps} style={elementStyle} />
}
```

Usage with react navigation

```ts
const TestView = ({ onAppear, onDisappear }: any) => {
  const isFocused = useIsFocused()

  const { refProps } = useAppearObserver({
    enabled: isFocused,
    onAppear,
    onDisappear,
    onDisable: onDisappear // Optional
  })

  return <View {...refProps} style={elementStyle} />
}
```

<h2>Options</h2>

<b>useAppearObserver</b>

| Option                        | Description                                                                                                        | Default value |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------- |
| _visibilityThreshold_         | Defines what part of an element should be visible for it to trigger callback, from 0 to 1.                         | 0             |
| _intervalDelay_               | Determines a delay in milliseconds between visibility check repetitions.                                           | 100           |
| _recalculateParentBoundaries_ | Tells whether observer should measure parent element boundaries on every on every check or measure once and cache. | false         |

<b>useAppearObserverProvider</b>

| Option                  | Description                                                                                                                                                                                                                                                                     | Default value |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| _enableInteractionMode_ | If true, the touch handlers are attached to child view of context provider and observer runs checks only upon interactions, which could affect element visibility - touch move or scroll, stopping them on after a period of inactivity. If false, checks will run permanently. | true          |

<h2>Known issues</h2>

- Observing stops in horizontal lists on Android if provider is attached to parent vertical scroll view and scrolling is performed by
  holding screen with one finger and moving with another.
