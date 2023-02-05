<h1>react-native-appear-observer</h1>

A React Native library to detect element appearance on the screen

<h2>Usage</h2>

Wrap the parent component with provider and supply it with parent view ref.
```ts
const App = () => {
  const scrollViewRef = useRef<ScrollView>(null)

  return (
    <AppearObserverProvider parentRef={scrollViewRef}>
      <ScrollView ref={scrollViewRef}>
        {/* content */}
      </ScrollView>
    </AppearObserverProvider>
  )
}
```
Use the useIsAppeared hook if you want component's visibility to be reflected in it's state.
```ts
const TestView = () => {
  const elementRef = useRef<View>(null)

  const [isAppeared, setIsAppeared] = useIsAppeared(elementRef)

  const elementStyle = useMemo(() => {
    return [
      styles.testView,
      {
        backgroundColor: isAppeared ? 'red' : 'blue'
      }
    ]
  }, [isAppeared])

  return (
    <View ref={elementRef} style={elementStyle}/>
  )
}
```

Or use useAppearObserver hook if you want to attach callback to visibility change without changing state.
```ts
const TestView = ({ onAppear, onDisappear }: any) => {
  const elementRef = useRef<View>(null)

  useAppearObserver({
    elementRef,
    onAppear,
    onDisappear,
  })

  return (
    <View ref={elementRef} style={elementStyle} />
  )
```


<h2>Options</h2>
| Option | Description | Default |
|---|---|---|---|
| visibilityThreshold | Defines what part of an element should be visible for it to trigger callback, from 0 to 1.  | 0 |
| intervalDelay | Determines a delay in milliseconds between visibility check repetitions.  | 100 |
| recalculateParentBoundaries | Tells if observer should measure parent element boundaries on every on every check or measure once and cache. | false |

<h2>Known issues</h2>
- Observing stops in horizontal lists on Android if provider is attached to parent vertical scroll view and scrolling is performed
  holding screen with one finger and moving another
