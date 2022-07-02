# Shared, derived, and immutable state

## Module outline

-  Build a shopping cart
   -  Deriving, declaring, lifting state
   -  Immutability
   -  List event handlers

## Select shoe size

Customer wants to select shoe size to add to the cart so they can get the right size shoes.

-  Based on the select on `Products`, place above add to cart on `ProductDetail`
-  Show available sizes only (based on skus)
   -  I wrote this myself, but it's hitting an error, so let's see what he does
   -  30 seconds later found it; instead of extracting available sizes into an array (state), work directly with the `sku` array in the `product`, which also lets me get sku number for the select option values--don't need state (maybe I let myself get carried away with the theme)
   -  He says, "Try it yourself," but I have it working; and he says use the sku number as the value, so guessed that right

Part of me wants to make the select a common component, but they're different enough that doesn't seem worth it.

**COMMIT: 4.0.1 - FEAT: add size select on ProductDetail**

## Disable add to cart if no size selected

Customer can't add to cart if they haven't selected a size.

-  Button -> disabled = true if `selectedSku` is empty string (basically same as how Angular or Vue would do it)
   -  I put the calculation on the element because it's simple
-  And that's what he does, though he writes `!selectedSku` where I checked length

**COMMIT 4.0.2 - FEAT: disable add to cart button if no sku selected**

## Cart state

We need the cart state in many places, so where to put it?

-  If state is hard to use, it's probably in the wrong place
-  Start local, move (lift) when needed
-  Only give components data they need to work

Strategy

-  Start local (in the component that needs the state)
-  If children need it, pass props
-  If non-children need it, lift to a common parent
-  If prop drilling becomes complex, use Context or a state manager (Redux)

Who needs the cart state?

-  `ProductDetail` needs to add items
-  `Cart` needs to display it
-  Both are children of the main `App` (so put it there for now)

-  Declare cart state in `App`
-  Pass to `Cart` and `ProductDetail`
   -  For now, `Cart` only needs to display, so don't pass `setCart`
-  What's in the cart?
   -  Need the sku, which uniquely identifies a specific product and size
   -  Including the product id would make getting the product data in `Cart` easier
   -  Could include the whole product plus a sku because we'll probably need all the product data in `Cart`
      -  OR change sku array in cart product to have only selected sku
   -  He's going with id, sku, quantity
      -  He plans to get product data from the API in the cart
      -  I'm guessing he plans to check the array and update qty if needed
   -  And he's writing `addToCart()` in `App` and passing that instead of `setState()`
      -  Keep state mainpulation close to declaration, I guess? (Makes sense to me--similar principle to an Aggregate or Entity in DDD/Clean.)
      -  It needs to know the id and sku
-  I wrote `addToCart()` myself, passed it to `ProductDetail`, changed `Cart` to list cart item info (simple `<p>`); it works
   -  Let's see how he does it
   -  He makes the point that the state setter should get a function if it references existing state (batching -> async -> can get stale values)
      -  Moved my `addToCart` code into an anonymous function in the `setCart` call
   -  Explains
      -  Why data needs to be immutable (easier change comparison)
      -  Reviews `Object.assign` and spread
      -  Highlights both are shallow copies, so need to assign/spread nested objects too
      -  Recommends avoiding or reducing nested objects; can merge when sending to server
      -  Deep clone is expensive, only clone what changes (can confuse React about what changes)
      -  Limit array mutating methods like `push`, `pop`, `reverse` to cloned arrays only
   -  Main differences in code
      -  I know I need a copy of the array, so `map` first, then `push` into the copy if not found
      -  He does `find` first, then uses either `map` (if found) or spread copy (if not)
      -  Same result, different strategy

**COMMIT: 4.0.3 - FEAT: make add to cart work; add a basic cart display to show it works**

## Build real cart display

Customer wants to see a better cart with more details about the products in the cart, remove controls, etc.

-  He starts by pasting a pile of starter code
   -  Ends by returning a `<section>` that is mostly `<ul>{cart.map(renderItem)}</ul>`
   -  So, `renderItem` must return a `<li>`
   -  I've set up the basic structure based on his code in the video, but left the interaction and data retrieval out for now; it renders and looks like what I'd expect, so now to the code interaction bits
      -  Key points i see, he's getting data for all products in the cart at the top of the component (shared)
      -  We're going to add a "fetch all" hook that returns a products array for a list of products (variation on existing fetch hook)
      -  Get item specific product data in `renderItem`
      -  Control loading/error in the main component

**COMMIT: 4.0.4 - FEAT: outline basic cart item display and get it working with static data**

He copy/pastes `useFetchAll`, so let me read it and set it up myself

-  `useEffect` creaets the Promises, then uses `Promise.all` to resolve them; this use of Promises instead of `async/await` makes sense to me (parallelism)
-  Point to note about how this code is written: each Promise returns an object on success, `Promise.all`'s `then()` gets the array of those objects
   -  This is intuitive when I think about it a few seconds (but I confirmed by looking up)
-  Okay, I think I have this set up and understood, let's see what he says (nothing I hadn't already figured out)

So, now we can `useFetchAll` to get all the products in the cart and then use that data for each item

-  Build list of URLs from cart items
-  `useFetchAll` to get data
-  In `renderItem`, get appropriate product's data
   -  Everything except size from sku so far
-  Added CSS to move the detail text off the image so it looks less ugly

**COMMIT: 4.0.5 - FEAT: show item details for cart items (except size)**

Now to get size from the sku

-  Pick the right sku from the list of skus for the product

**COMMIT: 4.0.6 - FEAT: show size for cart items**

## Quantity changes and deletes

Watch video until he gets to updating the ordered quantity

-  For update qty, he's passing a function prop because cart state is in the `App` function; will need to build there
-  Then selecting from change qty select will call update function

`updateQuantity(sku, newQuantity)`

-  `map` cart and update quantity
-  (if qty is 0, need to remove from the cart (next video), for now just show 0)

**COMMIT: 4.0.7 - FEAT: allow user to change quantity in cart (not handling 0 yet)**

Remove item if quantity is 0 (Remove selected)

-  Filter the new cart to remove the sku
-  Requires `let` instead of `const` for `newCart`

**COMMIT: 4.0.8 - FEAT: allow user to remove a product from the cart**

Catch up video to see if he has any ideas I like better.

-  Just thought of something as he started talking about `filter`
   -  If qty is 0, just `filter`, don't `map` because `filter` also returns a new array; that works

Okay, nothing exciting. He used a ternary in `updateQuantity` where I chose an `if...else` due to the way I'm formatting (and because `map` uses a ternary, could get confusing with nested ternaries)

Next step will be to show total number of items in the header (deriving state).

**COMMIT: 4.0.9 - DOCS: catch up video to where I am; get ready for next feature**

## Cart header

What would I put in the Cart header?

-  Really not much, I'd have an order total box that shows item count, cost, shipping
-  But we don't have that here, or maybe it's coming in the future
-  For now, I'll show number of items and total cost
   -  Count items by summing cart items' quantities (sounds like a job for `reduce`)
   -  Total cost by summing cart items' price \* quantity (another `reduce`)
   -  Except reduce wants to use an `ICartItem`, so I'll use a fake `ICartItem` to do the totaling
   -  Calculating price requires looking up the item in the `products` array every time, but I'll do it because it makes sense
   -  That's working except the currency format needs some help; `toFixed(2)` solves it

**COMMIT: 4.0.10 - FEAT: add item count and total cost to the cart header**
