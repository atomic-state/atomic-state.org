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

Lets start adding todos

```jsx
import { useState } from "react"
import { atom, useAtom } from "atomic-state"

const TODOS = atom({
  name: "TODOS",
  default: []
})

export default function App() {
  const [todos, setTodos] = useAtom(TODOS)

  // The todo to add
  const [newTodo, setNewTodo] = useState("")

  const changeTodoText = (e) => setNewTodo(e.target.value)

  const addTodo = () => {
    // adding a todo with completed: false
    setTodos((p) => [
      ...p,
      {
        title: newTodo,
        completed: false
      }
    ])
    // Reseting the new todo title
    setNewTodo("")
  }

  return (
    <div>
      <p>Total todos: {todos.length}</p>
      <input type="text" value={newTodo} onChange={changeTodoText} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.title}>{todo.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

As you can see, the `setTodos` works just the same as a `setState` function


#### Initial value

The `default` property can also be a sync/async function, or a function that returns a promise

These are some valid cases of using a default state


**Case 1** : normal

```jsx
// the default property will be available during render
const tasks = atom({
  name: "user_tasks",
  default: []
})
```

**Case 2** : using an async function

```jsx
// When the initial value resolves, all subscribers will be 'notified'
// So they will have access to its resolved value. While it is resolving
const user_info = atom({
  name: "user_info",
  default: async () => {
    const res = await fetch("/backend/get_info?id=" + id)
    const info = await res.json()
    return info
  }
})
```

**Case 3**: a function that returns a Promise

```jsx
// This works the same as in case 2
const user_info = atom({
  name: "user_info",
  default: () => {
    const data = fetch("/backend/get_info?id=" + id).then((d) =>
      d.json()
    )
    return data
  }
})
```
You can remove the return keyword from the last example

```jsx
// This works the same as in case 2 and 3
const user_info = atom({
  name: "user_info",
  default: () => fetch("/backend/get_info?id=" + id).then((d) => d.json())
})
```