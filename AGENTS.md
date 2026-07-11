# Repository guidance

## Verification

- Never run `pnpm build`, `next build`, or another production build as proof that the site is working. Building disrupts the local development server and is not a valid substitute for checking the running site.
- Verify site changes against the existing development server, normally at `http://localhost:3010/`, using focused browser checks and the narrowest relevant static checks.
- Run a production build only when the user explicitly asks for one.
