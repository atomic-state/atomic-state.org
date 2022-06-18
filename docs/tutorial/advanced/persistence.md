---
sidebar_position: 0
---

# Persistence

An atom's value can be saved to localStorage. For that, you need to pass `persistence: true` to your atom.

The value of the atom will be saved in JSON format, and its key in the `localStorage` object will be `store-` and the atom's name.

In our previous example, we had a todo app, and the atom that holds its state has an empty array as its default value

```js
import { atom } from "atomic-state"

const TODOS = atom({
    name: "TODOS",
    default: []
})
```

If we wanted its value to be persisted in localStorage, we can do so

```js
import { atom } from "atomic-state"

const TODOS = atom({
    name: "TODOS",
    default: [],
    persist: true,
})
```

This will make other tabs (that share the same url) sync that atom's value. This is useful if, for example, you don't want different states in different tabs.

We can also have a listener that will run when a tab is synchronized. This will be executed from other tabs, but not the current one.

```js
import { atom } from "atomic-state"

const TODOS = atom({
    name: "TODOS",
    default: [],
    persist: true,
    onSync(synced) {
        console.log("Value was synced", synched)
    }
})
```

This can be ommited if you don't want them to be in sync.

```js
import { atom } from "atomic-state"

const TODOS = atom({
    name: "TODOS",
    default: [],
    persist: true,
    sync: false
})
```
