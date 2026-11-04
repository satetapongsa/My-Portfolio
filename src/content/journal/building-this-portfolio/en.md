---
title: Building This Portfolio with React and Vite
description: How the site goes from a plain, unstyled HTML document to a full interface — phases, lazy chunks, CSS isolation, bilingual content and image budgets.
date: 2026-11-04
category: Web Development
tags: React, Vite, TypeScript, Performance, i18n
---

This site starts by pretending not to be a website. For three seconds you see a plain HTML document in the browser's default Times New Roman, with blue underlined links and an 8-pixel margin. Then the signal breaks, and the real interface boots.

That idea — *from raw HTML to digital identity* — shaped most of the technical decisions. This note walks through them.

## Three phases, one state machine

The app moves through four phases: `raw`, `boot`, `reveal` and `ready`. They live in a small reducer inside `useBootSequence`, and every transition only moves forward:

```ts
case 'BOOT_DONE':
  return state.phase === 'boot' ? { ...state, phase: 'reveal' } : state;
```

Because a stray timer can never rewind the state, StrictMode's double effects and slow devices cannot push the site back into an earlier phase. The current phase is also written to `<html data-phase="…">`, which the stylesheets use as a scope.

| Phase | Duration | What is on screen |
| --- | --- | --- |
| raw | 3000 ms | A real, unstyled HTML document |
| boot | 5000 ms | The glitch sequence |
| reveal | 700 ms | The interface wipes in |
| ready | — | The portfolio |

## Zero CSS on the first screen

The RAW page only works if no stylesheet touches it. `index.html` links no CSS at all, and the entry module imports none. Every style for the boot sequence and the portfolio lives in lazy chunks, and every selector is scoped to `.boot`, `.wave-app` or `html[data-phase]`.

That scoping matters more than it sounds: the chunks are **downloaded during the RAW phase** so the boot can start on time, which means their CSS is already in the document while the raw page is still visible. Scoped selectors are what keep it invisible until it is needed.

## Preloading without Suspense

The obvious tool for lazy components is `React.lazy`. It caused a real problem here: when a lazy component resolves, Suspense throttles the reveal of its content by roughly 300 ms. For a five-second animation that has to start exactly when the RAW timer ends, that delay was enough to desynchronise the timeline.

The fix was a small hook that resolves the chunk during RAW and keeps the component itself in state, so it mounts synchronously when its phase begins:

```ts
function usePreloaded<P>(loader: () => Promise<{ default: ComponentType<P> }>) {
  const [component, setComponent] = useState<ComponentType<P> | null>(null);
  useEffect(() => {
    let alive = true;
    loader().then((mod) => alive && setComponent(() => mod.default));
    return () => { alive = false; };
  }, [loader]);
  return component;
}
```

The boot timer also starts only once the overlay has actually mounted, and the reveal waits for the portfolio chunk — so a slow network shortens nothing and never exposes a blank page.

## Two languages, checked by the compiler

The interface is fully translated into Thai. The English dictionary is a plain object, and its type is the contract for every other language:

```ts
const en = { nav: { journal: 'Journal' /* … */ } };
export type UIStrings = typeof en;
const th: UIStrings = { nav: { journal: 'บันทึก' /* … */ } };
```

If a Thai string is missing, the build fails. Personal content (projects, skills, certificates) uses a different pattern: English lives in `src/data`, and Thai overrides are keyed by id, so links, images and structure are never duplicated.

Thai also needs its own typography. Thai glyphs carry tone marks above and vowels below, so the site raises the line height to 1.75 for Thai and removes the letter-spacing that the Latin display type uses.

## A theme without a flash

Dark is the default and light is optional. The saved choice is applied to `<html>` *before* React renders, so a returning visitor who picked light never sees a dark frame first. All colours are tokens declared on `.wave-app`, and the light theme only overrides tokens.

## Images on a budget

The credentials section originally loaded every certificate at full resolution. Measured in the browser, the grid transferred **3,910,564 bytes** across 10 images.

A small `sharp` script now generates two WebP versions of each certificate: a 640 px thumbnail for the grid and a 1600 px preview for the viewer. The original files are untouched and only fetched for *Open full size* and *Download*. After the change, the grid transfers **212,092 bytes** — about 95% less — and every thumbnail has fixed dimensions and a skeleton, so nothing shifts while it loads.

## Real URLs for deeper pages

Case studies, this journal and the lab each have their own address. The site only has a handful of routes, so instead of adding a routing library it uses the History API directly, with `useSyncExternalStore` to subscribe to location changes. Vercel rewrites every path to `index.html`, and a visitor who opens a deep link goes straight to that page — the RAW intro belongs to the home page only.

## What I would keep

- **Scope everything.** Scoped CSS made it possible to preload aggressively without breaking the first screen.
- **Let the type system hold translations together.** A missing string is a build error, not a blank label.
- **Measure before optimising.** The image work was worth doing because the before-and-after numbers came from the browser, not from guesses.
