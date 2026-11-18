# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

ClaimLens UI is the React frontend for ClaimLens, an insurance claim fraud-screening portal. Adjusters upload two claim photos and a narrative, watch the analysis run, then review findings and approve or reject the claim. The backend is a separate FastAPI service that runs on `http://localhost:8000` by default. `README.md` has the full page list, backend contract notes and the list of assumptions. Read it before changing behaviour.

## Commands

```bash
npm install            # install dependencies (Node 18+)
npm run dev            # Vite dev server on http://localhost:5173 (strict port)
npm run build          # tsc --noEmit, then vite build into dist/
npm run typecheck      # type-check only
npm run preview        # serve dist/ on port 5173
```

There is no test runner, linter or formatter configured. `npm run build` is the verification step. Run it after every change and before reporting work as done. If you add a test or lint setup, update this section.

## Stack

- React 18.3, TypeScript 5.6 in strict mode, Vite 5, react-router-dom 6 (`BrowserRouter`).
- Plain CSS only: one global stylesheet with design tokens, plus one stylesheet per component or page.
- No UI component library and no Tailwind. Do not add one without asking.

## Layout

```
src/
  api/client.ts        all fetch calls and the ApiError class (kinds: network | http | parse)
  config.ts            API base URL and upload / narrative limits
  types.ts             types that mirror the backend API contract
  utils/               verdictStyles, validation, format, errors (describeError), images
  components/          UI pieces; each .tsx may have a matching .css next to it
  pages/               UploadPage, ReviewPage, ClaimsPage (each with a .css file)
  styles/global.css    design tokens (CSS custom properties on :root) and shared primitives
```

Routes are defined in `src/App.tsx`. Each route is wrapped in an `ErrorBoundary` keyed by pathname.

## Conventions

- **Components:** one default-exported function component per file, named the same as the file (PascalCase). Props are an `interface Props`. Add a short `/** JSDoc */` above exported components and helpers.
- **Imports:** use `import type` for type-only imports. Import component styles from the component file (`import './DecisionBar.css';`).
- **API calls:** go through `src/api/client.ts`. Do not call `fetch` from components. Errors are `ApiError`; show them to the user with `describeError` from `src/utils/errors.ts`.
- **Config and env:** read configuration through `src/config.ts`, not directly from `import.meta.env` in components. `VITE_*` values are public and end up in the bundle. Never put keys or secrets in them.
- **Styling:** use the CSS variables in `global.css` for colour, radius and shadow. Do not hard-code new colours in component files. Severity uses the `sev-ok`, `sev-caution`, `sev-high` and `sev-unavailable` classes together with `Icon` and a text label. Colour must never be the only signal.
- **Accessibility is a requirement, not a polish step.** Every interactive element needs a visible focus ring (`:focus-visible` is set globally, so do not remove it). Dialogs use `role="dialog"`, `aria-modal`, Escape to close, and focus restoration. Icons always come with a text label. Form fields need an associated `<label>` (use `useId` for the id).
- **Naming:** components and types are PascalCase. Variables and functions are camelCase. Module-level constants are UPPER_SNAKE_CASE. CSS classes are kebab-case, with the block name as a prefix (`decision-note`, `decision-inner`).
- **TypeScript:** `noUnusedLocals` and `noUnusedParameters` are on. Do not use `any`; use `unknown` and narrow it. The compile target is ES2020, so do not use newer built-ins such as `Array.prototype.at` without checking `tsconfig.json`.

## Things to keep in mind

- `dist/` is a generated build output and is gitignored. Do not edit it by hand.
- `.env.local` is gitignored. `.env.example` is the template. Vite reads env files at startup, so restart `npm run dev` after changing them.
- The backend must allow CORS from `http://localhost:5173`. Image URLs are loaded directly by `<img>` tags, so they must work without extra headers.
- The upload limits (JPEG, PNG or WebP, 10 MB maximum, narrative 20 to 3000 characters) are checked on the client as a convenience. The backend is the authority.
- The reviewer-note cap of 1000 characters is a UI choice, not part of the API contract (see `README.md`, assumption 7).
- Known gap: dialogs do not trap Tab focus (see `README.md`, Accessibility). Do not make it worse. Fixing it is welcome.

## Project skills

Skills live in `.claude/skills/`:

- `git-commit`: creates a commit from the current changes, with a generated message. Use it when asked to commit.
- `html-standards`, `css-standards`, `javascript-standards`: the standards to follow when writing or reviewing markup, styles and TypeScript/JavaScript in this project.
