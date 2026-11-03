import { useCallback, useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { autocomplete, runCommand, type TerminalActions } from './commands';
import './terminal.css';

interface Line {
  id: number;
  kind: 'input' | 'output' | 'error' | 'system' | 'welcome1' | 'welcome2';
  content: ReactNode;
}

const QUICK_COMMANDS = ['help', 'about', 'skills', 'projects', 'contact'];

// Welcome lines are rendered from the active language at display time.
const WELCOME: Line[] = [
  { id: 0, kind: 'welcome1', content: null },
  { id: 1, kind: 'welcome2', content: null },
];

/** A real command interpreter over the portfolio data — not a typing animation. */
export function Terminal({ actions }: { actions: TerminalActions }) {
  const { t, content, lang } = useI18n();
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const nextId = useRef(WELCOME.length);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputId = useId();

  // Keep the newest output in view by scrolling the terminal itself, never the page.
  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [lines]);

  const execute = useCallback(
    (raw: string) => {
      const command = raw.trim();
      const id = () => nextId.current++;
      if (!command) {
        setLines((l) => [...l, { id: id(), kind: 'input', content: '' }]);
        return;
      }
      const result = runCommand(command, { actions, history, t, content, lang });
      setHistory((h) => [...h, command].slice(-50));
      setCursor(null);
      if (result.clear) {
        setLines([]);
        return;
      }
      setLines((l) => {
        const next: Line[] = [...l, { id: id(), kind: 'input', content: command }];
        if (result.output !== undefined) next.push({ id: id(), kind: result.error ? 'error' : 'output', content: result.output });
        return next.slice(-80);
      });
    },
    [actions, history, t, content, lang],
  );

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    execute(value);
    setValue('');
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp' && history.length) {
      event.preventDefault();
      const next = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setValue(history[next]);
    } else if (event.key === 'ArrowDown' && cursor !== null) {
      event.preventDefault();
      const next = cursor + 1;
      if (next >= history.length) {
        setCursor(null);
        setValue('');
      } else {
        setCursor(next);
        setValue(history[next]);
      }
    } else if (event.key === 'Tab') {
      const completion = autocomplete(value, content);
      if (completion) {
        event.preventDefault();
        setValue(completion + (completion.includes(' ') ? '' : ' '));
      }
    } else if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault();
      setLines([]);
    }
  };

  return (
    <div className="terminal glow-card">
      <div className="terminal__bar">
        <span className="terminal__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="terminal__title mono">wave@portfolio: ~</span>
        <span className="terminal__tag mono">zsh</span>
      </div>

      <div
        ref={bodyRef}
        className="terminal__body mono"
        onClick={() => {
          if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true });
        }}
      >
        <div role="log" aria-live="polite" aria-label={t.terminal.output}>
          {lines.map((line) => (
            <div key={line.id} className={`term-line term-line--${line.kind === 'welcome1' || line.kind === 'welcome2' ? 'system' : line.kind}`}>
              {line.kind === 'welcome1' ? (
                t.terminal.welcome1
              ) : line.kind === 'welcome2' ? (
                t.terminal.welcome2
              ) : line.kind === 'input' ? (
                <>
                  <span className="term-prompt" aria-hidden="true">
                    ❯
                  </span>
                  <span>{line.content}</span>
                </>
              ) : (
                line.content
              )}
            </div>
          ))}
        </div>

        <form className="term-input" onSubmit={onSubmit}>
          <label htmlFor={inputId} className="term-prompt">
            <span aria-hidden="true">❯</span>
            <span className="sr-only">{t.terminal.inputLabel}</span>
          </label>
          <input
            ref={inputRef}
            id={inputId}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="send"
            placeholder={t.terminal.placeholder}
          />
        </form>
      </div>

      <div className="terminal__quick" aria-label={t.terminal.quick}>
        {QUICK_COMMANDS.map((cmd) => (
          <button key={cmd} type="button" className="terminal__chip mono" onClick={() => execute(cmd)}>
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
