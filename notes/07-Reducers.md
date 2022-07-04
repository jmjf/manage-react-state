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
