---
sidebar_position: 3
---

# SSR

Server side rendering is a very important feature in modern React applications. The `default` property of an atom is rendered in the server (this doesn't work with initial states that return promises or are async functions), but you can also use the `AtomicState` component provided by atomic-state.

This allows you to define default values for atoms and filters.

**This component needs to appear before any component that uses your atoms**

Example:

```jsx
import { atom, useValue, AtomicState } from "atomic-state"

const TODOS = atom({
  name: "TODOS",
  // we are ommiting the default property, as its default value should be dynamic
  // and come from the server
})



function TodoWrapper() {
  const todos = useValue(TODOS)
  return (
    <div>
      <pre>{JSON.stringify(todos, null, 2)}</pre>
    </div>
  )
}


// Our App component uses the AtomicState component
// before other components access our atoms.
// This creates a good SSR
export default function App({ todos }) {
  return (
    <AtomicState
      atoms={{
        todos,
      }}
    >
      <TodoWrapper />
    </AtomicState>
  )
}

// SSR example with Next.js
export async function getServerSideProps(context) {
  const userTodos = getTodosFromDb(context)

  return {
    props: {
      todos: userTodos,
    },
  }
}

```