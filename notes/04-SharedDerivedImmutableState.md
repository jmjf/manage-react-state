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
