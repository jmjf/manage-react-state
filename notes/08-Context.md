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
