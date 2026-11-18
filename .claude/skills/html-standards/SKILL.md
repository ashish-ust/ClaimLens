---
name: html-standards
description: HTML and JSX markup standards for this project, based on the WHATWG HTML Living Standard and WCAG 2.2 AA. Use when writing, editing or reviewing index.html, JSX markup in components or pages, forms, dialogs, images, or any element structure, or when the user asks for HTML best practices or an accessibility check of markup.
---

# HTML standards

Baseline: WHATWG HTML Living Standard, WCAG 2.2 Level AA, WAI-ARIA Authoring Practices. This project writes HTML as JSX inside React 18 components, so the rules below apply to JSX too. Use `className`, `htmlFor`, self-closing tags, and camelCase event handlers.

## Document and page

- `index.html` declares `<!doctype html>`, `lang="en"`, a UTF-8 charset, a viewport meta, a `description`, a favicon and a meaningful `<title>`. Keep all of them.
- One `<h1>` per page. Headings go in order (`h1` > `h2` > `h3`) without skipping levels for looks. Pick the level from the document outline, and style with CSS.
- Use landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`, `<section>` (with a heading), `<aside>`. This project has one `<main id="main">`. Do not add a second `<main>`.
- Keep the skip link (`<a href="#main" className="skip-link">`) as the first focusable element.
- Do not put secrets, API keys or internal URLs in HTML.

## Semantics first

- Use the element that matches the meaning. Use `<button>` for actions, `<a>` or `<Link>` for navigation, `<ul>`/`<ol>` for lists, `<table>` for tabular data with `<th scope>`, `<dl>` for label/value pairs, `<time>` for dates, `<details>`/`<summary>` for disclosure.
- Do not make a clickable `<div>` or `<span>`. If you must, add `role`, `tabIndex={0}`, and keyboard handling, and prefer a real `<button>`.
- Never use `tabIndex` greater than 0. Use `tabIndex={-1}` only for programmatic focus targets such as `<main tabIndex={-1}>`.
- A `<button>` inside a form that should not submit needs `type="button"`. Give every button an accessible name. An icon-only button needs `aria-label` or visually hidden text.
- Use `<button disabled>` rather than hiding an action that is temporarily unavailable, so the state is visible.

## Forms

- Every input has a visible `<label>`. Connect it with `htmlFor`/`id`. Use `useId()` for generated ids so components can be reused. Placeholder text is not a label.
- Use the most specific `type` (`email`, `tel`, `number`, `url`, `date`) and `inputMode` where it helps mobile keyboards. Set `autoComplete` on personal and address fields.
- Show the hint with `aria-describedby`, and errors with `role="alert"` (as in `DecisionBar.tsx`) or `aria-invalid="true"` on the field.
- Set `maxLength` where a limit exists (for example the 1000-character reviewer note), and say the limit in the hint text.
- Group related controls with `<fieldset>` and `<legend>`.

## Images and media

- Every `<img>` needs `alt`. Use descriptive text for meaningful images and `alt=""` for decorative ones. Do not start the alt text with "image of".
- Set `width` and `height` (or an aspect-ratio in CSS) to prevent layout shift. Use `loading="lazy"` for images below the fold. Use `decoding="async"` for large photos.
- Use `<svg aria-hidden="true" focusable="false">` for decorative icons, as `Icon.tsx` does. Icons that carry meaning need a text label next to them, or a `<title>`.
- Do not rely on colour alone to show status. Pair it with an icon and a text label (see `verdictStyles.ts`).

## ARIA

- Use ARIA only when native HTML cannot express the semantics. The first rule of ARIA is not to use ARIA when a native element will do.
- Dialogs: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at the title. Move focus in on open and restore it on close. Close on Escape. Note that trapping Tab focus is still a known gap in this project.
- Live updates: `role="status"` for polite messages (progress, success) and `role="alert"` for errors that need immediate attention. Insert the element into the DOM with its content already present, or change its text, so screen readers announce it.
- Meters: `role="meter"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and `aria-label` (as used for confidence and risk scores).
- Do not set `aria-hidden="true"` on focusable elements.
- Every `aria-*` value must match a real id or state. `aria-controls`, `aria-labelledby` and `aria-describedby` must point at elements that exist on the page.

## Links and navigation

- Link text must make sense out of context. Avoid "click here" and "read more".
- Mark the current item in navigation with `aria-current="page"`.
- Use `target="_blank"` only when needed, and add `rel="noopener noreferrer"`.
- Routes in this app use `react-router-dom` `<Link>`. Do not use `<a href>` for in-app routes, because that reloads the page.

## Lists, tables and states

- Empty states and error states should say what happened and what to do next. Use the existing `ErrorState` and empty-state patterns.
- Loading states should not trap the user. Use `aria-busy` on the region that is loading, and keep the layout stable with skeletons.

## Checklist before you finish

- The page works with the keyboard alone, and focus is always visible.
- Heading order and landmarks make sense when read in a list.
- Every input, image and icon-only control has a name.
- Colour is not the only way status is shown.
- Text and controls keep their meaning at 200% zoom and at phone width.
- `npm run build` passes.
