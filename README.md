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
Use the useAppearObserver hook inside component whose appearance you want to track.
```ts
const TestView = () => {
  const elementRef = useRef<View>(null)

  const [isAppeared, setIsAppeared] = useState(false)

  const handleAppear = useCallback(() => {
    setIsAppeared(true)
  }, [])

  const handleDisappear = useCallback(() => {
    setIsAppeared(false)
  }, [])

  useAppearObserver({
    elementRef,
    onAppear: handleAppear,
    onDisappear: handleDisappear
  })

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
