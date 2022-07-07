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
