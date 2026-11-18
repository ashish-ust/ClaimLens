# ClaimLens UI

**See through every claim.**

Frontend for ClaimLens, an insurance claim fraud-screening portal built for a hackathon demo. Adjusters upload two claim photos and a narrative, watch the analysis run, then review the findings and approve or reject the claim. The backend is a separate FastAPI service.

## Stack

- React 18, Vite, TypeScript (strict)
- react-router-dom 6
- Plain CSS: one global stylesheet with CSS variables, plus small component stylesheets
- No UI component library, no Tailwind

## Run it

Requirements: Node.js 18 or newer, and the ClaimLens backend running on port 8000.

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build      # type-check (tsc --noEmit) and production build into dist/
npm run preview    # serve the production build on http://localhost:5173
npm run typecheck  # type-check only
```

## Backend URL

The API base URL is read from `VITE_API_BASE_URL`. It defaults to `http://localhost:8000`.

To point at a different backend, copy `.env.example` to `.env.local` and edit it:

```bash
cp .env.example .env.local
# VITE_API_BASE_URL=https://claims-api.example.internal
```

Restart `npm run dev` after changing it, because Vite reads env files at startup. Values prefixed with `VITE_` are public and are included in the built JavaScript. Do not put API keys or secrets in them. The frontend holds no keys.

The backend must allow CORS from the UI origin (`http://localhost:5173`). Photos are loaded directly by `<img>` tags, so the image endpoints must also be reachable from the browser without extra headers.

## Pages

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | Upload | Photo 1 (required) and Photo 2 (optional) drop zones, narrative, `POST /api/analyses`, four-step progress view |
| `/review/:analysisId` | Review | Loads `GET /api/analyses/{id}` (refresh-safe), risk banner, evidence, findings, approve/reject |
| `/claims` | Approved claims | `GET /api/claims` grid with thumbnails and an empty state |

## Project layout

```
src/
  api/client.ts          typed fetch helpers, ApiError (network / http / parse)
  config.ts              API base URL, upload and narrative limits
  types.ts               types that mirror the API contract
  utils/                 verdict styles, validation, formatting, error messages
  components/            UI pieces (see file names: RiskBanner, FindingCard, DecisionBar, ...)
  pages/                 UploadPage, ReviewPage, ClaimsPage
  styles/global.css      design tokens (CSS variables) and shared primitives
```

## Assumptions

These were made without asking, since the brief said not to ask questions. Change them if the backend differs.

1. **Photo labels come from list position.** The first image in `images` is "Photo 1". `index` values are used only to match references, such as `image_index` in duplicate matches and per-photo AI results. This works whether the backend numbers images from 0 or 1.
2. **Narrative is trimmed before sending.** The 20 to 3000 character rule applies to the trimmed text, so whitespace-only input does not count. The trimmed text is what is sent and displayed in the review page's "as submitted" quote.
3. **Similarity for duplicates is derived.** The brief gives only `hamming_distance`. The UI assumes 64-bit perceptual hashes and shows similarity as `1 - distance / 64`. If the backend uses a different hash size, change `describeSimilarity` in `src/components/DuplicateDetails.tsx`.
4. **Duplicate comparison.** When `matched_image_url` is present, the uploaded photo and the matched image are shown side by side. When it is null, the UI says the match was with the other uploaded photo and shows no second image.
4a. **Photo 2 is optional.** Only Photo 1 is required on the upload page. When Photo 2 is empty, the `image2` form field is left out of `POST /api/analyses`, so the backend must accept a request with `image1` alone.
5. **Progress steps advance every 6 seconds.** The fourth step stays active until the response arrives. The steps then all tick, and the app opens the review page after a 0.6 second pause.
6. **Client-side photo checks.** JPEG, PNG or WebP only, 10 MB maximum. The backend remains the authority and its error messages are shown when it rejects a request.
7. **Reviewer note** is optional, sent as `null` when empty, and capped at 1000 characters in the input. The cap is not in the contract.
8. **Already-decided claims.** `AnalysisResult` has no `claim_id`, so reopening an approved claim shows "This claim was already approved." without an ID. The ID is shown only directly after a decision in the same session.
9. **Lightbox zoom** steps through 100%, 150%, 200% and 300%. Keyboard: Escape closes, `+` and `-` zoom.
10. **Verdict-to-severity mapping.** Green is ok (Unique, Likely authentic, Consistent, LOW, PROCEED). Amber is caution (Possible duplicate, Possibly edited, Partially consistent, MEDIUM, REVIEW). Red is high (Duplicate, Likely AI-generated, Inconsistent, HIGH, ESCALATE). Grey is unavailable. Every chip shows an icon and a text label.
11. **No authentication.** The contract has none, so none is implemented. Add it at the API gateway if needed.
12. **Single-page app with BrowserRouter.** The Vite dev server handles deep links such as `/review/abc`. A static host needs a rewrite rule that sends unknown paths to `index.html`.

## Accessibility

- Visible focus ring on every interactive element.
- Icons are always paired with a text label, so colour is never the only signal.
- Confidence and risk score use `role="meter"` with values.
- The details areas on finding cards use native `<details>` elements.
- Dialogs use `role="dialog"` and `aria-modal`, close on Escape, and return focus to the trigger.
- Responsive down to tablet width, with a single-column layout on small screens.

Known gap: dialogs do not trap Tab focus. Focus is moved into the dialog on open and restored on close, but Tab can leave it. This is acceptable for the demo but should be addressed before production.

## Dependency audit

Versions were chosen to pick up the patched non-breaking releases: `react-router-dom` 6.30.6 and `vite` 5.4.21. `npm audit` still reports the following. Fixing them needs major upgrades (React Router 7, Vite 8), which were out of scope for the demo.

- **Vite (high), dev server only.** The advisories cover the `server.fs` file-access checks in the dev server. They are not in the production bundle. Do not expose `npm run dev` beyond localhost.
- **esbuild (moderate), dev server only.** Cross-origin reads from the Vite dev server. Same scope as above.
- **React Router (moderate), open redirect.** The advisory covers redirects to protocol-relative or backslash paths. The app only navigates to fixed routes and to `/review/{id}`, with the ID URL-encoded. Upgrade to React Router 7 before any production use.

Run `npm audit` for the current list.
