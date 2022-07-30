---
sidebar_position: 2
---

# Effects

Effects run only when a state update is triggered or the persistence value is loaded. This means they don't run during the first render, only after a state update.
Effects are special: they can prevent state updates from being 'commited' to the actual state. We'll cover that in a few sections.

**Effects have to be included as an array of functions, using the `effects` property in an atom.**

These effects have access to four props: `previous`, `state`, `dispatch`, and `cancel`.

Let's cover each of them

### `previous`
This is the state that is currently being stored in that atom. This can be pretty confusing, because this state is the current one, not exactly the previous one. But this should make sense in the `state` explanation

### `state`
This is the new state that is ready to be set. Every action that reads this state is not reading the currently stored state: it's reading the upcoming state. It will become the current state once **every** action is run.
This allows us to do some interesting things. For example:

- **Prevent state updates**
  
  If any of the effects returns `false`, or calls the `cancel` function, the state update will be cancelled, and the re-renders that would have happened as a result of that state update, will **not** happen.

    **Example**

    What if our todo list can have a maximum of 10 items?

    This is how it can be done

    ```js
    import { atom } from "atomic-state"

    const todosState = atom({
      name: "todosState",
      default: [],
      effects: [
        ({ state }) => {
          // We are preventing the state update and possible react re-renders
          // If we try to add a new todo and there are already 10, the state update will
          // be cancelled and nothing will happen
          if (state.length > 10) return false
        },
        ({ previous, state }) => {
          console.log({ previous, state })
        },
      ],
    })
    ```

- **Update state**
  
  These effects can also update the state, but **be careful**, using this wrong can create an infinite loop.

    **Example**

    Once we already have 10 items in our todo list, remove all items

    Let's do it

    ```js
    import { atom } from "atomic-state"

    const todosState = atom({
      name: "todosState",
      default: [],
      effects: [
        ({ state, dispatch, previous }) => {
          
          // ❌ don't do this
          dispatch(state.length === 10? []: state)

          // ✔️ Only update when necesary
          if(state.length === 10) dispatch([])
        }
      ],
    })
    ```
### `dispatch`
This is the function that updates the state. The only argument it accepts is the new value for the state or a callback that returns the new state.

### `cancel`
This is mostly useful with async functions but works with sync functions too. Example:


**We cannot have 10 or more items:**
```js
import { atom } from "atomic-state"

const todosState = atom({
  name: "todosState",
  default: [],
  effects: [
    async ({ state, dispatch, previous, cancel }) => {
      if (state.length >= 10) cancel()
    }
  ],
})
```
