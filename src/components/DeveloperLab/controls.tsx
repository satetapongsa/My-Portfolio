import { useId } from 'react';

/** Labelled range input showing its current value. */
export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  format?: (value: number) => string;
}) {
  const id = useId();
  const shown = format ? format(value) : `${value}${unit}`;
  return (
    <div className="lab-field">
      <div className="lab-field__row">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id} className="mono">
          {shown}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={shown}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ['--fill' as string]: `${((value - min) / (max - min)) * 100}%` }}
      />
    </div>
  );
}

/** Native colour picker with the hex value beside it. */
export function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const id = useId();
  return (
    <div className="lab-field lab-field--color">
      <label htmlFor={id}>{label}</label>
      <span className="lab-color">
        <input id={id} type="color" value={value} onChange={(e) => onChange(e.target.value)} />
        <span className="mono">{value}</span>
      </span>
    </div>
  );
}

/** Single-choice button group (radio semantics). */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  const id = useId();
  return (
    <div className="lab-field">
      <span id={id} className="lab-field__label">
        {label}
      </span>
      <div className="lab-seg" role="radiogroup" aria-labelledby={id}>
        {options.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={value === o.value} className={value === o.value ? 'is-active' : ''} onClick={() => onChange(o.value)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** On/off switch. */
export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="lab-toggle">
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="lab-toggle__track" aria-hidden="true" />
      <span>{label}</span>
    </label>
  );
}
