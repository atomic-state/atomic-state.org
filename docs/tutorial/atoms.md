---
sidebar_position: 1
---

# Atoms

Atoms are pieces of state that can be read and updated from components and hooks. They are the core of Atomic State.

For this tutorial, we will be building a todo app to show some features offered by the library.

## Creating an atom

Creating an atom is very simple. There are two ways to do it: you can declare it as a plain object, or use the `atom` function provided by `atomic-state`. Both approaches work the same and are completely up to you.

When you create an atom, you need to provide a `name` property, which is used to keep track of the atom's value.
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

As you can see, the `setTodos` works just the same as a `setState` functio


#### Actions

Let's go back to our example

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

We are declaring a function called `addTodo` that has only one responsibility: adding a todo to the todo list. We can take that function and add is an action in our atom.

Actions work like reducers, but they don't return the new state. Instead they act like pure functions that receive three props: `args`, `state` and `dispatch`

To add actions to our atom, add them in the `actions` property.

This is our updated atom


```jsx
const TODOS = atom({
  name: "TODOS",
  default: [],
  actions: {
    addTodo({ args, state, dispatch }) {
      const { title } = args
      dispatch((p) => [
        ...p,
        {
          title,
          completed: false
        }
      ])
    }
  }
})
```

These actions will be available in an actions object. Let's use this action in our component

```jsx
export default function App() {
  const [todos, setTodos, todoActions] = useAtom(TODOS)

  // The todo to add
  const [newTodo, setNewTodo] = useState("")

  const changeTodoText = (e) => setNewTodo(e.target.value)

  const addTodo = () => {
    todoActions.addTodo({
      title: newTodo
    })
    setNewTodo("")
  }

  return (
    <div>
      <p>Total todos: {todos?.length}</p>
      <input type="text" value={newTodo} onChange={changeTodoText} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos?.map((todo) => (
          <li key={todo.title}>{todo.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

As you can see, `useAtom` returns three items: the state value, the function to update that state, and the actions.
These actions are special because you don't need to pass them the `state` or `dispatch` props, they are available the moment an action is run, and they have access to the last value and state setter of your atom. The only argument your actions take is the `arg` you need in your action, as you can see in this code:

```jsx
  const [todos, setTodos, todoActions] = useAtom(TODOS)

  // The todo to add
  const [newTodo, setNewTodo] = useState("")

  const changeTodoText = (e) => setNewTodo(e.target.value)

  const addTodo = () => {
    todoActions.addTodo({
      title: newTodo
    })
    setNewTodo("")
  }
```

But now we don't need to read the `setTodos` item. Let's look at other useful hooks.


### `useValue`

This hook returns the value of your atom, and any components subscribed will re-render when that value changes.
With that hook, using our `TODOS` atom would look like this:

```jsx
  const todos = useValue(TODOS)
  const [, , todoActions] = useAtom(TODOS)

  // The todo to add
  const [newTodo, setNewTodo] = useState("")

  const changeTodoText = (e) => setNewTodo(e.target.value)

  const addTodo = () => {
    todoActions.addTodo({
      title: newTodo
    })
    setNewTodo("")
  }
```

Look at line 2. We are only using one item returned from `useAtom`. Let's use another hook that can help us with that.

### `useActions`

This returns only the actions object of our atom:

```jsx
  const todos = useValue(TODOS)
  const todoActions = useActions(TODOS)

  // The todo to add
  const [newTodo, setNewTodo] = useState("")

  const changeTodoText = (e) => setNewTodo(e.target.value)

  const addTodo = () => {
    todoActions.addTodo({
      title: newTodo
    })
    setNewTodo("")
  }
```

### `useDispatch`

This returns only the function that updates our atom's value. If we wanted to read the three, it would look like this:

```jsx
  const todos = useValue(TODOS)
  const setTodos = useDispatch(TODOS)
  const todoActions = useActions(TODOS)

  // The todo to add
  const [newTodo, setNewTodo] = useState("")

  const changeTodoText = (e) => setNewTodo(e.target.value)

  const addTodo = () => {
    todoActions.addTodo({
      title: newTodo
    })
    setNewTodo("")
  }

  // Using the setState action
  const addTodoWithDispatch = () => {
    setTodos((p) => [
      ...p,
      {
        title: newTodo,
        completed: false
      }
    ])
    setNewTodo("")
  }
```

### Separating concerns

Our app looks good so far, but now we have a component that reads and updates the state. Let's create one component for each concern.
For that matter, this is what we need:
- A component that renders our todos
- A component that adds a new todo

Let's take the `useValue` call and place it in a different component. Let's call it `ShowTodos`. This is how it will look:

```jsx
function ShowTodos() {
  const todos = useValue(TODOS)
  return (
    <ul>
      {todos?.map((todo) => (
        <li key={todo.title}>{todo.title}</li>
      ))}
    </ul>
  )
}
```

Great! Now we can move other logic to another component, let's call it `AddTodoForm`. Adding a todo to our todo list will be its only responsibility.

```jsx
function AddTodoForm() {
  const todoActions = useActions(TODOS)

  // The todo to add
  const [newTodo, setNewTodo] = useState("")

  const changeTodoText = (e) => setNewTodo(e.target.value)

  const addTodo = () => {
    todoActions.addTodo({
      title: newTodo
    })
    setNewTodo("")
  }
  return (
    <React.Fragment>
      <input type="text" value={newTodo} onChange={changeTodoText} />
      <button onClick={addTodo}>Add</button>
    </React.Fragment>
  )
}
```

With those changes, our app will look like this:

```jsx
export default function App() {
  const todos = useValue(TODOS)
  return (
    <div>
      <p>Total todos: {todos?.length}</p>
      <AddTodoForm />
      <ShowTodos />
    </div>
  )
}
```

And our whole file would look like this

```jsx
import React, { useState } from "react"
import { atom, useActions, useValue } from "atomic-state"

const TODOS = atom({
  name: "TODOS",
  default: [],
  actions: {
    addTodo({ args, state, dispatch }) {
      const { title } = args
      dispatch((p) => [
        ...p,
        {
          title,
          completed: false
        }
      ])
    }
  }
})

function ShowTodos() {
  const todos = useValue(TODOS)
  return (
    <ul>
      {todos?.map((todo) => (
        <li key={todo.title}>{todo.title}</li>
      ))}
    </ul>
  )
}

function AddTodoForm() {
  const todoActions = useActions(TODOS)

  // The todo to add
  const [newTodo, setNewTodo] = useState("")

  const changeTodoText = (e) => setNewTodo(e.target.value)

  const addTodo = () => {
    todoActions.addTodo({
      title: newTodo
    })
    setNewTodo("")
  }
  return (
    <React.Fragment>
      <input type="text" value={newTodo} onChange={changeTodoText} />
      <button onClick={addTodo}>Add</button>
    </React.Fragment>
  )
}

export default function App() {
  const todos = useValue(TODOS)
  return (
    <div>
      <p>Total todos: {todos?.length}</p>
      <AddTodoForm />
      <ShowTodos />
    </div>
  )
}
```

Congratulations! You just built a todo list with Atomic State.

[Advanced features](/docs/category/advanced-features)