# Routing

## Make App just the App

-  Move the products component out of `App.js`
   -  I think almost everything will move
   -  And that's what he does
   -  Everything inside `<main>` stays in `Products`
   -  Everything outside and including `<main>` stays in `App`
-  Ensure `App` renders just the the header and footer
-  Put `<Products>` in `App`'s `<main>` to be sure everything works

**COMMIT: 3.0.1 - REFACTOR: move Products component out of App to prepare for router**
