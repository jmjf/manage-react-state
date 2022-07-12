# Class components

Most people using React seem to use "function components," meaning the component is written as a JS function. React also supports (originally supported only) class components, where the function is declared in a class.

-  Classes do have some advantages, especially if you're applying DDD/clean architecture concepts
-  I'm not sure if people think function components means functional programming (it doesn't) or see some other significant advantage
-  I've picked up hints that class components can't do certain things or are harder to use
   -  Is that real limits of classes or because the React team has shifted focus to function components, so hasn't implemented features
-  It's also kind of funny because the examples on the [React site's home page](https://reactjs.org/) and tutorial are class components

## Classes vs. functions

Function components

-  Typically require less code
-  Concept of functions (mental models) better aligns with React model
   -  Class life cycle methods have edge cases
-  `this`
-  Using hooks in class components is harder
-  "Functions are the future"
   -  Which seems to be true given rarely I see class component sources

Class components

-  React 16.7 or older require classes to support state (no hooks)
-  Existing apps may have many class components (ongoing support)
-  "Many blog posts and forum answers use class components"
-  Error boundaries and `getSnapshotBeforeUpdate` require classes
-  Some people prefer classes

## Module overview

-  Convert `Checkout` and `ProductDetail` to classes
   -  Use a hook in a class
   -  Share logic between classes
   -  Declare and use state
   -  `this`
   -  Context

**COMMIT: 9.0.1 - DOCS: module intro notes**

## Convert Checkout to a class

I'm going to do this in a separate file. (I'm guessing he'll suggest that too, but I don't care, I'm doing it.)

-  Copy `Checkout.tsx` to `CheckoutClass.tsx`
-  Change declaration to class instead of function
-  Extend `React.Component`
   -  From what I've seen in quick glances, the returned JSX will become a `render` method

### Problem: Can't use hooks in classes (patterns also work for sharing logic)

-  Convert the class to a function
-  Use the hook in a parent and pass data/functions in props
-  Wrap the hook
   -  Write a function wrapper
   -  Render prop
   -  "Function as a child" (explained in a future section)

In this case, pass from the parent

-  `useCart` in the parent (`App`) and pass the dispatcher function in props
-  In `Checkout` use `this.props.<dispatcher function>`

### Problem: Need to declare state

-  Option 1: constructor
   -  Write a constructor that assigns `this.state` as an object containing the four pieces of state
   -  No set methods, just the data and the default value
-  Option 2: class field
   -  Declare `state` at the top of the class; no constructor, just the object and defaults

```tsx
// constructor example
export class Checkout extends React.Component {

constructor(props: PropsWithChildren) {
   super(props);
   this.state = {
      address: emptyAddress,
      checkoutStatus: CHECKOUT_STATUS.NOT_SUBMITTED,
      saveError: null as unknown as Error,
      touchedFields: emptyTouchedFields
   }
}
```

```tsx
// class field example
export class Checkout extends React.Component {
	state = {
		address: emptyAddress,
		checkoutStatus: CHECKOUT_STATUS.NOT_SUBMITTED,
		saveError: null as unknown as Error,
		touchedFields: emptyTouchedFields
	};
```

### Problem: Derived state isn't happy

-  I wonder if we just use a `this.state.` prefix
-  Nope, needs to be in a method
-  `private isFormValid()`
   -  Does need to use `this.state.` (guessed that much right)
   -  Also move `getErrors()` up and make it a private method
-  Make rest of the methods private
-  Wrap the rest of the code in `render()` method

He moves on to the next video here, but I'm going to put `this.` in front of all the class method calls and `this.state.` in front of state references to remove the errors.

**COMMIT: 9.0.2 - REFACTOR: (code not working) change Checkout to a class, configure state, make functions methods, add this prefixes as needed**

### Problem: Set state calls when we have no setters

I suspect we just assign values to `this.state` parts.

-  Ah, `this.setState()`, so React apparently assigns class components `state` member a setter by default
-  And it contains all the component state (less granular)
-  And it does a shallow merge, so you need to provide only changed data, which might solve the granularity issue
-  If we need the old state (e.g., for address), need to give it a function; if we don't, just return what to change

That was a learning experience. Several things didn't behave like I expected, but I see what's going on now.

-  `this.setState()` exists and is required to set state
-  Shallow merge means pass only what's needed (function that returns part to overwrite if need old state, part to overwrite if not)

Also, I had to declare an interface/type for the state object because `this.setState((oldState) => {})` requires a type on `oldState` or it doesn't know what members are available.

**COMMIT: 9.0.3 - REFACTOR: (code not working) change state setting in methods to align with class component model**

### Problem: render() needs data from state

Declare destructured values and computed values at the top of `render()`. Which means two lines of code.

**COMMIT: 9.0.4 - REFACTOR: (code not working) change references to state in render() to use local values (destructure, derive)**

### Problem: The dispatcher function is unknown

He doesn't seem to have this issue. Maybe I missed him fixing it. But I have an error on the dispatcher function called in `handleSubmit()`. In the function component version, we get the dispatcher with the `useCartContext` hook. In the class version we get it from `props`, and TS doesn't know the function exists on `props`.

Here's the solution ([Ref1](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/class_components/), [Ref2](https://www.jetbrains.com/webstorm/guide/tutorials/react_typescript_tdd/class_props/)). Pass the props shape as the first generic. I tried passing state as suggested in Ref1, but got errors in `setState()` calls. Will trace that out later maybe.

```tsx
interface ICheckoutProps {
	dispatchCartItemsAction: Dispatch<CartReducerAction>;
}

export class Checkout extends React.Component<ICheckoutProps>
```

So, now I have no eslint/TS errors, let's see it if works.

-  In `App` import from `CheckoutClass.tsx` instead of `Checkout.tsx` (which solved an issue I had with the dispatcher function prop that isn't on the function version)
-  Trying to enter a name fails
   -  I'm getting an error on my event handler, "Uncaught TypeError: Cannot read properties of undefined (reading 'setState')"
   -  Added `console.log`s in the state changer, but this is failing before it gets to them
   -  Maybe I need to pass the state type to the `React.Component<>` too
   -  I resolved the issue with passing the state type (pass the type, ensure the return from `setState( () => {} )` is cast as the type)
   -  Google results suggest the problem is a binding issue (binding to `this`)
   -  Solution: use arrow functions or use `.bind(this)` in a constructor; arrow functions are easier
      -  Arrow functions inherit `this` from their enclosing scope
   -  Error resolved, but data still not changing; `console.log` shows input data is what I expect
   -  I think I had my closing brace on the address object in the wrong place in `handleChange`
-  Works now

**Rule of thumb:** When working with class components, prefer to declare methods with arrow functions to avoid binding issues. This rule is most important for functions passed in `{}` in JSX, but may be wisest to follow it generally so you don't have to remember which is which.

**COMMIT: 9.0.5 - REFACTOR: pass props in generics so the component knows the dispatcher function exists; fix binding issues event handlers**

Oh! Lol. He has the same binding issue. "Let's fix that in the next video."

-  Same answer
-  Well, I found it myself and don't think I'll forget it soon

## Custom wrapper pattern: convert ProductDetail to a class; sharing logic and consuming hooks with a custom wrapper

Create a custom wrapper for hooks in the class component's files and export.

-  Do basic class component conversion
-  Create a function component that acts as the wrapper
-  Move hooks into the wrapper
-  Pass hook results to the class component as props
-  Wrapper returns the class component with props passed

So, let's use the wrapper in `App`. The product detail page seems to work as expected.

The main challenge here is getting everything arranged right. The basic structure of the file is:

-  Imports
-  Declare interfaces for props and state
-  Declare class component
-  Export wrapper function component
   -  Hooks
   -  `return <class-component prop1={prop1} prop2={prop2} ... propn={propn} />`

If the class component is complex, I guess this makes sense as a way to use hooks with it. Otherwise, it seems like converting the class component to a function component wouldn't be much work. (It is a bit of work, but it seems like the reasoning complexity the wrapper adds for maintenance would outweigh the effort.)

**COMMIT: 9.0.6 - REFACTOR: convert ProductDetail to a class and use a wrapper function to use hooks with it**

## Render prop pattern: create a render prop for useFetch to make it reusable for class components

Sometimes, we might need the same hook in different class components. Render props are reusable.

-  New component accepts prop called `render`
-  Component passes data and functions to `render` function
-  Call the new component in the class component with most of the `render` function pulled into the prop (anything that needs data from the new component)

```tsx
interface IFetchProps {
	url: string;
	render: (data: any, isLoading: boolean, error: any) => React.Component;
}

export function Fetch({ url, render }: IFetchProps) {
	const { data, isLoading, error } = useFetch(url);
	return render(data, isLoading, error);
}
```

Using this in the class gets hairy. Had to pull almost all the code into the `render` property. Looks like a lot of cognitive friction that ensures maintenance is harder. Introduces a lot of room for error getting it right. I have a feeling this does bad things to testability too. I'd need a very good reason to do this instead of convert to a function component if I wanted to use a hook.

**COMMIT: 9.0.7 - REFACTOR: change class-based ProductDetail to use a render prop to pass data from the useFetch hook**

## Function as child pattern: use a children function instead of a render function

Instead of declaring a prop for `render`, use `children`.

-  I think I see where this is going, roughly

-  Declare `children` as a prop on `Fetch` and use `children` instead of `render`
-  In `ProductDetail`, wrap the `<Fetch>` tag around the `render` prop
-  Remove `render=` leaving the function wrapped around the JSX

This pattern gives marginally fewer bytes of code.

Basic test shows it works.

**COMMIT: 9.0.8 - REFACTOR: use function as a child pattern to use the Fetch hook in ProductDetail**

## Using contextType to consume context directly

Need to import context (export it)

-  In `useCartContext.tsx`, add `export` to `CartContext` declaration
-  In `ProductDetailClass.tsx`
   -  Replace `import ... useCartContext` with `import ... CartContext`
   -  Remove destructures and prop passes of `dispatchCartItemsAction`
   -  Option 1: static method: Above `render` add `static contextType = CartContext;` -> `this.context` is now `CartContext`
      -  TS -> `contextType: React.Context<ICartContextState>`
      -  Need to export `ICartContextState` from `useCartContext.tsx`
      -  Use `this.context.dispatchCartItemsAction`
   -  TS/VSCode is complaining and says it wants `declare context: React.ContextType<typeof CartContext>;` after the `static...`
      -  Message: If using the new style context, re-declare this in your class to be the React.ContextType of your static contextType. Should be used with type annotation or static contextType.
      -  Casting the right side of the `static..` doesn't resolve it
      -  TS pre-3.7 requires `context!` instead of `declare context`

I'm getting an error from Babel that implies I need to configure the order in which plugins run. I can't find where that's happening, though.

```
SyntaxError: /home/jmjf/dev/learn-react/manage-react-state/shoe-store/src/components/ProductDetailClass.tsx: TypeScript 'declare' fields must first be transformed by @babel/plugin-transform-typescript.
If you have already enabled that plugin (or '@babel/preset-typescript'), make sure that it runs before any plugin related to additional class features:
 - @babel/plugin-proposal-class-properties
 - @babel/plugin-proposal-private-methods
 - @babel/plugin-proposal-decorators
  29 |  };
  30 |
> 31 |  declare context: React.ContextType<typeof CartContext>;
     |  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  32 |  static contextType = CartContext;
```

I tried installing the Babel plugins, but am not sure how to get them to work.

The solution I found was to destructure `this.context as React.ContextType<typeof CartContext>` in the `render` function, then called the destructured function (ll. 34-36).

Limitation: This approach only lets you consume one context. (Many context option next.)

**COMMIT: 9.0.9 - REFACTOR: use context directly in the class with static contextType**

Because `node_modules` may be out of sync, I'm going to delete it and `npm install` in both the main repo and shoe-store directories to ensure it's properly aligned.

Confirmed code still works.

**COMMIT: 9.0.10 - CHORE: ensure node_modules matches package.json**
