---
sidebar_position: 1
---

# Actions

Actions are very similar to reducers, but they don't need to return the new state. This means actions are flexible.

### How do they work?

When you add an action to an atom, it will always have access to the current state and the state setter of that atom.
The only thing you need to pass when calling an action are the arguments or argument you need.
Actions need to be added in the `actions` object of your atom


Example

```jsx
import { atom } from "atomic-state"

const inputValue = atom({
  name: "inputValue",
  default: "",
  actions: {
    changeCase({ args, state, dispatch }) {
      switch (args.type) {
        case "upper":
          dispatch(state.toUpperCase())
          break
        case "lower":
          dispatch(state.toLoweCase())
          break
        default:
          break
      }
    },
    reset({ dispatch }) {
      dispatch("")
    }
  },
})

```

And this is how you would use those actions

```jsx
function App() {
  const { changeCase, reset } = useActions(inputValue)

  return (
    <React.Fragment>
      <button onClick={() => changeCase({ type: "upper" })}>Uppercase</button>
      <button onClick={() => changeCase({ type: "lower" })}>Lowercase</button>
      <button onClick={reset}>Reset</button>
    </React.Fragment>
  )
}

```

> We are only passing one argument, which is an object in this case. That argument will become the `args` property in our action definition