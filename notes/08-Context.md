# Context

## When to choose context

As applications become more complex (forms, interactions, data) they're best addressed by more complex tools

-  PlainJS -- simple
-  React
-  React context
-  React with Redux
-  Possibly something more complex

Imagine your application as a tree of components descending from the initial application component.

-  What happens when two components in different branches of the component tree need the same data?
-  How do they ensure their data stays in sync?
-  Are they making API calls they don't need to make?

Options

-  Lift state up tree to a common parent
   -  Leads to prop drilling
   -  Passes data and functions to components that don't need it
   -  Adding props to components for that data (prop explosion)
   -  May be suitable for smaller applications
-  React context
   -  Expose data through a context provider at a high level
   -  Components that need the data and functions can import the context (`useContext`)
   -  Components that don't need the data/functions can ignore it
-  Redux
   -  Manages data in a central store
   -  Components can connect to the Redux store
   -  Dispatch actions to the store to change data (no direct manipulation)

Context and Redux are useful when you have

-  Global (or near-global) data and functions
-  Complex data flows
-  Data sharing between components in different parts of the component tree
-  Need many different actions against data

He makes context sound significantly more complex than state, but from the example I saw before, it isn't that much more difficult. Granted, it's overkill for simple apps, but is probably a good early choice as the component tree gets more complex (moves beyond a few components, a few data structures, and a few data actions).

When I worked with VueX, it was supposed to have a lot in common with Redux in terms of basic concepts. For me, the complexity of VueX being wrapping my head around the basic concepts. Once that was done, using it wasn't especially hard. I liked some of the logical separtion and centralization of data manipulation it offered. So I'm looking forward to learning more about Redux and seeing how complex it really is.

**COMMIT: 8.0.1 - DOCS: notes on state management options and factors to consider when choosing**

## Using context

-  Create `src/contexts/CartContext.ts`
-  Create the context with `createContext()`

The provider will share cart data and `cartReducer`'s dispatch function.
(I guess we may see how context and reducers can work together?)

He creates the provider in `App` by wrapping the JSX in `<CartContext.Provider>`

-  He isn't creating a reusable provider that wraps its children
-  Not sure it makes much difference unless the provider will be used in different parts of the component tree
   -  Not sure that's a case we'd expect, so follow his lead, but be ready for TS to tell us different
-  And TS isn't happy because I need to tell it what type to expect
   -  Declared `ICartContextState` in `CartContext.ts` and used it as the type for the context value

Now use the context in `Cart` (starting this on my own from memory of the previous course)

-  Instead of accepting props, `useContext` and destructure (remove props)
-  Remove props passed in `App` (saw it unhappy after the change)
-  And I suspect that's really all there is to it; let's see what I missed

He did the same and is going to test, so let's pause and test. (Can add to cart, change data, etc.) Seems to be working.

So how is that so much more complex than what we had before?

-  He says use it in large apps where passing props is tedious
-  But I'm struggling to see how this is much more complex than local state and prop passing
-  In my mind, NOT needing to pass props is easier
   -  I guess one challenge is, it may make components less reusable (must know the context name)
   -  Another challenge might be that the properties the component needs are not exposed when using the component, so you need to know what properties must be available on the provider.

**COMMIT: 8.0.2 - REFACTOR: use context to pass reducer parts to Cart**

## Provider component

Now he's going to create the provider as a separate component, which I expect means:

-  Create a `CartContextProvider` in `CartContext`
-  Use that instead of `<CartContext.Provider>` in `App`

