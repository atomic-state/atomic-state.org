---
sidebar_position: 2
---

# Filters

Filters are pieces of derived state. They listen to updates to atoms they are subscribed to.

Let's go back to our example todo app. Specifically at this code:

```jsx
export default function App() {
  const todos = useValue(TODOS)
  return (
    <div>
      <p>Total todos: {todos.length}</p>
      <AddTodoForm />
      <ShowTodos />
    </div>
  )
}
```

Now, our `App` component not only has the responsibility to show the state of our app, but it somehow has to do some of the processing of that state to show what we need. This means that any time we want to know how many todos we have, we need to call the value of the `TODOS` atom and get its length. This problem can be solved with a `filter`. Filters can read the value of an atom and subscribe to its changes.

A fitler can be created using the `filter` function, or you can have a plain object, both approaches work the same.

```jsx
import { atom, filter } from "atomic-state"

// Our todos atom
const TODOS = atom({
  name: "TODOS",
  default: [],
  actions: {
    addTodo({ args, dispatch }) {
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

// Only returning the total todos
const TOTAL_TODOS = filter({
  name: "TOTAL_TODOS",
  get({ get }) {
    const todos = get(TODOS)
    return todos?.length
  }
})
```

Or you can use an async function

```jsx
// Only returning the total todos
const TOTAL_TODOS = filter({
  name: "TOTAL_TODOS",
  async get({ get }) {
    const todos = get(TODOS)
    return todos?.length
  }
})
```

We can now use it anywhere we need the number of todos.

```jsx
export default function App() {
  const totalTodos = useFilter(TOTAL_TODOS)
  return (
    <div>
      <p>Total todos: {totalTodos}</p>
      <AddTodoForm />
      <ShowTodos />
    </div>
  )
}
```

Now we can move our `useFilter` call to another component. Let's call it `ShowTotalTodos`.

```jsx
function ShowTotalTodos() {
  const totalTodos = useFilter(TOTAL_TODOS)
  return <p>Total todos: {totalTodos}</p>
}
```

And our app will now look like this:

```jsx
export default function App() {
  return (
    <div>
      <ShowTotalTodos />
      <AddTodoForm />
      <ShowTodos />
    </div>
  )
}
```
As an example, let's filter only the completed todos:

```jsx
const COMPLETED = filter({
  name: "COMPLETED",
  get({ get }) {
    const todos = get(TODOS)
    return todos?.filter((todo) => todo.completed)
  }
})
```

And use it in a component, let's call it `ShowCompletedTodos`:

```jsx
function ShowCompletedTodos() {
  const completedTodos = useFilter(COMPLETED)
  return (
    <div>
      <b>Completed todos</b>
      <ul>
        {completedTodos.map((todo) => (
          <li key={`completed-${todo.title}`}>{todo.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

Adding it to our app:

```jsx
export default function App() {
  return (
    <div>
      <ShowTotalTodos />
      <AddTodoForm />
      <ShowTodos />
      <hr />
      <ShowCompletedTodos />
    </div>
  )
}
```

And this is our whole app so far:

```jsx
import React, { useState } from "react"
import { atom, useActions, useValue, filter, useFilter } from "atomic-state"

const TODOS = atom({
  name: "TODOS",
  default: () => [],
  actions: {
    addTodo({ args, dispatch }) {
      const { title } = args
      dispatch((p) => [
        ...p,
        {
          title,
          completed: Math.random() > 0.5
        }
      ])
    }
  }
})

// Only returning the total todos
const TOTAL_TODOS = filter({
  name: "TOTAL_TODOS",
  async get({ get }) {
    const todos = get(TODOS)
    return todos?.length
  }
})

const COMPLETED = filter({
  name: "COMPLETED",
  get({ get }) {
    const todos = get(TODOS)
    return todos?.filter((todo) => todo.completed)
  }
})

function ShowTodos() {
  const todos = useValue(TODOS)
  return (
    <ul>
      {todos.map((todo) => (
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

function ShowTotalTodos() {
  const totalTodos = useFilter(TOTAL_TODOS)
  return <p>Total todos: {totalTodos}</p>
}

function ShowCompletedTodos() {
  const completedTodos = useFilter(COMPLETED)
  return (
    <div>
      <b>Completed todos</b>
      <ul>
        {completedTodos.map((todo) => (
          <li key={`completed-${todo.title}`}>{todo.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default function App() {
  return (
    <div>
      <ShowTotalTodos />
      <AddTodoForm />
      <ShowTodos />
      <hr />
      <ShowCompletedTodos />
    </div>
  )
}

```