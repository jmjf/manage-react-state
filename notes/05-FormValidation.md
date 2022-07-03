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

## Form validation

Decisions we need to make

-  Error display location (beside, above, below)
-  Error display timing (on submit, change, blur)
-  Submit enable/disabled (never, only when valid, other)
-  When to revalidate (on submit, change, blur)

My preference is validate/revalidate on blur/change, ensure submit can't happen (disable or block) if form is invalid

-  Identifies issues as they happen
-  Promotes tagging errors to fields
-  Reduces surprises later
-  Submit should check form is valid--ideally with an aggregate error flag (OR all field error flags)
   -  Disable or not depends on factors; for example, may have accessibility implications
   -  Should not attempt to submit (backend call) if form is invalid

His direction

-  Error summary at top on submit
-  Validate on blur - display error message if invalid
-  Disable submit when submitting (to prevent duplicate submits), but don't disable if form invalid
-  (Re)Validate on change

What state do we need?

-  All fields need an error state that controls error display
-  I'd like a derived OR of field errors to make submit easier
-  Only show errors if the field is touched (so need touched for each field)
   -  Submit counts as touching (focus)
-  Only show summary at top if form has been submitted
-  Is submit in progress (so we can disable submit)
-  Has the form changed (alert if nav away from partial form)

He has a plan for how he's going to manage all this, so probably more video watching ahead to understand where he's going.

-  `touchedFields`: he calls it `touched`, but the way he describes it, I'm guessing it's an array
-  `status`: will have values `NotSubmitted`, `Submitting`, `Submitted`, I expect
-  derive if the form is value, any errors, and if it has changed

"State enum pattern" -> instead of tracking separate boolean flags for mutually exclusive status-like values, store status using an "enum" (`const` object with keys that correspond to status values) -- like I did in `App` with localStorage keys

-  Define state enum on `Checkout` (not submitted, is submitting, failed submit, successful submit)
-  In `handleSubmit`, set to is submitting on entry, failed submitted on error, successful submit on success
-  And submit button should disable if in is submitting status

**COMMIT: 5.0.5 - FEAT: disable submit button if the form is in the process of submitting**

## Save shipping data

He provides a function that uses `fetch` to call json-server and save the address -- `saveShippingAddress`.

-  TS-ified it
-  I expect we're going to call this in `handleSubmit`
   -  `handleSubmit` needs to be `async`
   -  He wants a save error to catch any errors and throw if it's set
   -  He wants to empty the cart on success; I'll write `emptyCartItems` and pass as a prop
      -  He does the same -- clear names, tell you what it does, makes code easier to understand, limits child ability to change data (least privilege)
   -  If the submit succeeds, he wants to return a message

Everything seems to work

-  Form entry, including states for country
-  I see the submit button briefly disable while the form is submitting
-  After submit, it shows the message and the cart is empty
-  Can I induce an HTTP error?
   -  `status` is read-only, so I can't set it in the debugger to force an error
   -  If I don't run json-server I get a connection refused
   -  Not seeing an easy way to test the HTTP error case (which he isn't really doing yet either)

Reset db.json

**COMMIT: 5.0.6 - FEAT: when submit is clicked, save data entered in the checkout form**