I've set it up like I did in the previous course, but I'm getting a TS error (can't find namespace `CartContext`). Let's see what he does.

-  He's moving `useReducer` into `CartContext.ts`, which suggests he's planning to move a chunk of code out of `App`.
-  This makes sense, though, because App doesn't care about any of this.

TS error because I need `.tsx` instead of `.ts`.

Okay, that's looking better. Now I need the other components to use context so `App` doesn't need to pass them props it doesn't know.

**COMMIT: 8.0.3 - REFACTOR: (code not working) move CartContextProvider into CartContext, including full reducer setup**

## Convert other components to context

-  `ProductDetail` needs to use context
   -  Remove props
   -  `useContext` and destructure
   -  Remove props in `App`
-  `Checkout` needs to use context
   -  Remove props
   -  `useContext` and destructure
   -  Remove props in `App`
-  Remove unused imports and interfaces in everything (so eslint stops complaining).

I'm getting an error on `CartContext.ts` so it looks like something is stuck in cache. Kill and restart.

That's better. Let's test.

-  Shoe list filters as expected
-  Selecting a shoe adds it to the cart
-  Cart can change quantity, including remove, and updates totals
-  Cart button navigates to Checkout
-  Checkout accepts data and flags errors
-  Submit on Checkout saves data and empties cart

All seems well.

**COMMIT: 8.0.4 - REFACTOR: get the whole app working with context**

## Wrapping in context

Main point here is he does it in `index.js` instead of `App`. That's an easy move. Quick test looks good.

You can wrap in context at a lower level if it makes sense, but context is often global or near global.

**COMMIT: 8.0.5 - REFACTOR: move CartContextProvider wrap to index.js**

## Custom hook for using context

Instead of changing all the components to use the context, he's going to create a custom hook that does it. I'm not sure how that makes life easier, but let's see what he does and where it goes.

Benefits

-  Makes the context easier to use
-  Don't need to export the context, so protects it
-  Can provide an interface/adapter over the context for error handling, etc. (??? my guess of where what he said is going)

The hook is just a function that uses the context and returns it. Don't export the context.

Which breaks several things (list isn't surprising)

-  `ProductDetail`
   -  Remove context and `useContext` imports
   -  Replace `useContext` with `useCartContext`, which doesn't need a context passed
-  `Checkout`
   -  Same
-  `Cart`
   -  Same

We're hook-ifying it, so I'm renaming the file to `useCartContext` and moving it to `src/hooks`.

So, it's marginally easier to use.
Need to read more about context to understand any risks to exporting it.
Error handling example promised in the next video.

**COMMIT: 8.0.6 - REFACTOR: expose context with a hook instead of exporting context; make everything work again**

## Error handling

The next video was actually using the context hook in the code, which I did earlier.

If we're calling `useCartContext()`, we must have a `CartContextProvider` in scope. The hook can check that the provider is in scope.

-  If the context is falsey, throw an error
   -  He uses a detailed message explaining details, but in the real world, that's exposing information users don't need and shouldn't have
   -  We don't want users changing application code at the behest of an error message (or attackers getting more info than they should)

Remove the context provider wrapper in `index.js` to induce the error. And it isn't throwing the error for me. `console.log` shows the context is `{}`, which is truthy. So add `|| Object.keys(context).length === 0` to throw if the context has nothing in it. Now my error boundary is concealing the screen error, but I can see my thrown error in the console (DevTools).

Now restore the context provider and all is well.

So, what I thought might lead to an adapter over the context isn't quite that. I assume the context hook could do that though. For example, since we're using the reducer and actions, we could expose functions for each action if we wanted to conceal that detail. (I like the action/reducer model, though, so probably wouldn't.)

```tsx
const {data1, data2, ... , dispatcher} = useContext(context);
...
// assuming the data parameter is an object with the data required to add
return { data1, data2, ... , addData: (data) => {dispatcher({type: 'add', ...data})} ... }
```

The advantage of that approach is a component could extract functions that do only what it needs (vs. dispatcher function can dispatch any action), which might give better isolation/safety. It harks back toward the state-ly model of having updater functions, but doesn't require prop drilling them down to children, so is an improvement. (If you're worried about developers doing stupid things, this approach might be a better approach.)

**COMMIT: 8.0.7 - FEAT: check context is valid and throw an error if it isn't (in useCartContext hook)**
