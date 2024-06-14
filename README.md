<h1>react-native-appear-observer</h1>

<p>A React Native library that helps to track the appearance of an element on the screen.</p>

<h2>Description</h2>

<p>The library's functionality is based on the loop that measures element's position on the screen and looks if it lies within the boundaries of the designated parent.</p>
<p>The loop is intended to operate only when user interaction has happened. This is achieved by attaching interaction event listeners to the parent element relative to which the tracking is performed. When app goes idle the loop stops after a delay.</p>
<p>API is designed in a way that provides easy basic usage without boilerplate and cluttering the code, for that all components try to make their setup and all necessary attachments automatic.</p>
<p>The basic intended usage implies setting a ScrollView or any List component as parent and tracking the element relative to it.</p>
<p>As well the library allows other types of usage and provides a wide variety of settings and customizations to cover different usage scenarios.</p>
<p>Among the options are:</p>

<ul>
  <li>Ability to use with and without a context wrapping the parent element.</li>
  <li>To set custom threshold for element's appearance, in percents of the element's size.</li>
  <li>To record custom interactions as such that trigger the start of the tracking.</li>
  <li>To disable interaction mode and run the loop indefinitely, as well as an ability to manually start and stop it.</li>
  <li>Usage without a parent, with tracking relative to the screen, and an option to set static offsets from the screen boundaries.</li>
  <li>Different optimizations like ability to set a custom delay between the loop cycles, disable parent boundaries recalculation.</li>
</ul>

<h2>Usage</h2>

<h3>Basic</h3>
<p>All setup options, except for measuring relative to window, consist of two steps: setting parent component relative to which the tracking will be performed and child observed components.</p>

<h4>Interaction mode with provider</h4>
<p>Wrap the parent component with provider. The provider will attach all necessary props automatically to its child component and does not require any configuration in basic setup. Works perfectly with ScrollView and virtualized lists.</p>
<p>Set up the useAppearObserver hook for the element you want to track and pass it the props returned by the hook. It attaches a ref to the component, based on which the measurement will run, and adds specific props to prevent the element from collapsing which prevents measurement and tracking.</p>

```tsx

const App = () => {
  return (
    <AppearObserverProvider>
      <ScrollView>
        <TrackedComponent />
      </ScrollView>
    </AppearObserverProvider>
  )
}

const TrackedComponent = () => {
  const { refProps } = useAppearObserver({ 
    onAppear: useCallback(() => console.log('Hola!'), []) 
  })

  return <View { ...refProps } />
}
```

<h4>Interaction mode without provider</h4>
<p>Attach ref and interaction handlers to the parent component, pass interaction listeners and parent ref to the tracked component.</p>

```tsx
const App = () => {
  const scrollViewRef = useRef()
  const { interactionHandlers, interactionListeners } = useInteractionManager()

  return (
    <ScrollView ref={scrollViewRef} { ...interactionHandlers }>
      <TrackedComponent parentRef={scrollViewRef} interactionListeners={interactionListeners} />
    </ScrollView>
  )
}

const TrackedComponent = ({ parentRef, interactionListeners }: any) => {
  const { refProps } = useAppearObserver({
    parentRef,
    interactionListeners,
    onAppear: useCallback(() => console.log('Hi there!'), [])
  })

  return <View {...refProps} />
}
```

<h4>Static mode with measurement relative to parent</h4>
<p>Attach ref to the parent component. Pass parent ref to the observed component. Set <i>interactionModeEnabled</i> to false.</p>

```tsx
const App = () => {
  const scrollViewRef = useRef()

  return (
    <ScrollView ref={scrollViewRef}>
      <TrackedComponent parentRef={scrollViewRef} />
    </ScrollView>
  )
}

const TrackedComponent = ({ parentRef }: any) => {
  const { refProps } = useAppearObserver({
    parentRef,
    onAppear: useCallback(() => console.log('Hi there!'), []),
    options: {
      interactionModeEnabled: false,
    }
  })

  return <View {...refProps} />
}
```

<h4>Static mode with measurement relative to window</h4>
<p>Set up useAppearObserver with <i>useScreenIfNoParent</i> set to true. This mode also supports <b>parentOffsets</b>.</p>

```tsx
const App = () => {
  return (
    <ScrollView>
      <TrackedComponent />
    </ScrollView>
  )
}

const TrackedComponent = () => {
  const { refProps } = useAppearObserver({
    onAppear: useCallback(() => console.log('Hi there!'), []),
    options: {
      interactionModeEnabled: false,
      useScreenIfNoParent: true,
    }
  })

  return <View {...refProps} />
}
```

