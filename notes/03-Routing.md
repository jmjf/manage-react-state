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

## Use placeholders (route parameters) on the product detail page

For product detail page, he wants to have category + product id in the URL.

I'm looking at the way he's defining routes and I'm not sure I like it. I'm not sure I buy the idea of "shoes" as a resource. I'd really like to see a URL more like `/products?category=:category` or `/products/:category`. For product detail, I think I'd like `product-detail/:id`. For the first case, I see React Router has `useSearchParms()`, which would lead to something like:

```tsx
const [searchParams, setSearchParams] = useSearchParams();
const category = searchParams.get('category');
```

For now, I'll stick with what he's doing because there may be something about this coming up in a few minutes. If not, I may come back later and adjust.

So, now he's replacing the `product-detail` route with a `:category/:id` route. And then I suspect he'll use id in the product detail to show a specific product eventually.

I got it working by

-  Allowing `useFetch` to return a single object or an array (because get for an id returns a single object)
-  Don't alias `data` to `products`.
-  If `Array.isArray(data)` is false, `Array.of(data)` -- assign to `products`
   -  I could force the result to always be an array in `useFetch` and put all the array checking in one place, but I'm not sure that's the best answer.
-  Add code to `ProductDetail` similar to `Products` to get data, handle loading, errors, and not found, and uncomment "TODO" code to get the right structure.

So, now he's detouring to client side navigation. Let's

**COMMIT: 3.0.5 - FEAT: route to product-detail page and display the product info**

I'm not sure what he's doing here, so I'll follow along

-  In `Header` build out a nav tree using `Link`
   -  Logo image links to root (`/`)
   -  Shoes text links to `/shoes`
   -  Cart text links to `/cart`
   -  Check it works
-  Change `Link` to `NavLink` for Shoes and Cart
   -  Define `activeStyle` as a class with `color: 'purple'`
      -  I'm adding underline because accessibility says don't use color only (color blind people)
   -  His code doesn't work. React Router removed the `activeStyle` prop and just uses `style`
   -  Code I found on the React Router site didn't work either because `style` won't accept `undefined`, requires `{}`
   -  Works now
-  In `Products`, he wants to use `Link` to link to the product detail
   -  `renderProduct` includes an `<a href="/">` around the image, name, and price, so I guess we'll be changing that
   -  Probably something like ` <Link to={``${p.category}/${p.id}``}>`
   -  Nope; looks like the route appends to the base page's route, so only the id
      -  Maybe if I put a `/` in front of the category
      -  Yes, that works, so useful to remember, now back to plain id
      -  He uses the `/category/id` version; investigate why later

**COMMIT: 3.0.6 - FEAT: clicking on a product on the Products page navigates to the corresponding ProductDetail**

## Get product details working

Now outlines and says, "Try on your own" what I've already done

-  Gets id with `useParams`
-  Uses `useFetch` to get the data

Except for managing the types, same thing.

Next he adds the not found page.

-  Simplified type management to work better with not found
-  Determined that order of checking for loading, errors, not found matters, so changed it (also in Products)
-  Found a bug on the not found page (image URL needed a `/` in front)
-  Also found an issue in the not found page message selection that could return an index of 4 because I was rounding the mod

**COMMIT: 3.0.7 - FIX: load, error, and not found handling (ProductDetail, Products); PageNotFound errors**
