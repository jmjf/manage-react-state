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
