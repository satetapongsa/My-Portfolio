/**
 * Boot sequence timing (ms). RAW → BOOT → REVEAL → READY.
 * The CSS timeline in components/BootSequence/boot.css is choreographed
 * against BOOT_DURATION = 5000 — keep them in sync if you change it.
 */
export const RAW_DURATION = 3000;
export const BOOT_DURATION = 5000;
export const REVEAL_DURATION = 700;

/** Visual-only diagnostic lines (ms from BOOT start). Nothing here is real. */
export const TERMINAL_LINES = [
  { at: 900, tag: 'SYS', text: 'INITIALIZING DISPLAY DRIVER' },
  { at: 1180, tag: 'WARN', text: 'INCOMING SIGNAL DETECTED' },
  { at: 1460, tag: 'WARN', text: 'SIGNAL SYNCHRONIZATION LOST' },
  { at: 1760, tag: 'ERR', text: 'DISPLAY SYNCHRONIZATION ERROR' },
  { at: 2250, tag: 'ERR', text: 'VISUAL BUFFER CORRUPTED' },
  { at: 3050, tag: 'SYS', text: 'RECONSTRUCTING INTERFACE...' },
  { at: 3340, tag: 'SYS', text: 'RESTORING SYSTEM STATE...' },
  { at: 3630, tag: 'SYS', text: 'REBUILDING DIGITAL ENVIRONMENT...' },
  { at: 3960, tag: 'OK', text: 'DIGITAL ENVIRONMENT RESTORED' },
] as const;

/** Add `?intro=skip` to the URL to jump straight to the portfolio. */
export const SKIP_INTRO_PARAM = 'intro';