<h3>Specific cases</h3>
<h4>Usage with react navigation</h4>
<p>Set 'enabled' flag to isFocused from React Navigation. By default, the loop stops when the screen goes out of focus and won't start again otherwise, so it's necessary to start it manually.</p>
<p>Depending on your needs, as an option, you may choose to pass <b>onDisappear</b> callback to the <b>onDisable</b> slot. This way the the hook will report disappearance when screen goes out of focus and the tracked element becomes not visible.</p>

```tsx
const TrackedElement = ({ onAppear, onDisappear }: any) => {
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
<h4>Custom interaction handlers setup</h4>
<p>This example shows how to use provider component's support of children as render prop to manually assign all necessary props to the underlying components.</p>
<p>The same can be achieved without the usage of provider, by following the example in the <b>Interaction mode without provider</b> section.</p>
<p>This is useful when you need set custom component as parent, set some actions as interaction start/end for the tracking loop, for example clicking a 'Scroll to top' button.</p>
<p>The example shows all possible props the provider gives, you can pick only what you need and spread the rest.</p>

```tsx
const App = () => {
  return (
    <AppearObserverProvider>
      {
        ({ 
           collapsable, 
           onLayout, 
           onScroll, 
           onScrollBeginDrag, 
           onScrollEndDrag, 
           onTouchStart, 
           onTouchEnd, 
           onTouchMove, 
           onTouchCancel, 
           onMomentumScrollEnd,
           interactionRecorders,
        }) => (
          <>
            <ScrollView 
              collapsable={collapsable} 
              onLayout={onLayout}
              onScrollBeginDrag={onScrollBeginDrag}
              onScrollEndDrag={onScrollEndDrag}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              onTouchMove={onTouchMove}
              onTouchCancel={onTouchCancel}
              onMomentumScrollEnd={onMomentumScrollEnd}
            >
              <TrackedComponent />
            </ScrollView>
            <ActionButton title="Scroll to top" onPress={() => {
              interactionRecorders.recordInteractionStart()
              scrollToTop()
            }} />
          </>
        )
      }
    </AppearObserverProvider>
  )
}
```

<h2>Optimisations</h2>
<p>There are a few technics to optimize the tracking loop.</p>
<ul>
  <li><b>recalculateParentBoundaries</b> can be set to <b>false</b> if the parent component's size and position, or the component itself, doesn't change. The observer will cache the first measured boundaries in this case.</li>
  <li><b>intervalDelay</b> can be adjusted for less frequent loop cycles.</li>
  <li><b>enabled</b> can be set to <b>false</b> when tracking becomes unnecessary.</li>
</ul>

<h2>API</h2>
<h3>useAppearObserver</h3>
<p>The core hook that performs tracking of the component by running a loop measuring the component's position.</p>
<h4>Props</h4>

| Prop                   | Description                                                                                                                                                                                    | Default value |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| _elementRef_           | External ref to use instead of the one created by the hook. Use if you need to work with the tracked element by ref. No ref merging happens, the external one overrides the internal default.  | -             |
| _parentRef_            | Optional props for usage without context. Provides parent element ref directly to the hook, overrides the ref supplied by context.                                                             | -             |
| _onAppear_             | Callback that triggers when the element comes into visibility.                                                                                                                                 | -             |
| _onDisappear_          | Callback that triggers when the element disappears.                                                                                                                                            | -             |
| _onEnable_             | Callback that fires when tracking gets enabled.                                                                                                                                                | -             |
| _onDisable_            | Callback that fires when tracking gets disabled.                                                                                                                                               | -             |
| _enabled_              | Flag which toggles tracking on and off. Useful when tracking needs to be reset, like in case with react navigation.                                                                            | true          |
| _interactionListeners_ | Slot for interaction listeners passed from parent, for usage without context.                                                                                                                  | -             |

<h4>Options</h4>

| Option                        | Description                                                                                                                                             | Default value     |
|-------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|
| _visibilityThreshold_         | Defines what part of an element should be visible for it to trigger callback, from 0 to 1.                                                              | 0.001             |
| _intervalDelay_               | Determines a delay in milliseconds between visibility check repetitions.                                                                                | 50                |
| _recalculateParentBoundaries_ | Tells whether observer should measure parent element boundaries on every on every check or measure once and cache.                                      | true              |
| _parentOffsets_               | Sets additional static offsets added to the calculated parent boundaries. Useful if you need to consider the height of some header inside a ScrollView. | 0 for each corner |
| _interactionModeEnabled_      | Makes the tracking loop fire only when user interaction has happened. When disabled, the loop runs indefinitely until stopped by <b>enabled</b> prop.   | true              |
| _useScreenIfNoParent_         | Provides an option to track the element relative to screen instead of parent element. Only works if parent ref is not passed.                           | false             |
| _optimizeOutOfScreen_         | Doubles the delay between loop cycles if the element is out of screen. A small optimization, candidate for improvement.                                 | true              |

<h4>Returns</h4>

| Prop        | Description                                                                                                                                                             |
|-------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| _refProps_  | Ref and props that prevent element from being collapsed, see <b>useObservableTargetRef</b>                                                                              |
| _restart_   | A handler to manually restart the observer. Can be used to trigger <b>onAppear</b> manually, for example when element's visibility hasn't changed, but its content has. |


<h3>AppearObserverProvider</h3>
<p>Component that provides a parent ref and interaction listeners through context for observers down the tree.</p>
<p>Modifies the props of its child component by attaching event listeners to interaction callbacks like onScroll.</p>
<i>Component is designed to provide minimalistic default usage, so it makes all arrangements under the hood. By default, it attaches all kinds of event listeners to the child element, with ScrollView in mind, but the element may not support some of them and these events will be ignored, or have different event callbacks. For manual setup provide children as render prop and arrange all listeners manually.</i>
<h4>Props</h4>

| Prop                     | Description                                                                                                                                                                                                                                         | Default value     |
|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|
| _enableInteractionMode_  | When true, the touch handlers are attached to the child element of the provider, and child observers run checks only upon touch interactions, stopping them after a period of inactivity.                                                           | true              |
| _ref_                    | An external ref to pass to the provider's child element. Provider sets it's own ref by default, but can use external one for its operations. No ref merging happens, the external one overrides the internal default.                               | _                 |
| _children_               | React element or render prop for manual setup.                                                                                                                                                                                                      | _                 |
| _offsets_                | Additional static offsets added to the parent element's boundaries. Can be used to account for ScrollView headers in calculations.                                                                                                                  | 0 for each corner |
| _onLayout, onScroll etc_ | Callbacks to be passed to the child component on top of the provider's internal ones. When an element is wrapped with provider, you have to pass these callbacks to the provider instead of the target element, otherwise provider overwrites them. | -                 |

<h3>useInteractionManager</h3>
<p>A hook that returns interaction event handlers and interaction listeners for attaching them to the parent component and observers respectfully.</p>
<p>Used inside Provider, but exposed for setting up interaction mode tracking without provider.</p>
<h4>Props</h4>

| Prop                                               | Description                                                        | Default value     |
|----------------------------------------------------|--------------------------------------------------------------------|-------------------|
| _onScroll, onScrollBeginDrag, onScrollEndDrag etc_ | External listeners to be attached alongside internal service ones. | true              |

<h4>Returns</h4>

| Prop                   | Description                                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| _interactionHandlers_  | Callbacks for interaction events that trigger to be attached to parent component. They trigger the tracking loop start.                                                |
| _interactionRecorders_ | Separate callbacks that can be attached to any event to mark it as interaction start or end. For example can serve to set 'Scroll to top' button press as interaction. |
| _interactionListeners_ | Interaction listeners to be passed to useAppearObserver hook of the tracked components so that they can listen to parent interactions.                                 |


<h3>useObservableTargetRef</h3>
<p>A hook that incapsulates props necessary to prevent element from being collapsed, and a ref. Can be used to attach these props to the parent component in no provider, if it can be collapsed.</p>
<h4>Props</h4>

| Prop  | Description                                                           | Default value |
|-------|-----------------------------------------------------------------------|---------------|
| _ref_ | External ref to be used instead of the default one set up internally. | -             |

<h4>Returns</h4>

| Prop          | Description                                                                               |
|---------------|-------------------------------------------------------------------------------------------|
| _ref_         | A regular React ref                                                                       |
| _collapsable_ | Set to true, prevents native node from being collapsed.                                   |
| _onLayout_    | Also serves for collapse prevention, as <b>collapsable</b> is currently only for Android. |
