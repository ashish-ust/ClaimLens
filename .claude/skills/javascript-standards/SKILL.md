---
name: javascript-standards
description: JavaScript and TypeScript standards for this project (React 18, strict TypeScript, Vite, ES modules), based on the ECMAScript specification, the TypeScript handbook and React's current guidance. Use when writing, editing or reviewing .ts, .tsx, or .js code, components, hooks, API calls, error handling, types, or module structure, or when the user asks for JavaScript or TypeScript best practices.
---

# JavaScript and TypeScript standards

Baseline: ECMAScript modules, TypeScript with `strict` on, React 18 function components and hooks, and the project's own conventions. The project is TypeScript, so write `.ts` and `.tsx`. Use plain `.js` only for config files Vite requires.

## Compiler and target

- `tsconfig.json` has `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `isolatedModules` and `noEmit`. Keep them on. Fix warnings; do not silence them with `// @ts-ignore`. If you must suppress, use `// @ts-expect-error` with a reason on the same line.
- The target is ES2020 and the `lib` is ES2020 with DOM. Do not use newer built-ins (for example `Array.prototype.at`, `Object.groupBy`, `Array.prototype.findLast`) unless you change the target or lib deliberately. Check `tsconfig.json` first.
- Run `npm run build` (type-check then bundle) after changes. `npm run typecheck` runs the type check on its own.

## Types

- No `any`. Use `unknown` for values of uncertain type, and narrow them with type guards or `in` checks, as `readErrorMessage` in `api/client.ts` does.
- Type the contract, not the guess. API shapes live in `src/types.ts` and mirror the backend. Change them there, and keep the names aligned with the API.
- Use `import type` for type-only imports. This is required by `isolatedModules`.
- Prefer `interface` for component props and object shapes, and `type` for unions, mapped types and aliases. Use string-literal unions (for example `DecisionValue`) rather than enums.
- Use `Record<K, V>` for lookup tables that must cover every key (as `verdictStyles.ts` does). The compiler then flags a missing case.
- Export explicit types for public functions and module boundaries. Let TypeScript infer types for local variables.
- Use `as const` for fixed arrays and objects (as `ACCEPTED_IMAGE_TYPES` does). Avoid type assertions (`as Foo`) unless you have narrowed the value first. A non-null assertion (`!`) needs a reason, and an `if` check is usually better.

## Modules and naming

- ES modules only (`import`/`export`). Use named exports for utilities, and a default export for a page or component file, as the existing code does.
- Name components and types in PascalCase. Name variables and functions in camelCase. Name module-level constants in UPPER_SNAKE_CASE (`MAX_IMAGE_BYTES`). Name booleans as questions (`isSubmitting`, `hasError`).
- File names: components in PascalCase (`DecisionBar.tsx`), utilities and modules in camelCase (`verdictStyles.ts`, `client.ts`).
- Keep one component per file. Keep helper functions private to the file unless another module uses them.
- Use `/** JSDoc */` on exported functions and components to say what they do and why. Do not restate the code in comments.

## Values and control flow

- Use `const` by default, `let` only when the value is reassigned, and never `var`.
- Use `===` and `!==`. Use `??` for defaults that must keep `0` and `''`, and `?.` for optional access. Use `||` only when every falsy value should fall back.
- Prefer early returns to deep nesting.
- Prefer `for...of`, `map`, `filter`, and `find` over index loops, unless performance or index access requires the loop.
- Use object spread to update state immutably: `setState(prev => ({ ...prev, field: value }))`.
- Avoid `switch` without a `default` (or an exhaustive `never` check) when it matches a union.

## Async and promises

- Use `async`/`await`. Do not mix it with `.then()` chains in the same function.
- Every promise is either awaited, returned, or explicitly handled. Do not leave floating promises. Use `void` only when the call is intentionally fire-and-forget, with a comment.
- Pass an `AbortSignal` to `fetch` in effects so a stale request cannot update state after unmount. The `getAnalysis` and `listApprovedClaims` helpers accept a signal for this reason. Ignore `AbortError` (see `isAbortError` in `api/client.ts`).
- Show loading, error and success states for every request. Use `describeError` to turn a thrown value into a message a person can act on.

## Errors

- Throw `Error` objects (or subclasses such as `ApiError`), not strings.
- In a `catch`, treat the error as `unknown` and narrow it with `instanceof`.
- Do not write an empty `catch`. If an error is safe to ignore, add a comment that says why (as `readErrorMessage` does).
- Keep the message human-readable and free of internal detail. Never show stack traces or raw server bodies to the user.

## React

- Use function components and hooks only. No class components, except the `ErrorBoundary`, which needs `componentDidCatch`.
- Follow the Rules of Hooks: call hooks at the top level, and only in components or custom hooks. Custom hooks start with `use`.
- Use `useId()` for ids that link labels and inputs or ARIA references. Do not generate ids with `Math.random()`.
- Derive values during render. Do not copy props into state, and do not sync state with another state in an effect. Keep state as small as possible.
- Keep effects for synchronising with something outside React (network, timers, DOM listeners). Always return a cleanup function when you add a listener, timer or subscription.
- List every value an effect reads in its dependency array. Do not suppress a missing-dependency warning (`react-hooks/exhaustive-deps`) with a disable comment. The project has no linter yet, but the rule is still the standard to meet.
- Use stable, unique `key` values from the data (ids), not the array index, when items can reorder or be removed.
- Add `useMemo` and `useCallback` only when you have measured a cost, or when a stable reference is needed for a dependency array. They are not needed by default.
- Lift state up only as far as the components that need it. Pass callbacks such as `onDecided` for child-to-parent communication.
- Pass props explicitly. Do not spread unknown props onto DOM elements.
- Do not use `dangerouslySetInnerHTML` with server or user text. If you truly need HTML, sanitise it first and explain why.

## Browser and environment

- Read configuration through `src/config.ts`. `import.meta.env.VITE_*` values are public and end up in the bundle. Never put secrets there.
- Create object URLs with `URL.createObjectURL` and revoke them when the component no longer needs them.
- Do not touch the DOM directly in React code. If you need a ref, use `useRef` and type it (`useRef<HTMLButtonElement>(null)`).
- Use `localStorage` and `sessionStorage` only for small, non-sensitive preferences, and wrap access in `try`/`catch` because it can throw in private modes.
- Validate user input on the client for good feedback, and assume the server is the authority.

## Security

- Do not log personal data or secrets. Do not put them in URLs or query strings.
- Encode path segments that contain IDs with `encodeURIComponent`, as `client.ts` does.
- Do not build HTML or URLs from raw strings. Use JSX and the URL API.
- Use `rel="noopener noreferrer"` on `target="_blank"` links.

## Performance

- Keep bundles small. Import only what you use. Do not add a dependency for a few lines of code.
- Lazy-load routes or heavy components with `React.lazy` and `Suspense` if the bundle grows. Measure first.
- Avoid work in render that runs on every keystroke. Keep handlers light.

## Checklist before you finish

- `npm run build` passes with no type errors.
- No `any`, no `@ts-ignore`, no unused variables or parameters.
- Every effect that adds a listener, timer or request has a cleanup.
- Every async call has loading, error and success handling.
- New shared values live in `config.ts`, `types.ts` or `utils/`, not copied across files.
