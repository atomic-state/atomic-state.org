---
sidebar_position: 4
---

# Typescript

### atoms

An atom's type is inferred from its default value, but if you want to add typing, atoms accept two type arguments, the first one is the data type our atom will have, and the second one is used to add typing to the `args` properties of our actions.


```tsx
type TodoType = {
  id: number
  title: string
  completed: boolean
}

const todosState = atom<TodoType[]>({
  name: "todosState",
  // If type doesn't match, typescript will be angry
  default: [],
})
```

That's almost everything you need in atoms, because `useAtom`, `useValue` and `useDispatch` all infer the atom type when you use them, and show you errors when something's wrong.

But what if I want to add typing to actions `args`?

You can add typing to **every** action

All you need to do is create an interface or object type that contains your actions names, **and the type of the `args` property they accept**

Let's do it

```tsx
import { atom, useActions } from "atomic-state"

type TodoType = {
  id: number
  title: string
  completed: boolean
}

interface ITodoActionsArgs {

  // This means that we need to pass
  // a todo to to our addTodo action
  addTodo: TodoType
}


const todosState = atom<TodoType[], ITodoActionsArgs>({
  name: "todosState",
  default: [],
  actions: {
    // 'args' will be inferred as 'TodoType'!
    addTodo({ args, dispatch }) {
      dispatch((previous) => [...previous, args])
    }
  }
})

function App() {
  
  const todoActions = useActions(todosState)

  const newTodo = {
    id: 1,
    title: "my new todo",
  }

  return (
    <div>
      <button
        onClick={() => {
          // ❌ We get a typescript error, because we are
          // missing the 'completed' property in the new todo
          todoActions.addTodo(newTodo)
        }}
      >
        Add new todo
      </button>
    </div>
  )
}
```


### Filters

Filters can also have typing. Type is also inferred from the `default` property, or the return type of the `get` function, but `default` has precedence over it.

Example

```tsx
import { filter } from "atomic-state"

const completedTodosState = filter<TodoType[]>({
  name: "completedTodosState",
  // If default does not match
  // or the get function's return type does not match
  // typescript will yell at us
  default: [],
  get({ get }) {
    const todos = get(todosState)
    return todos.filter((todo) => todo.completed)
  },
})

```