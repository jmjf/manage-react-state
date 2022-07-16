# State management libraries

-  Demos of libraries in the course exercise files
-  `npm install`
-  Import desired demo in `App.jsx`
   -  Demo files for react-query, immer, formik

## Local state

-  Manage state for a component
   -  `useState`, `useReducer`, refs
   -  Class state
   -  Derived state

XState -> define transitions and enforce rules; state diagram

## Global state

-  Share state or functions throughout the application (globally)
   -  Lifting state to parent components
   -  Context

Redux

-  Large, complex apps with many actions/state changes
-  Cache/share local data
-  Middleware (cross-cutting concerns)

MobX

-  Optimizes derived state
-  Mainly consider if performance is an issue or lots of derived state

Recoil

-  Many frequently changing elements (UI)
-  Reduce updates

## Server state

-  Fetch and cache server data
   -  React has nothing for this

Many use fetch or axios

Other options:

-  REST/RPC -> react-query, swr
   -  Automatic server cache
   -  Cache invalidation
   -  Request dedupes
   -  Auto retry
   -  Refetch on refocus or network reconnect
   -  Use "stale-while-revalidate" header (return cached, update if fetched result is different)
-  GraphQL -> Relay, Apollo

Server state questions:

-  Cache on client? (For how long?)
-  Reload on tab focus?
-  Reload on network reconnection?
-  Retry failed HTTP calls?
-  Return cached data and fetch fresh after? (Gets to cache invalidation)
-  Server cache separate from app state?
-  Cache (avoid refetching recently fetched data)? (Gets to cache invalidation)
-  Prefetch?

Data fetching libraries can handle these concerns.

Example: `Products.react-query.js`

## Immutable state

-  Enforce state immutability
   -  React has nothing; code it that way and be careful

Immer

-  Write mutative code
-  Uses `Object.freeze()` to make data immutable
-  The `produce` function accepts a function that returns a new object with changed state

Example: `cartReducer.immer.js`

## Form State

-  Build complex forms and manage state
   -  State
   -  Event handlers
   -  Derived state

Formik, React Hook Form

-  Structured form handling approach (opinionated)
-  Less code writing, but larger app bundle

Example: `Checkout.formik.jsx`

## Wrapup

-  URL -> state shareable in the URL; avoid sensitive data; react-router
-  Web storage -> persist state between sessions; limited to one browser
-  Local state -> only one component needs it
-  Lift state -> a few related components need state
-  Derive state -> whenever practical
-  Refs -> Reference DOM or store unrendered state
-  Context -> Global or nearly global state
-  Third party library -> all kinds of stuff

Questions

-  Does it belong in the URL? (current page, current record, sorting, etc.) -> URL
-  Persist across sessions; available offline? -> web storage (localStorage, IndexedDB, etc.)
-  Server data? -> react-query, swr, Relay Apollo
-  DOM element? Doesn't change? Not rendered? -> ref
-  Can derive frmo props or other state? -> derive; memoize if expensive
-  Only one component uses it? -> local state
-  Limited to one branch of the component tree? -> lift state to common parent
-  Global or near-global state? -> store in app root; context; Redux

Exercises

-  Add backpacks to the store (see `11/before/public/images` for images)
-  Finish checkout
   -  Accept billing/payment info
   -  Copy from shipping to billing
   -  Save partially completed checkout
   -  Display final order confirmation
-  Display cart status in nav (item count)
-  Dedupe requests in `useFetchAll` (adding same product in different size doesn't refetch)
-  Add init arg to `useFetch` (see MDN docs)
-  Use react-query or swr for API calls

**COMMIT: 10.0.1 - DOCS: notes on state libraries; course wrapup**
