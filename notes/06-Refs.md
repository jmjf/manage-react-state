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

## Choosing between controlled and uncontrolled inputs

Both can set an initial value and validate on submit, but controlled inputs add:

-  "Instant" validation (blur, change, etc.)
-  Conditionally disable controls based on state (e.g., add to cart button)
-  Enforce input formatting (by checking input as entered in a text field, for example)
-  Use same state in different inputs
-  Build dynamic inputs tied to state

Note that controlled inputs require data to reside in state passed as props to the input.

In most cases, prefer controlled inputs.

-  If your page is complex, uncontrolled inputs may offer a performance benefit because React doesn't diff them on every render
-  If you're using a non-React library, you may need an uncontrolled input to use it

([Reference article](https://goshacmd.com/controlled-vs-uncontrolled-inputs-react/))

## Using refs to avoid setting state on unmounted components

-  In `package.json`, change the json-server delay to 1500ms or greater and restart (break and `npm start` again)
-  Click on shoes page, then click on logo to get home page -> console warning React can't set state
   -  Because the delay means the navigation happens before React can set the state on the shoes page, so `setState()` is called on an unmounted component.
   -  I can't seem to get the same error he does; React 18 [removed the warning](https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#other-notable-changes), but I don't know if that means the prevent the memory leak
-  Prevent the message by using a ref to check if component is mounted before setting state (in the hook)

-  In `useFetch`, add a ref set to false (pass value)
-  In the `useEffect`, set the ref to true because `useEffect` runs after first render, which means the component is mounted
   -  `isMountedRef.current = true` -- `current` is required
-  The `useEffect` cleanup function will run when the component is unmounted, so set to false there
   -  I see where this is going, check the ref before any state actions

I can't really test this because React 18 doesn't warn, but i can add `console.log`s that prove the setters run if the component doesn't unmount and don't run if it does. So, that's what I have.

**COMMIT: 6.0.3 - FEAT: ensure useFetch doesn't try to set state if the component unmounts while waiting for data**

**COMMIT: 6.0.4 - CHORE: undo changes I don't want to keep route back to non-ref ProductDetail; set API delay back to 0; remove console.logs added to prove behavior**
