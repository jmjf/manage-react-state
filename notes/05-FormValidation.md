## Forms and form validation

Time to build a checkout form.

-  Verify data when it changes
-  Know what changed
-  Use derived state for validation values (I'm guessing flags?)
-  A state enum (???)

## Create the form

He provides the code. Let's try to understand what we're doing before we copy/paste.

-  `Checkout.tsx`
-  Start by returning a `<div>`
-  Add it to routes in `App`
-  Works so far

**COMMIT: 5.0.1 - FEAT: create stub checkout component and wire into routes**

Looking at what he pasted, I see

-  `<select>` for country -- label, select, options (China, India, UK, US)
-  `<input>` submit button (`className="btn btn-primary"`)
-  Looks like some `<input>`s for address (city, more TBD)
-  An `address` object with city and country (probably more)
-  Nope, at the top of the form, he only has city and country in his empty address object
   -  I may be more ambitious
-  Handlers for change, blur (bound each input) and submit (submit button) that are "TODO"

Given that, I'll draft my form.

-  Define values for countries and country states
-  Define address as ship to name, 2 address lines, city, state, postal code, country
   -  Require country before enabling state (future)
-  Add selects for state and country

Let's get them working first. (Real world, I'd probably give some of these controls separate handlers, maybe even make them separate components.)

-  `handleChange`
   -  When the value changes, update state
   -  If the changed value is country, reset state too
      -  I can use `target.id` and check for `countryCode`

It works.

**COMMIT: 5.0.2 - FEAT: add country and state selects; state depends on country**

Add the rest of the address fields. It isn't pretty, but it works.

Let's roll video and see where he goes.

Things I've already done:

-  Add route to `Checkout` in `App`

Changes:

-  He has the whole thing wrapped in a `<form>`, which doesn't surprise me.
-  Add the submit button
-  `Checkout` needs a `cartItems` prop
-  Add a "checkout" button on `Cart` (`useNavigate` to get a navigate hook, on click, navigate to checkout)
-  Only render button if `cartItemCount` > 0 (he uses `cartItems.length`, not sure if there's a real difference)

**COMMIT: 5.0.3 - FEAT: add remaining fields to form; catch up to video**

## handleChange

He notes that managing the state in an object is a bit more complex.

-  Matching ids to state attribute names makes life easier
-  Hmm... he's using `{ ...oldAddress, [e.target.id]: e.target.value }`
   -  That works (and without a dictionary type def on the object), so `handleChange` just got a little simpler
   -  Still need to reset `stateCode` if `countryCode` changes, so more complex than his super-simple form, but simpler
-  He also has an issue with event being reset before it's used in the handler, but I'm not seeing that
   -  He uses `e.persist()` to persist the event; I'm using `e.preventDefault`
   -  [React docs](https://reactjs.org/docs/events.html) say that, as of v17, `SyntheticEvent` is no longer pooled, so `e.persist()` doesn't do anything -- LOL, then he says that, well, helps to find it myself

**COMMIT: 5.0.4 - REFACTOR: use indexed propery in handleChange to simplify slightly (TIL)**
