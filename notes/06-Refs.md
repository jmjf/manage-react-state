# Using refs

## What are then and when to use them

-  Reference (pointer) to an HTML element; can store a value
-  Stable between renders
-  Mutable (directly, no setMyRef)
-  Don't trigger render; can store values that aren't rendered

```tsx
import { useRef } from 'React';

function TextInputWithFocusButton() {
	const inputEl = useRef(null);
	const onButtonClick = () => inputEl.current.focus();

	return (
		<>
			<input
				ref={inputEl}
				type="text"
			/>
			<button onClick={onButtonClick}>Focus the input</button>
		</>
	);
}
```

In this example, the `ref` attribute on the `<input>` element binds `inputEl` to it. The ref's `current` property references the DOM element. Clicking the button puts the focus on the input.

Use refs for

-  DOM element references
-  State that isn't rendered or doesn't change
-  "Instance variables" in function components
   -  Long list of uses, all of which seem to hinge on keeping a value between renders

**COMMIT: 6.0.1 - DOCS: notes on refs from the introductory videos**

## Uncontrolled inputs

Use an uncontrolled input on the size `<select>` on `ProductDetail` (selects sku)

-  Copy to `ProductDetailRefs`
-  Call `useRef()` to get a ref instance (`skuSelectRef`)
-  Add `ref` property to `<select>` referencing `skuSelectRef`
   -  He calls `useRef()`, but VSCode TS wants `useRef(null)` or it complains about `ref` type alignment
-  Remove `value` and `onChange` because uncontrolled inputs don't use them
   -  He also removes the sku-related state (`selectedSku`), but I'm holding off on that until I see where he goes with the places that use it
   -  I'm sure it will go away, because I'm sure that's the point
-  Fixing the `selectedSku` references
   -  In `onAddToCart()`, use `skuSelectRef?.current.value || ''` (same reason)
   -  It may work without that, but the build will complain
   -  On the `<button>`, use `skuSelectRef?.current?.value?.length` (because TS believes each node could be null)
      -  He says the `disabled` code won't work, but I want to see that. (I believe him, just want to see it.)

Let's test it so far

-  Change the product detail route to use the refs version
-  It doesn't, and it allows me to add without selecting size -> error
-  For now I've added a check to not attempt to add if no value selected; real world, I'd want a user-visible error message like we have on the cart form, just not wanting to add the overhead for this demo because that isn't the point

Then he does the check with with a simple alert (lol). Not recommended, but better than nothing. He wraps up with a demo and a side by side code comparison.

**COMMIT: 6.0.2 - Use an uncontrolled input for the product detail page**
