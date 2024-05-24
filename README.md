<h1>react-native-appear-observer</h1>

> [!NOTE]
> The updated documentation is in progress.

<p>A React Native library that helps to track element's appearance on the screen.</p>
<p>The detection mechanism is based on the loop that measures element's position on the screen and looks if it lies within the boundaries of it's parent.</p>
<p>The library provides different optimization technics to reduce performance impact, among which the primary is an option to start the loop only when user interaction happens, after which the loop stops when the app goes idel.</p>

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

<h2>Usage</h2>

<h3>Basic</h3>
<h4>With context</h4>

<p>Wrap the parent component with provider and supply it with parent view ref.</p>
<p>The provider will attach all necessary props automatically to it's child component and does not require any configuration in basic setup.</p>

```ts
const App = () => {
  return (
    <AppearObserverProvider>
      <ScrollView>{/* content */}</ScrollView>
    </AppearObserverProvider>
  )
}
```

Set up the useAppearObserver hook for the element you want to track and it pass the props returned by the hook.
It attaches a ref to the component, based on which the measurement will run, and adds specific props to prevent the component from being collapsed on Android platform.
```ts
const TrackedComponent = () => {
  const { refProps } = useAppearObserver({ onAppear: useCallback(() => console.log('Element has appeared!'), []) })

  return <View {...refProps} />
}
```

<h4>Without context</h4>
<p>Attach interaction handlers to the parent element, pass interaction listeners and parent ref to the tracked component.</p>

```ts
const App = () => {
  const $scrollViewRef = useRef<ScrollView>(null)
  const { interactionHandlers, interactionListeners } = useInteractionManager()

  return <ScrollView ref={$scrollViewRef} { ...interactionHandlers }>{/* content */}</ScrollView>
}

const TrackedComponent = ({ parentRef, interactionListeners }: any) => {
  const { refProps } = useAppearObserver({
    parentRef,
    interactionListeners,
    onAppear: useCallback(() => console.log('Element has appeared!'), [])
  })

  return <View {...refProps} />
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

<h2>API</h2>

<b>useAppearObserver</b>

| Option                        | Description                                                                                                        | Default value |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------- |
| _elementRef_                  | An external ref to use instead of the one created by the hook. Use if you need to work with the tracked element by ref. | undefined     |
| _parentRef_                   | An optional props for usage without context. Provide parent element ref directly to the hook, overrides the ref supplied by context. | undefined     |
| _onAppear_                    | A callback that triggers when the element comes into visibily.                                                     | undefined     |
| _onDisppear_                  | A callback that triggers when the element disappears.                                                              | undefined     |
| _onEnable_                    | A callback that fires when tracking gets enabled.                                                                  | undefined     |
| _onDisable_                   | A callback that fires when tracking gets disabled.                                                                | undefined     |
| _enabled_                     | A flag which toggles tracking on and off. Useful when tracking needs to be reset, like in case with react navigation. | undefined     |
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
