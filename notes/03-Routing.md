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

## Use placeholders

Today we sell shoes, tomorrow we'll sell yoga balls, books, lions, tigers, and bears. Oh my! So let's put the product category in the route so we can display different categories of products.

Make the landing page a welcome message instead of shoes

-  Copy the `Products` route
-  Change the `/` route to render a static welcome message
-  Change the products page path to `/:category`; `:category` is a placeholder
-  In `Products`, replace the hardcoded `shoes` with the placeholder
   -  `const { category } = useParms()`; attribute name matches placeholder; (`useParams` is from `react-router`)
   -  Use to compose the URL
   -  He says `useParams` is in `react-router-dom`, but VS Code says `react-router` and it works
      -  Also looked at it in Dev Tools to see it's working

**COMMIT: 3.0.3 - REFACTOR: use a route parameter (placeholder) to identify the category for Products instead of hardcoded shoes**

## 404

If I navigate to an unknown category (bears), I get a blank page. I want a 404 page instead so the user has a clue what's going on.

-  I'm guessing that means a NotFound component and some way to default the route to it
-  I made my 404 more interesting, now for falling back when not found
-  In `Products`, if `products.length === 0` show `PageNotFound`

**COMMIT: 3.0.4 - FEAT: add a not found page and show it when no products are found**
