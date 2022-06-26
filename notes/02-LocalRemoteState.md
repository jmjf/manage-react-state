# Local and remote state

Apps usually need to store data they're using and get data from a remote server.

## Tools

-  git
-  node (10+ required, latest LTS recommended)
-  create-react-app (generator)
-  editor (VSCode used)
-  Prettier or similar (recommended)

To keep the course focused on state

-  Not using PropTypes or TypeScript (recommeneded for type enforcement; I'm using TS)
-  Using plain CSS (better solution like CSS modules or CSS in JS and styles per component recommended)
-  Some code will be copy/paste (though I'll probably type to familiarize myself with syntax and patterns)

I used his starter and:

-  Manually installed dependencies to get the latest versions (original in notes/00-OriginalDependencies.json)
-  Set up `tsconfig.json`
-  Converted `jsx` to `tsx`
   -  Left `js` alone for now
-  Confirmed it seems to run
-  Changed footer (copyright; credit Pluralsight, but I'll be making changes)

See `README.md` for info on how he changed from `create-react-app` default.

**COMMIT 2.0.1 - CHORE: setup base environment from instructor's starter with my changes**

## useState and hooks
