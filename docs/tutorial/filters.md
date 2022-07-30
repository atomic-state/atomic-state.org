---
sidebar_position: 2
---

# Filters

Filters are pieces of derived state. They listen to updates to atoms and filters they are subscribed to.

Let's go back to our example todo app. Specifically at this code:

```jsx
export default function App() {

  const todos = useValue(todosState)

  return (
    <AtomicState>
      <div>
        <p>Total todos: {todos.length}</p>
        <AddTodoForm />
        <ShowTodos />
      </div>
    </AtomicState>
  )
}
```

Now, our `App` component not only has the responsibility to show the state of our app, but it somehow has to do some of the processing of that state to show what we need. This means that any time we want to know how many todos we have, we need to call the value of the `todosState` atom and get its length. We need to do something like filter what we need. To achieve that, we can use a `filter`. Filters can get the value of atoms and filters and subscribe to their changes.

A fitler can be created using the `filter` function.

```jsx
import { AtomicState, atom, filter } from "atomic-state"

// Our todos atom
const todosState = atom({
  name: "todosState",
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
const totalTodosState = filter({
  name: "totalTodosState",
  get({ get }) {
    
    const todos = get(todosState)

    return todos.length
  }
})
```

Or you can use an async function

```jsx
const totalTodosState = filter({
  name: "totalTodosState",
  // because it' an async function, while the filter is resolving, this will be returned instead
  default: [],

  async get({ get }) {

    const todos = get(todosState)

    return todos.length
  }
})
```

We can now use it anywhere we need the number of todos.

```jsx
export default function App() {

  const totalTodos = useFilter(totalTodosState)

  return (
    <AtomicState>
      <div>
        <p>Total todos: {totalTodos}</p>
        <AddTodoForm />
        <ShowTodos />
      </div>
    </AtomicState>
  )
}
```

Now we can move our `useFilter` call to another component. Let's call it `ShowTotalTodos`.

```jsx
function ShowTotalTodos() {

  const totalTodos = useFilter(totalTodosState)

  return <p>Total todos: {totalTodos}</p>
}
```

And our app will now look like this:

```jsx
export default function App() {
  return (
    <AtomicState>
      <div>
        <ShowTotalTodos />
        <AddTodoForm />
        <ShowTodos />
      </div>
    </AtomicState>
  )
}
```
As an example, let's filter only the completed todos:

```jsx
const completedTodosState = filter({
  name: "completedTodosState",
  get({ get }) {

    const todos = get(todosState)

    return todos.filter((todo) => todo.completed)
  }
})
```

And use it in a component, let's call it `ShowCompletedTodos`:

```jsx
function ShowCompletedTodos() {

  const completedTodos = useFilter(completedTodosState)

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
   <AtomicState>
      <div>
        <ShowTotalTodos />
        <AddTodoForm />
        <ShowTodos />
        <hr />
        <ShowCompletedTodos />
      </div>
    </AtomicState>
  )
}
```

And this is our whole app so far:

```jsx
import React, { useState } from "react"

import { AtomicState, atom, useActions, useValue, filter, useFilter } from "atomic-state"

const todosState = atom({
  name: "todosState",
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
const totalTodosState = filter({
  name: "totalTodosState",
  async get({ get }) {

    const todos = get(todosState)
    return todos.length
  }
})

const completedTodosState = filter({
  name: "completedTodosState",
  get({ get }) {

    const todos = get(todosState)

    return todos.filter((todo) => todo.completed)
  }
})

function ShowTodos() {

  const todos = useValue(todosState)

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.title}>{todo.title}</li>
      ))}
    </ul>
  )
}

function AddTodoForm() {

  const todoActions = useActions(todosState)

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

  const totalTodos = useFilter(totalTodosState)

  return <p>Total todos: {totalTodos}</p>
}

function ShowCompletedTodos() {

  const completedTodos = useFilter(completedTodosState)

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
    <AtomicState>
      <div>
        <ShowTotalTodos />
        <AddTodoForm />
        <ShowTodos />
        <hr />
        <ShowCompletedTodos />
      </div>
    </AtomicState>
  )
}

```

Check it out:

<iframe src="https://codesandbox.io/embed/documentation-tutorial-project-9kl1p1?fontsize=14&hidenavigation=1&theme=dark"
     style={{width:"100%", height:'500px', border:0, borderRadius: '4px', overflow:'hidden',}}
     title="documentation-tutorial-project"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>