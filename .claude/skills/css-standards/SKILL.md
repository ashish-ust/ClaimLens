---
name: css-standards
description: CSS standards for this project, based on current CSS specifications and WCAG 2.2 AA. Use when writing, editing or reviewing any .css file or style-related code in this project, adding design tokens, styling components or pages, handling responsive layout, focus states, motion, colour contrast or print, or when the user asks for CSS best practices.
---

# CSS standards

Baseline: current CSS specifications using features that are Baseline widely available (no experimental flags), WCAG 2.2 AA contrast and focus rules, and `prefers-reduced-motion`. The project uses plain CSS with no preprocessor and no utility framework. Keep it that way unless the user asks for a change.

## Project structure

- `src/styles/global.css` holds design tokens on `:root` and shared primitives: buttons, form controls, chips, severity classes, alerts, utilities, and the focus ring. Add to it only for things used across several components.
- Each component or page has its own stylesheet next to the `.tsx` file, imported from that file. Put styles for one component in that component's stylesheet.
- Do not add global element selectors (`div`, `span`) in component stylesheets.

## Design tokens

- Define colour, radius, shadow and spacing as custom properties on `:root` (in `global.css`). Use them with `var(--token)`. Do not repeat raw hex values in component files.
- Name tokens by role, not by appearance: `--color-primary`, `--color-muted`, `--high`, not `--teal` or `--red`.
- If you need a tint, use `color-mix(in srgb, var(--token) 35%, transparent)`, as the chip styles do, rather than a new hex value.
- Give each token one meaning. The risk palette (`--ok`, `--caution`, `--high`, `--unavailable`) is for status only. Do not reuse it for decoration.
- If dark mode is ever added, redefine the tokens under `@media (prefers-color-scheme: dark)` and `:root[data-theme="dark"]`. Do not add it without asking.

## Selectors and specificity

- Use single class selectors. Avoid ID selectors, attribute selectors for styling where a class works, and deep chains such as `.a .b .c .d`.
- Keep specificity flat. Modifiers can be a second class (`.button.button-primary` or `.button-primary` on its own, as the project does).
- Avoid `!important`. The one existing exception is `.visually-hidden`, which must override a wrapper.
- Use the project's kebab-case class names, prefixed with the block name (`decision-note`, `decision-result-title`). Name states with a class that describes the state (`is-open`, `is-busy`) or with an ARIA attribute (`[aria-busy="true"]`), which is preferred when it fits.
- Native nesting is allowed when the browser support is Baseline, but keep nesting shallow (no more than two levels).

## Layout

- Use Flexbox for one-dimensional layout and Grid for two-dimensional layout. Use `gap` on flex and grid containers rather than margins on children.
- Use `minmax(0, 1fr)` in grid tracks and `min-width: 0` on flex children so long text does not overflow. Use `overflow-wrap: anywhere` for user-supplied text such as narratives and IDs, as the existing review and claims styles do.
- Use `max-width` with `width: 100%` for containers. The `.container` primitive is the page width.
- Prefer logical properties (`margin-inline`, `padding-block`, `inset-inline-start`) in new code where they make the CSS simpler. Do not convert working code only to change the property names.
- Use container queries (`@container`) for components that appear at different widths, and media queries for page-level layout. The project's breakpoint for small screens is `600px`.
- Make the layout work at phone width (16px side gutter, no horizontal page scroll) and at tablet width.

## Typography

- Use `rem` for font sizes, and `clamp()` for fluid headings (as `h1` does). Do not set body text in `px`.
- Keep line length readable: use `max-width: 65ch` to 75ch for paragraphs.
- Use `line-height` between 1.4 and 1.6 for body text. The base is 1.5.
- Use `text-wrap: balance` for short headings and `text-wrap: pretty` for paragraphs, if you want the nicer line breaks. Both are progressive enhancements.
- Use the system font stack in `:root` unless the user adds a web font. If a web font is added, load it from Google Fonts only and use `font-display: swap`.

## Colour and contrast

- Body text has a contrast ratio of at least 4.5:1 against its background. Large text (24px, or 18.66px bold) and UI components such as borders of form fields and icons need at least 3:1.
- Never rely on colour alone to show status. Pair severity colour with an icon and a text label.
- Check any new colour pair before you use it. The validated pairs are the `--*` and `--*-bg` pairs in `global.css`.

## Focus and interaction

- Keep the global `:focus-visible` outline. Do not write `outline: none` without a replacement focus style of at least equal visibility.
- Give interactive elements a hit area of at least 44px in height, as `.button` does. Use `min-height` rather than fixed heights so text can grow.
- Use `:hover` only for enhancement. Make the same action work with keyboard focus and touch. Wrap hover-only effects in `@media (hover: hover)` if they would stick on touch devices.
- Transitions are for feedback (colour, background, opacity). Keep them short (0.15s to 0.3s).

## Motion

- Every animation must respect `prefers-reduced-motion`. Use `@media (prefers-reduced-motion: reduce)` to slow it, stop it, or swap it for a non-moving state. The project uses this for the skeleton shimmer and the spinner.
- Animate only `transform` and `opacity` where possible. Avoid animating layout properties such as `width`, `top` or `margin`.
- Do not use animation to convey information that is not also shown another way.

## Responsive and print

- Use `rem`, `%`, `vw` with a `clamp()`, or `fr` units. Avoid fixed widths for content.
- Images follow `img { max-width: 100%; display: block; }` from `global.css`. Set `aspect-ratio` on image containers to avoid layout shift.
- If printing matters for a page (for example a review report), add an `@media print` block that hides the decision dock and modals and removes shadows.

## Things to avoid

- `float` for layout. Use Flexbox or Grid.
- `@import` in CSS. It blocks rendering. Import stylesheets from the TSX files instead, which Vite bundles.
- Vendor prefixes written by hand. Let the build handle them, or check the Baseline status.
- Magic numbers for z-index. Keep the scale small and documented (the sticky decision dock uses `z-index: 30`, the skip link `100`).
- Unused selectors. When you remove a component, remove its stylesheet rules too.

## Checklist before you finish

- Every new colour comes from a token.
- Focus is visible on every new interactive element.
- Text and UI controls meet the contrast ratios above.
- The layout works at 320px wide and at tablet width, with no horizontal scroll.
- Any new animation is disabled or reduced for `prefers-reduced-motion`.
- `npm run build` passes (Vite will report CSS syntax errors there).
