---
sidebar_position: 0
---

# Getting started

Atomic State is a state managment library for React that allows you to share state between components and hooks. It supports Server Side Rendering, persistence, async queries, and more.


To get started install Atomic State

```
yarn add atomic-state
```

Or

```
npm install atomic-state
```

Or use it in the browser:

```html
<!-- Don't forget to include React and ReactDOM -->
<script src="https://unpkg.com/react@18.2.0/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js" crossorigin></script>


<!-- Including Atomic State -->
<script src="https://unpkg.com/atomic-state@2.1.0/dist/atomic-state.min.js"></script>
```


Wrap your app with the `AtomicState` component:

```tsx
import { AtomicState } from "atomic-state"

export default function App(){
   return (
    <AtomicState>
      <MyApp />
    </AtomicState>
   )
}
```