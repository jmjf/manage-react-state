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
