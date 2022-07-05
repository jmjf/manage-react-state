# Using reducers

## Introduction

Before starting the video, reading [React docs on `useReducer`](https://reactjs.org/docs/hooks-reference.html#usereducer), it seems to be aimed at state for complex objects where the default `Object.is` comparison may not be good enough. It calls a function to dispatch (trigger) actions, which have a `type` member (always) and other data needed for the action (optional)). Different actions may have different shapes (discriminated union type for the action). `useReducer` takes, among other things, a function that it calls to dispatch, which takes the current state and the action. The function can directly manipulate the state (which isn't `useState` state) and returns the new state value. See also [this post](https://www.sumologic.com/blog/react-hook-typescript/) about using `useReducer` with TypeScript.

Now to the video.

-  Reducers are pure functions (declare them outside components to save alloc/dealloc overhead)
   -  In the functional programming sense
      -  No external dependencies (except arguments)
      -  No argument mutation
      -  No side effects (changes nothing outside the function)
      -  Returns a new value
-  `const [state, dispatcherFunction] = useReducer(reducerFunction, initialState)`
-  Benefits
   -  Extracts logic outside the component
   -  Reusable if other components need the same logic
   -  Unit testable
   -  Scales better than `useState`--pass the dispatcherFunction to children instead of callbacks (defined in parent)

Goal: Convert `Cart` to use `useReducer` instead of `useState`

-  I wonder if this will resolve some of my concerns about the complexity of the component

## Questions to research

-  If the arguments include a handle to an adapter (that connects to an API, database, etc.), could the reducer use the adapter?
   -  If so, how far does that go before it breaks the model too badly?

## Getting started

-  Create `src/reducers/cartReducer.ts`
   -  Can be a plain TS file because we shouldn't need any JSX notation (and if we do, it's easy to change)
-  Export `cartReducer(state: any, action: any): any`
   -  He names `state` as `cart`, but I haven't decided what I'm going to call it yet
   -  Types are temporary and will change; for example, will return same type as state

What code is related to managing the cart's state?

-  In `App`
   -  `ICartItem` interface definition (imported)
   -  `useState` for `cartItems`, which probably hints at what `state` should be called
   -  `useEffect` that updates localStorage
      -  This and the initializer suggest we're going to address my questions above
   -  An initializer function for the state that works with localStorage, plus some constants related to it
      -  I know a form of `useReducer` can take an initializer function
   -  Updater functions `addToCart`, `updateQuantity`, and `emptyCartItems`, which probably hint at actions
-  In `ProductDetail`
   -  Prop and call to `addToCart`
   -  It accepts `cartItems, but never uses it, so can eliminate that prop
-  In `Cart`
   -  Prop and call to `updateQuantity`
   -  Uses `cartItems` to build URLs for `useFetchAll`, but doesn't manipulate directly
-  In `Checkout`
   -  Prop and call to `emptyCartItems`
   -  It accepts `cartItems`, but never uses it, so can eliminate that prop

So, I think

-  The cart items will stay in `App` and get passed down as before, but will `useReducer`
-  The functions in `App` will become actions on the reducer
-  The children will use the dispatcher function
-  The `useEffect` and other code related to localStorage are TBD

**COMMIT: 7.0.1 - DOCS: intro to reducers; look at what's there and make a plan**

I've started the reducer, including the add item action

-  I types for each action (hardcoded string gets me type guards and required members) and a union type
   -  Types for empty and update qty are incomplete, will add to later
-  Wrote the `action.type` `switch` (do nothing for each action)
   -  I'd like to have a `default` or fall through condition in case an invalid type sneaks through at runtime, but TS/lint don't like me doing that, so trust the compiler to catch everything I can control and don't drive the action type of any kind of loaded/dynamic value that isn't safely constrained (which is a good idea anyway)
-  Moved the `addCartItem` code into and adjusted it (not deleted from `App` yet)
   -  He may destructure `action` because that seems to be popular, not sure it's worth it here

Let's commit that and see where he goes in the lecture.

**COMMIT: 7.0.2 - REFACTOR: partial; set up cartReducer and add item code**

I started with add, so of course he starts with empty "because it's the simplest." Okay, I can do that because it is simple.

And now he wants to talk about unexpected types (because his linter wants a `default`). TS/linter suggest I don't need to worry about that case because my type precludes it. My strategy would be either a `default` or a fallthrough (assuming all `case` branches `return`).

Now he does add

-  I renamed a few things, but not based on what he was doing, just looking at them and thinking about names
-  I destructured `id` and `sku` from `action`, still not sure it's worth it, but maybe and it doesn't hurt anything
-  I approached adding to the cart differently than he did (he `find`s first, then returns map or copy+insert depending on the value) and I'm leaving it as I have it

**COMMIT: 7.0.3 - REFACTOR: partial; add empty cart action code to cartReducer, rename a few values**

Now update

-  Again start with what's in `App`
-  Added `newQuantity` and `sku` to the update action type
-  Wrapped both the add and update `case` block in `{}` because both use `sku` and TS/linter see it as a redeclaration without the `{}`
   -  The `switch`'s `{}` are the block scope otherwise
-  Added a check to ensure the values are usable (return old otherwise)

Let's commit, then see what he does.

**COMMIT: 7.0.4 - REFACTOR: partial; add update cart code to cartReducer**

He has the same `sku` block issue and solves it the same way (except he only wraps one case).

Now, delete all the state updater functions in `App`, which breaks stuff in `App`.

Use the reducer in `App`

-  Replace `useState` with `useReducer`
-  He moves the intialize function outside the component and sets up an intial value based on it
   -  I'm going to make it an IIFE
   -  He doesn't use the init function (3rd arg)
-  Replace functions we were passing with the action dispatcher function
   -  Now I have type errors because the components expect a different function signature, so fix that
   -  Export a type for `CartItemDispatcher` from the reducer so I can use it everywhere `Dispatch<CartReducerAction>`
   -  In `ProductDetail`, add calls `dispatchCartItemsAction({type: 'AddItemToCart', id: product.id, sku: selectedSku})`
   -  In `Cart`, replace update with `dispatchCardItemsAction({ type: 'UpdateItemQuantity', sku, newQuantity: parseInt(e.target.value)})`
      -  Now that I have the dispatcher type correct, VSCode shows me options for `type` -- awesome!
   -  In `Checkout`, `dispatchCartItemsAction({type: 'EmptyCart'})`
   -  Also remove `cartItems` prop from `Checkout` and `ProductDetails` because neither uses it
   -  And remove a couple of `console.log`s from `Checkout` that I don't need now
-  Testing shows it works
   -  Shoes: lists shoes, filters by size, select shoe -> product detail
   -  Product detail: appears as expected, selects size, adds to cart
   -  Cart: list products added, changes quantity, cart contents survive reload (localStorage is working)
   -  Can navigate back to shoes and add more products to the cart
   -  Checkout: empties cart when done, writes data to `db.json`
-  Linter is complaining because I like to put `break`s at the end of `case`s, even if the case returns (unreachable code)
   -  Fine, make it happy, replace with a comment that the return replaces break

Based on what I'm seeing, the reducer can't handle an adapter unless that adapter is passed to the components that call it. Maybe it could if we did that, but it would probably be undesirable. The reducer value is state, just not `useState` state and managed differently. IMO, the action dispatch approach has some definite advantages, though it's best with TS enforcing and prompting for action types, etc. I'm curious how it plays with context (next unit).

**COMMIT: 7.0.5 - REFACTOR: replace state in App and child components with the reducer**
