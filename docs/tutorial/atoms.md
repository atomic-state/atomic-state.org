---
sidebar_position: 1
---

# Atoms

Atoms are pieces of state that can be read and updated from components and hooks. They are the core of Atomic State.

For this tutorial, we will be building a todo app to show some features offered by the library.

## Creating an atom

Creating an atom is very simple. There are two ways to do it: you can declare it as a plain object, or use the `atom` function provided by `atomic-state`. Both approaches work the same and are completely up to you.

Whe you create an atom, you need to provide a `name` property, which is used to keep track of the atom's value.
You can also provide an optional `default` property, similar to providing a default value when using `useState`.

We will see other properties later in this tutorial.

### Creating the `TODOS` atom

First, we need to create the container for our todos. We will create an atom that will have an empty array as its default value.

#### Using `atom`

```jsx
import { atom } from "atomic-state"

const TODOS = atom({
    name: "TODOS",
    default: []
})
```

#### Using a plain object

```jsx
const TODOS = {
    name: "TODOS",
    default: []
}
```

We can start using our atom anywhere in our app

### Using an atom

Now that you created your first atom, it's time to use it to store our todos. The API for using atoms is similar to using `useState`


```jsx
import { atom, useAtom } from "atomic-state"

const TODOS = atom({
  name: "TODOS",
  default: []
})

export default function App() {
  const [todos, setTodos] = useAtom(TODOS)
  return (
    <div>
      <p>Total todos: {todos.length}</p>
    </div>
  )
}
```
