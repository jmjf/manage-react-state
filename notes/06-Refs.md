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
