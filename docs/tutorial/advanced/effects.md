---
sidebar_position: 2
---

# Effects

Effects run only when a state update is triggered. This means they don't run during render, but before.
Effects are special: they can prevent state updates from being 'commited' to the actual state. We'll cover that in a few moments.

**Effects have to be included as an array of functions, using the `effects` property in an atom.**

These effects have access to three props: `previous`, `state` and `dispatch`.

Let's cover each of them

### `previous`
This is the state that is currently being hold in that atom. This can be pretty confusing, as this state is the current one, not exactly the previous one. But this should make sense in the `state` explanation

### `state`
This is the new state that is ready to be set. Every action that reads this state is not reading the current state: it's reading the upcoming one. It will become the current state once **every** action is run.
This allows us to do some interesting things. For example:

- **Prevent state updates**
  
  If any of the effects returns `false`, the state update will be cancelled, and the re-renders that would have happened as a result of that state update, will **not** happen.

    **Example**

    What if our todo list can only have a maximum of 10 items?

    This is how it can be done

    ```js
    import { atom } from "atomic-state"

    const TODOS = atom({
      name: "TODOS",
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
  
  These effects can also update the state, but **be careful**, using this wrong can create an infnite loop.

    **Example**

    If we already have 10 items in our todo list, remove all items

    Let's do it

    ```js
    import { atom } from "atomic-state"

    const TODOS = atom({
      name: "TODOS",
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