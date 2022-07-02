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

It works

**COMMIT: 5.0.2 - FEAT: add country and state selects; state depends on country**
