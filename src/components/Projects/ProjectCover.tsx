import type { Project } from '../../data/types';

/** Schematic illustration of the tank control system (not a screenshot). */
function TankSchematic() {
  return (
    <svg viewBox="0 0 400 250" className="cover-svg" aria-hidden="true">
      <g className="cover-grid">
        {Array.from({ length: 11 }, (_, i) => (
          <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="250" />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 40} x2="400" y2={i * 40} />
        ))}
      </g>
      {/* inlet pipes */}
      <path className="cover-pipe" d="M40 40 H110 V70 M40 90 H80 V70 H110" />
      <path className="cover-pipe cover-pipe--flow" d="M40 40 H110 V70" />
      {/* feed tanks */}
      <g className="cover-tank">
        <rect x="110" y="56" width="70" height="104" rx="8" />
        <rect className="cover-level" x="114" y="96" width="62" height="60" rx="5" />
      </g>
      <g className="cover-tank">
        <rect x="220" y="56" width="70" height="104" rx="8" />
        <rect className="cover-level cover-level--violet" x="224" y="112" width="62" height="44" rx="5" />
      </g>
      {/* mixer */}
      <path className="cover-pipe" d="M145 160 V190 H330 M255 160 V190" />
      <path className="cover-pipe cover-pipe--flow" d="M145 160 V190 H330" />
      <g className="cover-mixer">
        <circle cx="330" cy="150" r="34" />
        <path d="M330 120 V180 M310 150 H350" />
      </g>
      {/* valves */}
      <g className="cover-valve">
        <path d="M195 183 l10 7 l-10 7 z M215 183 l-10 7 l10 7 z" />
      </g>
      {/* HMI tag */}
      <g className="cover-tag" transform="translate(28 196)">
        <rect width="98" height="32" rx="6" />
        <text x="12" y="20">HMI · AUTO</text>
      </g>
      <g className="cover-tag cover-tag--alarm" transform="translate(268 26)">
        <rect width="104" height="28" rx="6" />
        <circle cx="14" cy="14" r="4" />
        <text x="26" y="18">ALARM OK</text>
      </g>
    </svg>
  );
}

/** Wireframe perspective interior (not a render). */
function PenthouseWireframe() {
  return (
    <svg viewBox="0 0 400 250" className="cover-svg" aria-hidden="true">
      <g className="cover-room">
        {/* back wall */}
        <rect x="130" y="70" width="140" height="95" />
        {/* perspective edges */}
        <path d="M0 0 L130 70 M400 0 L270 70 M0 250 L130 165 M400 250 L270 165" />
        {/* floor grid */}
        {Array.from({ length: 7 }, (_, i) => {
          const t = (i + 1) / 8;
          const y = 165 + (250 - 165) * t;
          const xl = 130 - 130 * t;
          const xr = 270 + 130 * t;
          return <line key={`f${i}`} x1={xl} y1={y} x2={xr} y2={y} />;
        })}
        {Array.from({ length: 7 }, (_, i) => {
          const x = 130 + (140 / 6) * i;
          const xb = (400 / 6) * i;
          return <line key={`r${i}`} x1={x} y1="165" x2={xb} y2="250" />;
        })}
      </g>
      {/* window with skyline */}
      <g className="cover-window">
        <rect x="150" y="82" width="100" height="58" />
        <path d="M150 140 V122 H162 V112 H174 V126 H186 V104 H198 V120 H212 V98 H224 V118 H238 V110 H250 V140" />
      </g>
      {/* furniture blocks */}
      <g className="cover-furniture">
        <path d="M60 210 L150 190 L210 200 L120 222 Z" />
        <path d="M60 210 V224 L120 236 V222" />
        <path d="M290 176 L330 182 L330 214 L290 206 Z" />
      </g>
      {/* first-person reticle */}
      <g className="cover-reticle">
        <circle cx="200" cy="125" r="10" />
        <path d="M200 108 V116 M200 134 V142 M183 125 H191 M209 125 H217" />
      </g>
      <g className="cover-tag" transform="translate(24 22)">
        <rect width="92" height="28" rx="6" />
        <text x="12" y="18">FPS · UE5</text>
      </g>
    </svg>
  );
}

function GenericCover() {
  return (
    <svg viewBox="0 0 400 250" className="cover-svg" aria-hidden="true">
      <g className="cover-grid">
        {Array.from({ length: 11 }, (_, i) => (
          <line key={i} x1={i * 40} y1="0" x2={i * 40} y2="250" />
        ))}
      </g>
      <path className="cover-pipe cover-pipe--flow" d="M0 125 C 80 60, 160 190, 240 125 S 360 60, 400 125" />
    </svg>
  );
}

/**
 * Shows the real screenshot when `cover.src` is set, otherwise a clearly
 * labelled schematic illustration.
 */
export function ProjectCover({ project, priority = false }: { project: Project; priority?: boolean }) {
  const { cover } = project;
  if (cover.src) {
    return (
      <div className={`cover cover--image${cover.kind === 'artwork' ? ' cover--artwork' : ''}`}>
        <img src={cover.src} alt={cover.alt} loading={priority ? 'eager' : 'lazy'} decoding="async" width={1440} height={900} />
        {cover.kind && (
          <span className="cover__label mono">{cover.kind === 'screenshot' ? 'live screenshot' : 'project artwork'}</span>
        )}
      </div>
    );
  }
  return (
    <div className={`cover cover--${cover.placeholder}`} role="img" aria-label={`${cover.alt} — schematic illustration`}>
      {cover.placeholder === 'tank-system' && <TankSchematic />}
      {cover.placeholder === 'penthouse' && <PenthouseWireframe />}
      {cover.placeholder === 'generic' && <GenericCover />}
      <span className="cover__label mono">schematic illustration</span>
    </div>
  );
}
