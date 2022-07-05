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

Catch up the video to where I am

-  Watching him make changes, I'm glad I'm using TS because it warns on so many little pitfalls

## Comparing useState and useReducer

|| `useState` || `useReducer` ||
| easy to implement | more scalable for complex scenarios |
| easy to learn | - complex state transitions |
| | - subvalues (`Object.is` isn't enough) |
| | - next state depends on previous |
| | separates state from components |
| | can test in isolation |
| | reusable (if in separate file) |

And I like the syntax better when using them (dispatcher function with action types). But that may be because I used VueX in the past, which uses a similar approach (and is based on Redux).

He summarizes as:

-  `useState` is a good default
-  `useReducer` when state management gets more complex
-  Can use both together in the same component

He mentions testing from time to time, but of course isn't doing it because that isn't his focus. For a reducer, I see how to write tests because it doesn't use any React-isms directly. Components I expect have a testing scaffold. Looking forward to the testing course #7, this is #4.

## Looking ahead and adjusting plans

DF 100 this weekend may affect how much time I have to spend on training on Fr/Sa/Su. List below is based on the Pluralsight pathway sequence.

-  About 1h 20m left in this course; context may move faster because it was covered in the previous course
   -  probably 2-3 days, depending on how much time I can spend this week
   -  Same instructor has a long course that covers almost everything, but it's 2017, so probably a bit out of date
-  About 1h of styling; inline, CSS in JS, stylesheets, CSS modules;
   -  probably 3-ish days because some of this is new
-  About 1h 30m on server side rendering; React 16, so I'll probably spend time looking at 17/18 differences
   -  probably 4-ish days
-  About 2h 30m on testing; React 16, so time to check 17/18 differences
   -  7-10 days maybe
-  About 1h 50m on forms (React 17); part overlaps this course, but also covers Formik and React Hook Form
   -  5-7 days?
-  About 1h on performance tuning
   -  3-4 days maybe
-  About 6h 45m on apps with Redux; React 16, so check 17/18 differences; given pace on this course (same instructor)
   -  About 1h is environment setup and app basics (covers topics I should know)
   -  About 35m is testing (should be solid on it by the time I get to this)
   -  Let's say 14 days, maybe less because Redux is similar to VueX (reverse actually), and reducers
-  About 3h 20m on hooks; I see maybe 2h of interesting new content; rest covers known topics but some of the examples might be useful
   -  I may be selective or move quickly and go light on notes unless I see something new or interesting
   -  Let's say 7 days max and aim for less
-  About 1h 10m on choosing a framework
   -  Aim to understand considerations (tradeoffs)
   -  3-4 days
-  About 2h 15m on calling APIs
   -  Some of the topics are review-ish (fetch, axios, etc.)
   -  7 days?
-  About 1h on large data sets; mostly pagination, infinte scroll, windowing
   -  3 days max
-  About 1h on using TypeScript; which I'm already doing
   -  3 days max
-  About 1h on security; XSS, DOM injection, JSON data injection
   -  3 days max

Finishing all that would run to mid-September (estimated). I want to do the coursework, but I also want to start a self-driven project and learn with something practical.

## Top priorities

-  Testing -- I want to move into a self-driven project, but tests are essential -- 7-10 d
-  Redux -- must have knowledge and will be useful for self-driven project -- ~14 d (end of July)
-  Styling -- Move through it quickly -- 3 d
   -  Investigate UI libraries
   -  Investigate forms libraries and how they play with UI libraries
   -  Consider selectively watching parts of the forms course
-  Look at dominant React frameworks (CRA, Next, Gatsby, etc.)
   -  Plan the self-driven project to allow you to start simple and move later without a lot of pain
   -  Consider speed watching the "choosing a framework" course to get the basics

Following are important, but secondary

-  Security -- top of the secondary list; not required to start self-driven project
-  Calling APIs -- I have the basics, but hope to have an API for the project, so want to be sure I have some depth here
-  SSR -- I want to be sure I understand it, but don't know if I'll use it any time soon
-  Large data sets -- worth knowing, but not likely to come into play until later in the self-driven project (if at all)
-  Performance tuning -- later stage of the project; avoid premature optimization (unless it's obviously good)
-  Hooks -- this is a deeper dive into the various hooks; I can probably work with React docs and some "when to use" guidance for now
-  Forms -- I'll do some research myself for the self-driven project, so this is secondary
-  Choosing a framework -- if speed watched, consider a closer review
-  TypeScript -- I seem to be working pretty well with some Google help

So, I could be ready to start a self-driven project in early August, which would be good. I have some ideas I'll sketch out elsewhere.

**COMMIT: 7.0.6 - DOCS: finish unit videos; look at rest of path and plan priorities (what matters most)**
