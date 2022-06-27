# Local and remote state

Apps usually need to store data they're using and get data from a remote server.

## Tools

-  git
-  node (10+ required, latest LTS recommended)
-  create-react-app (generator)
-  editor (VSCode used)
-  Prettier or similar (recommended)

To keep the course focused on state

-  Not using PropTypes or TypeScript (recommeneded for type enforcement; I'm using TS)
-  Using plain CSS (better solution like CSS modules or CSS in JS and styles per component recommended)
-  Some code will be copy/paste (though I'll probably type to familiarize myself with syntax and patterns)

I used his starter and:

-  Manually installed dependencies to get the latest versions (original in notes/00-OriginalDependencies.json)
-  Set up `tsconfig.json`
-  Converted `jsx` to `tsx`
   -  Left `js` alone for now
-  Confirmed it seems to run
-  Changed footer (copyright; credit Pluralsight, but I'll be making changes)

See `README.md` for info on how he changed from `create-react-app` default.

**COMMIT 2.0.1 - CHORE: setup base environment from instructor's starter with my changes**

## useState and hooks

Build the shoe listing page.

-  Copy shoe (products) array from `db.json` into `App` (using local data for now)
-  Display the products
   -  New `<section>` (more semantically accurate that `<div>`)
   -  Use `map()` to get `renderProduct()` result for each product
   -  Uncomment `renderProduct`
-  Should get shoes on app now

Looking at the data, we have sizes for the shoes (per SKU). Customers will want to filter for shoes available in their size.

-  We have a size filter `<select>` on the page
-  Need to get it's value and filter results (probably `products.filter()`) based on it
-  `useState()` seems like a practical solution given
   -  This is in `App` (top level) instead of a component (like it should be)
   -  We only have one value to track (size selected)
   -  We only need it in this component
-  So, my solution is to `useState()` for the size, bind it to the `<select>`'s value, and filter products based on that value
   -  In the products `<section>`, I used `some()` to find products where at least one sku matches the selected size (or all shoes if selected size is empty string)
   -  I chained `products.filter(product.skus.some()).map()`
   -  And it works
-  Notes after watching instructor solve it
   -  Uses different names, but I'd argue mine are more explicit about intent
   -  On the `<select>`, in addition to writing `onChange`, he sets `value={selectedSize}`
      -  Not sure `value` offers any value over the event handler
   -  He filters products in a `const` before the return, which is reasonable--I was thinking the filter needed to be cleaned up a bit to declutter the JSX (applied this change)

### Hooks overview

-  Hooks are for function components
   -  Using in classes requires different technique
-  Start with "use" (by convention)
-  Call at the top level of component, not inside nested function, conditionals, loops
   -  No `if (...) { const [s, setS] = useState(''); }`
   -  No `function Comp1 { let s = false; let setS = () => {}; function nested() { [s, setS] = useState(false); } }`
   -  Best practice is to put hooks at the top of the component

### React dev tools

-  You can see state values in RDT
   -  Doesn't know what they're called, so you need to know the order they were invoked

### When does it render

-  State changes
-  Prop changes
-  Parent component renders
-  Context changes
-  Variables must be derived/calculated based on one of the above to change

Suppress renders (performance) with

-  State change -> `shouldComponentUpdate` or `Memo`
-  Prop/parent change -> same plus `PureComponent`
-  Context -> none

**COMMIT: 2.0.2 - FEAT: show shoes available and allow customer to filter list by size**

## Display count of items found (based on filter)

Add text below the `<select>` "x items found". My simple solution: `<p>{filteredProducts.length} items found</p>`.

Instructor uses an `<h2>`. He also only shows the count if a size is selected.

-  I don't like the way that jumps the display around when no specfic size is selected. Many sites I see always display a product count or similar.
-  Key thing to note here is he uses `{ selectedSize === '' && <h2>...</h2> }` where the first term must be true for the second term to evaluate and generate HTML.

**COMMIT: 2.0.3 - FEAT: show count of filtered products under filter**

## Environment setup to make me happier

-  I fixed the setup for Prettier and told VSCode (Ctrl + Shift + P, Preference: Open Settings (JSON)) to use it for everything
   -  Removed VSCode Prettier config in favor of `.prettierrc.json`
   -  [Reference](https://blog.avenuecode.com/how-to-integrate-prettier-and-eslint-in-vscode-and-react); with some custom settings for Prettier based on my preferences
   -  Moved eslint and Prettier configs to project root
   -  Adjusted eslint config
      -  Make tab issues a warning (because it's fighting Prettier)
      -  Add `"plugin:react/jsx-runtime"` so it won't complain about no `React` import for JSX (not required for React 17+)

**COMMIT: 2.0.4 - CHORE: set up eslint and Prettier correctly; add precommit hook to run Prettier**

## useEffect to fetch/store data

`useEffect()` runs after each render by default, but can be configured to run only on the first render.

Changes

-  Remove `products` array
-  Add `useEffect()` to `App` after state setup
   -  Takes a function to execute and a dependency array
-  Write function to get products from API
   -  I suspect we'll need products either as state or a `let` variable
      -  After some pre-work, he uses state
   -  Products data is at `localhost:3001/products`
   -  He has a `getProducts()` function in `services/productService`
      -  Expects `REACT_APP_API_BASE_URL` environment variable
      -  Converted to TS by typing the parameters and return values
      -  Moved `IProducts` (exported) and `ISku` to `productService` and imported in `App`
   -  He uses `.then()` on the Promise, so I'll go along with that for now
      -  `getProducts()` throws its response and he doesn't seem to handle an error isn't handling a failure response
      -  I added a `.catch()` to the Promise chain
-  And now the `useEffect()` is running, spamming the API because it's running on every render, which seems to be constant
   -  So, pass the dependency array (empty) so it only runs on first render

### How to call APIs

Inline inside the component

-  Uses axios, fetch, etc., in the `useEffect()` directly
-  Harder to reason about
-  Not reusable

Separate function

-  Function makes the call
-  `useEffect()` calls the function

Custom hook

-  Will cover later in course

Third party library

-  Will cover later in course

### Error handling with ErrorBoundary

-  I expect this will undo my `.catch()`, which is fine
-  He uses `ErrorBoundary` from the React docs; I'll use the TS version from `r17-components`
-  He also throws it in `src`, which I don't like, but I'm hoping he'll organize things better later

-  I'm adjusting index.js to use React 18 `createRoot()`
   -  Get document root in `container` const
   -  Replace `ReactDOM.render` with `ReactDOM.createRoot(container).render()`
   -  Remove `getElementByid()` from `render()` args
-  And wrap it in `<ErrorBoundary>`

   -  It's rendering

-  We can force an error by breaking `getProducts` (change URL)
   -  But, error boundaries don't work for async code
   -  To make it work
      -  Create a state value for an error
      -  In the `Promise.catch()`, set the error state with the error received
      -  Before rendering JSX (`return`), if error is set, throw it
-  And it shows "something went wrong" as expected

**COMMIT: 2.0.5 - FEAT: get product data from API with useEffect()**
