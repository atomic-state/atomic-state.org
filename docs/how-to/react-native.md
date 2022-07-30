---
sidebar_position: 0
---

# React Native

Everything works the same except for `persist`

If you want persistence in react native, you can use a custom `localStorage` implementation that has the `getItem`, `setItem` and `removeItem` methods, and after that, you can use the `persist` property in your atoms.

We have a starter project with a `localStorage` implementation that uses React Native's `AsyncStorage` library (see [here](https://react-native-async-storage.github.io/async-storage/))

You can check it out here: https://github.com/atomic-state/reactnative-starter

This is how it's used in that project:


```tsx
import Navigation from "components/Navigation"

import AsyncStorage from "@react-native-async-storage/async-storage"
import { AtomicState } from "atomic-state"

if (typeof localStorage === "undefined") {
  // Using AsyncStorage as localStorage
  global.localStorage = AsyncStorage as any
}

export default function App() {
  return (
    // AtomicState Root component
    <AtomicState>
      <Navigation />
    </AtomicState>
  )
}
```