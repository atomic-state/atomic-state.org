---
sidebar_position: 3
---

# SSR

Server side rendering is a very important feature in modern React applications. The `default` property of an atom is rendered in the server, but you can also use the `AtomicState` component provided by atomic-state.

This allows you to define default values for atoms.

**This component needs to appear before any component that uses atoms and filters**

Example:

```jsx
import { atom, useValue, AtomicState } from "atomic-state"

const todosState = atom({
  name: "todosState",
  // we are ommiting the default property, as its default value should be dynamic
  // and come from the server
})



function TodoWrapper() {

  const todos = useValue(todosState)

  return (
    <div>
      <pre>{JSON.stringify(todos, null, 2)}</pre>
    </div>
  )
}


// Our App component uses the AtomicState component
// before other components use our atoms.
// This creates a good SSR
export default function App({ todosState }) {
  return (
    <AtomicState

      // Optional: A different prefix allows you to have different
      // state providers that are independent from each other
      prefix="store"
      
      atoms={{
        todosState,
      }}
    >
      <TodoWrapper />
    </AtomicState>
  )
}

// SSR example with Next.js
export async function getServerSideProps(context) {

  const userTodos = await getTodosFromDb(context)

  return {
    props: {
      todosState: userTodos,
    },
  }
}

```