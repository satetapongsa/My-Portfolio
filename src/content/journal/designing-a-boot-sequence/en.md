---
title: Designing a Cinematic Boot Sequence
description: A five-second broken-CRT animation built from CSS keyframes — the timeline, deterministic randomness, accessibility limits and the timing bugs worth knowing about.
date: 2026-11-04
category: Development Notes
tags: CSS, Animation, Accessibility, React
---

Between the raw HTML page and the portfolio, this site plays a five-second sequence that looks like a monitor losing its signal and recovering. It has no video and no canvas: it is HTML, CSS keyframes and a little React to place the pieces.

## The timeline

The sequence is written against a single clock that starts when the overlay mounts. Everything is scheduled in milliseconds from that point.

| Window | What happens |
| --- | --- |
| 0 – 1.0 s | The raw page starts to tremble: small horizontal tears and colour fringing |
| 1.0 – 2.5 s | Corruption builds: pixel blocks, sparks, short black interruptions |
| 2.5 – 3.5 s | Signal loss: *NO SIGNAL*, the image rolls and collapses like an old CRT |
| 3.5 – 4.5 s | Power-on: the grid and logo rebuild from small blocks |
| 4.5 – 5.0 s | A final jitter, *SYSTEM RECOVERED*, then the reveal |

Some moments are precise. The raw image stops being drawn at **2620 ms**, *NO SIGNAL* appears at the same instant for 240 ms, the roll runs from 2860 to 3250 ms and the collapse finishes at 3550 ms, just after the power-on flash begins at 3520 ms.

## Keyframes generated from events

Glitches look wrong when they are smooth. Every tear and flicker uses `steps(1, end)`, so properties jump instead of easing. The hard part is irregularity: evenly spaced keyframes read as mechanical.

The solution was to write each effect as a list of events — *at 1460 ms shift 18 px, at 1530 ms clear* — and convert those lists to percentage keyframes with a small script. A 2620 ms animation with events at uneven intervals produces keyframes like `55.73%` and `58.4%` that nobody would type by hand, which is exactly why they look organic.

## The torn image is the real page

The tears are not a screenshot. The overlay renders clipped copies of the actual raw document, each one a horizontal band that can be offset independently. Each copy uses `all: initial` so the portfolio's styles cannot leak into what is meant to be an unstyled page.

## Randomness that is the same every time

Pixel blocks, sparks and flicker bands are positioned by a seeded pseudo-random generator (the classic Park–Miller generator) rather than `Math.random`:

```ts
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
```

Each wave of blocks has its own seed and time window — corruption between 1050 and 2450 ms, a critical burst between 2500 and 3350 ms, and a rebuild between 3550 and 4100 ms. The result looks chaotic but is identical on every visit, which made the sequence possible to design and review frame by frame.

## Limits it must respect

- **No strobing.** Black interruptions are short and spaced hundreds of milliseconds apart, and there are no rapid full-screen white flashes.
- **Reduced motion is honoured.** If the operating system asks for reduced motion, the glitch never plays: the raw page is followed by a short fade straight into the portfolio.
- **It can always be skipped.** A *Skip intro* button stays on screen, and `?intro=skip` in the URL skips it entirely. Deep links to inner pages never show it at all.
- **Small screens get a compact version** with fewer, larger elements.

## Timing bugs worth knowing about

Two bugs only appeared once the animation was real:

1. **Starting the clock too early.** If the boot timer starts when React decides to show the overlay, the time spent loading its CSS is silently taken from the animation. The timer now starts only after the overlay reports that it has mounted.
2. **Revealing too early.** On a slow connection the five seconds can end before the portfolio has downloaded. The reveal waits for both: `Promise.all([delay(5000), loadPortfolio()])`.

An earlier version also showed a fake diagnostic terminal with scrolling log lines during the glitch. It was removed: the visual failure tells the story on its own, and invented log output did not belong on a site meant to show real work.
