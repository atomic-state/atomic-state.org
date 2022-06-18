---
sidebar_position: 0
---

# React Native

Everything works the same except for `persist`

If you want persistence in react native, you can create a custom `localStorage` implementation that has the `getItem`, `setItem` and `removeItem` methods, and after that, you can use the `persist` property in your atoms.

We have a starter project with a `localStorage` implementation that uses React Native's `AsyncStorage` library (see [here](https://react-native-async-storage.github.io/async-storage/))

You can check it out here: https://github.com/atomic-state/reactnative-starter

This is the implementation used in that project:

```ts
import AsyncStorage from "@react-native-async-storage/async-storage"

const storageExists = typeof localStorage !== "undefined"

// Our localStorage implementation.
export const Store = {
  /**
   * Initialize `localStorage` like object using AsyncStorage
   */
  async init(callback: any = () => {}) {
    try {
      if (typeof localStorage === "undefined") {
        global.localStorage = {} as any
        global.localStorage = {
          ...global.localStorage,
          removeItem(k) {
            delete localStorage[k]
            AsyncStorage.removeItem(k)
          },
          setItem(s, v) {
            localStorage[s] = v
            AsyncStorage.setItem(s, v)
          },
          clear() {},
          getItem(s) {
            return localStorage[s]
          }
        }
        // Load al saved keys present in localStorage
        const storageKeys = await AsyncStorage.getAllKeys()

        storageKeys.forEach(async (key) => {
          const jsonValue = await AsyncStorage.getItem(key)
          localStorage[key] = jsonValue
        })
      }
    } catch (err) {
    } finally {
      // Wait for 300ms
      const tm = setTimeout(() => {
        callback()
        clearTimeout(tm)
      }, 300)
    }
  },
  async get<T>(key: string, def?: T) {
    const data = await AsyncStorage.getItem(`${key}`)
    const value = await JSON.parse(data as unknown as string)
    return (typeof value === "undefined" ? def : value) as T
  },
  async set<T>(key: string, data: T) {
    try {
      await AsyncStorage.setItem(`${key}`, JSON.stringify(data))
      return true
    } catch (err) {
      throw err
    }
  },
  async remove(key: string) {
    await AsyncStorage.removeItem(`${key}`)
    if (storageExists) {
      localStorage.removeItem(key)
    }
  }
}

export default Store
```


And we create a wrapper component that initializes our `localStorage` implementation and renders its children once our storage is ready. We add a timeout because asynchronously loading the device's storage takes time:

```tsx
import { useEffect, useState } from "react"

import Store from "lib/Store"

export default function AppWrapper({ children }: any) {
  const [storageReady, setStorageReady] = useState(false)

  useEffect(() => {
    Store.init(() => setStorageReady(true))
  }, [])

  return storageReady && children
}
```


And we render our app

```tsx
import Navigation from "components/Navigation"
import AppWrapper from "components/AppWrapper"

export default function App() {
  return (
    <AppWrapper>
      <Navigation />
    </AppWrapper>
  )
}
```