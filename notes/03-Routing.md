# Routing

## Make App just the App

-  Move the products component out of `App.js`
   -  I think almost everything will move
   -  And that's what he does
   -  Everything inside `<main>` stays in `Products`
   -  Everything outside and including `<main>` stays in `App`
-  Ensure `App` renders just the the header and footer
-  Put `<Products>` in `App`'s `<main>` to be sure everything works

**COMMIT: 3.0.1 - REFACTOR: move Products component out of App to prepare for router**

## Create new components and set up routes

-  `ProductDetail` - `<h1>Product Detail</h1>` for now
-  `Cart` - `<h1>Cart</h1>` for now

-  In `index.js`, `import { BrowserRouter } from 'react-router-dom';` and wrap the `<App>` tag with it
-  In `App`, in `<main>` add the router and a route for `Products` (currently root)

```tsx
<Routes>
	<Route
		path="/"
		element={<Products />}
	/>
</Routes>
```

-  Confirm it loads `Products`
-  Add routes for `ProductDetail` (path `product-detail`) and `Cart` (path `cart`)
-  Navigate to see the components display (just the page name in an h1)

**COMMIT: 3.0.2 - FEAT: Add new components; add routes for those components**
