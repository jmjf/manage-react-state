# How and when to declare state

## Introduction

Many different types of state and ways to managed state in React apps

-  URL
-  Web storage
-  Local state
-  Lifted state
-  Derived state
-  Refs
-  Context
-  Third party libraries

Example app will be an online store

Topics

-  Delcare, set, derive state
-  Share state between components
-  Loading, error, form validation state
-  Unrendered and server state
-  How to choose an approach

Course uses React 16 and React Router 6, works with 16 and 17 (and I'm going to make it work with 18)

Goal is a mental framework for state use

## History

-  First release: class components and pre-release context concept
-  2014 - 2015: Flux and Redux
-  Oct 2015: Stateless function components
-  Mar 2018 (16.3) - Context API
-  Feb 2019 (16.8) - Hooks

## Techniques

Definition: data that may change

Environment variables prefixed with `REACT_APP` are automatically loaded at runtime if you're using `create-react-app`

-  URL
   -  App location and settings (current item, filters, pagination); no sensitive data
   -  Deep link support
   -  Avoids storing state in the app
   -  React Router is useful
-  Web storage
   -  State stable between reloads/sessions; shopping cart, partial form data; avoid sensitive data
   -  cookies, localStorage, IndexDB
   -  Tied to a single browser
-  Local state
   -  Available to one component (unless you pass as props to children); form data, toggles, lists used by one component
-  Lifted state
   -  Useful when sharing state between a few related components with a shallow component tree
      -  To me, context feels like a better solution for deeper component trees and large sets of state values
   -  Put state in a common parent
      -  Declare in the parent; pass to children in props
-  Derived state
   -  Use when state can be calculated from existing state or other data
   -  Avoids state getting out of sync; simplifies code (derived values recalc when state changes )
   -  Calculate from existing values (state or props)
      -  `Array.length` vs storing/passing length
      -  Check if errors array is empty to determine if errors exist (and maybe store in a variable)
-  Refs
   -  DOM reference
      -  Manage form inputs where React doesn't control the value
      -  Third party library interfaces
   -  Undisplayed state
      -  Track if mounted; timers; previous state (maybe for rollback)
-  Context
   -  Use for global state or state that covers many components; avoid prop drilling
      -  Logged in user; auth settings; theme; internationalization settings
-  Third party state library
   -  Global state: Redux, Mobx, Recoil
   -  Remote state (from API calls): react-query, swr, relay, apollo (latter two are GraphQL)

## Data structures

Primitives: Base JS scalar data types (boolean, string, number, bigint, symbol)
Collections: Object, Array, Map (key/value pairs), Set (unique values), WeakMap/WeakSet

Primitives are immutable, collections are mutable. React wants to treat state as immutable, so collections need special handling.

**COMMIT: 1.0.0 - DOCS: notes on course intro and state overview; set up notes outline**
