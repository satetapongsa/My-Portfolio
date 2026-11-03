/** The W mark: a waveform that reads as a "W". */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`logo ${className}`}>
      <span className="logo__mark" aria-hidden="true">
        <svg viewBox="0 0 32 32">
          <defs>
            <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#00D9FF" />
              <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          <path d="M5 9.5 L10 23 L14 14 L16 18.5 L18 14 L22 23 L27 9.5" fill="none" stroke="url(#logo-grad)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="logo__text">WAVE</span>
    </span>
  );
}
