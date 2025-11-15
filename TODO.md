# Depedncies errors on prod server

- some of the dependencies are not being installed automatically via package.json files
- all of the package.json commands are not working and need to be prefixed with NODE_ENV=production
  - some of the root functions don't work
    - prisma doesn't work without running in the server folder
      - ✅ Now works with standard .env file (no dotenv command needed)

    - importExercises also needs
      - NODE_ENV=production pnpm import:exercises

  - running pnpm build in root breaks the web build

---

POTENTIAL FIX:

- ✅ Changed .env.production ==> .env for standard naming (Prisma compatibility)
