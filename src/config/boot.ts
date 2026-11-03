/**
 * Boot sequence timing (ms). RAW → BOOT → REVEAL → READY.
 * The CSS timeline in components/BootSequence/boot.css is choreographed
 * against BOOT_DURATION = 5000 — keep them in sync if you change it.
 */
export const RAW_DURATION = 3000;
export const BOOT_DURATION = 5000;
export const REVEAL_DURATION = 700;

/** Add `?intro=skip` to the URL to jump straight to the portfolio. */
export const SKIP_INTRO_PARAM = 'intro';
