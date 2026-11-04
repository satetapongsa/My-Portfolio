import { Copy, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { LabStrings } from '../../pages/DeveloperLab/strings';
import { copyText, prefersReducedMotion } from '../../utils/links';
import { useToast } from '../ui/Toast';
import { ColorField, Slider } from './controls';

interface CardStyle {
  background: string;
  from: string;
  to: string;
  angle: number;
  radius: number;
  padding: number;
  gap: number;
  columns: number;
  shadow: number; // 0–100
  speed: number; // seconds per cycle, 0 = off
}

const DEFAULTS: CardStyle = {
  background: '#0b0f16',
  from: '#00d9ff',
  to: '#8b5cf6',
  angle: 135,
  radius: 16,
  padding: 24,
  gap: 16,
  columns: 3,
  shadow: 45,
  speed: 4,
};

const HEX = /^#[0-9a-f]{6}$/i;
const safeHex = (value: string, fallback: string) => (HEX.test(value) ? value.toLowerCase() : fallback);
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, Math.round(n)));

/**
 * The single source of truth: the preview is styled by exactly this text
 * (injected as a <style> scoped to the preview's own class names), so what
 * you copy is what you see. Inputs are clamped numbers and validated hex
 * colours — no free-form CSS is ever accepted.
 */
export function generateCss(raw: CardStyle) {
  const s: CardStyle = {
    background: safeHex(raw.background, DEFAULTS.background),
    from: safeHex(raw.from, DEFAULTS.from),
    to: safeHex(raw.to, DEFAULTS.to),
    angle: clamp(raw.angle, 0, 360),
    radius: clamp(raw.radius, 0, 48),
    padding: clamp(raw.padding, 8, 56),
    gap: clamp(raw.gap, 0, 48),
    columns: clamp(raw.columns, 1, 4),
    shadow: clamp(raw.shadow, 0, 100),
    speed: clamp(raw.speed, 0, 10),
  };
  const blur = Math.round(8 + s.shadow * 0.4);
  const offset = Math.round(2 + s.shadow * 0.18);
  const alpha = (s.shadow / 100) * 0.7;
  const shadow = s.shadow === 0 ? 'none' : `0 ${offset}px ${blur}px rgba(0, 0, 0, ${alpha.toFixed(2)})`;
  const lines = [
    '.playground {',
    '  display: grid;',
    `  grid-template-columns: repeat(${s.columns}, minmax(0, 1fr));`,
    `  gap: ${s.gap}px;`,
    `  padding: ${s.gap + 8}px;`,
    `  background: ${s.background};`,
    `  border-radius: ${Math.round(s.radius * 1.25)}px;`,
    '}',
    '',
    '.playground__card {',
    `  padding: ${s.padding}px;`,
    `  border-radius: ${s.radius}px;`,
    `  background: linear-gradient(${s.angle}deg, ${s.from}, ${s.to});`,
    `  box-shadow: ${shadow};`,
    '  color: #ffffff;',
  ];
  if (s.speed > 0) lines.push(`  animation: playground-float ${s.speed}s ease-in-out infinite alternate;`);
  lines.push('}');
  if (s.speed > 0) {
    lines.push(
      '',
      '.playground__card:nth-child(2n) {',
      `  animation-delay: -${(s.speed / 2).toFixed(1)}s;`,
      '}',
      '',
      '@keyframes playground-float {',
      '  from { transform: translateY(0); }',
      '  to { transform: translateY(-8px); }',
      '}',
      '',
      '@media (prefers-reduced-motion: reduce) {',
      '  .playground__card { animation: none; }',
      '}',
    );
  }
  return lines.join('\n');
}

export function CSSPlayground({ s }: { s: LabStrings }) {
  const notify = useToast();
  const [style, setStyle] = useState<CardStyle>(DEFAULTS);
  const css = useMemo(() => generateCss(style), [style]);
  const set = <K extends keyof CardStyle>(key: K) => (value: CardStyle[K]) => setStyle((prev) => ({ ...prev, [key]: value }));
  const reduced = prefersReducedMotion();

  const copy = async () => {
    const ok = await copyText(css);
    notify(ok ? s.copied : s.copyFailed, ok ? 'success' : 'error');
  };

  return (
    <div className="lab-exp">
      <div className="lab-exp__controls" role="group" aria-label={`${s.css.title} — ${s.controls}`}>
        <div className="lab-colors">
          <ColorField label={s.css.background} value={style.background} onChange={set('background')} />
          <ColorField label={s.css.gradientFrom} value={style.from} onChange={set('from')} />
          <ColorField label={s.css.gradientTo} value={style.to} onChange={set('to')} />
        </div>
        <Slider label={s.css.angle} value={style.angle} min={0} max={360} step={5} unit="°" onChange={set('angle')} />
        <Slider label={s.css.radius} value={style.radius} min={0} max={48} unit="px" onChange={set('radius')} />
        <Slider label={s.css.padding} value={style.padding} min={8} max={56} unit="px" onChange={set('padding')} />
        <Slider label={s.css.gap} value={style.gap} min={0} max={48} unit="px" onChange={set('gap')} />
        <Slider label={s.css.columns} value={style.columns} min={1} max={4} onChange={set('columns')} />
        <Slider label={s.css.shadow} value={style.shadow} min={0} max={100} unit="%" onChange={set('shadow')} />
        <Slider
          label={s.css.speed}
          value={style.speed}
          min={0}
          max={10}
          onChange={set('speed')}
          format={(v) => (v === 0 ? s.css.off : `${v}s`)}
        />
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => setStyle(DEFAULTS)}>
          <RotateCcw aria-hidden /> {s.reset}
        </button>
      </div>

      <div className="lab-exp__output">
        <p className="lab-exp__label mono">{s.preview}</p>
        <div className="lab-css-preview">
          <style>{css}</style>
          <div className="playground">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="playground__card">
                <span className="mono">
                  {s.card} {String(i + 1).padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        </div>
        {reduced && style.speed > 0 && <p className="lab-note">{s.css.reducedNote}</p>}

        <div className="lab-code">
          <div className="lab-code__bar">
            <p className="lab-exp__label mono">{s.generated}</p>
            <button type="button" className="btn btn--primary btn--sm" onClick={copy}>
              <Copy aria-hidden /> {s.copyCss}
            </button>
          </div>
          <pre tabIndex={0} aria-label={s.generated}>
            <code>{css}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
