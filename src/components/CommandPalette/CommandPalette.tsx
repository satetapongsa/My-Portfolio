import { ArrowRight, Copy, CornerDownLeft, FileDown, FileText, FolderGit2, Hash, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { navItems, profile } from '../../data/portfolio';
import { projects } from '../../data/projects';
import { copyText, getSocial, hasEmail, hasResume, openExternal, scrollToSection } from '../../utils/links';
import { GitHubIcon, LinkedInIcon, TikTokIcon } from '../ui/BrandIcons';
import { Dialog } from '../ui/Dialog';
import { useToast } from '../ui/Toast';
import './command-palette.css';

interface PaletteItem {
  id: string;
  group: 'Navigate' | 'Actions' | 'Projects';
  label: string;
  hint?: string;
  keywords: string;
  icon: ReactNode;
  run: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onOpenProject: (id: string) => void;
}

export function CommandPalette({ open, onClose, onOpenProject }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const notify = useToast();

  /** Only actions with a real, configured destination are offered. */
  const items = useMemo<PaletteItem[]>(() => {
    const list: PaletteItem[] = navItems.map((n, i) => ({
      id: `nav-${n.id}`,
      group: 'Navigate',
      label: n.label,
      hint: `#${n.id}`,
      keywords: `${n.id} go section ${String(i + 1)}`,
      icon: <Hash aria-hidden />,
      run: () => scrollToSection(n.id),
    }));

    if (hasEmail()) {
      list.push({
        id: 'copy-email',
        group: 'Actions',
        label: 'Copy Email',
        hint: profile.contact.email,
        keywords: 'mail contact clipboard',
        icon: <Copy aria-hidden />,
        run: () => {
          void copyText(profile.contact.email).then((ok) =>
            notify(ok ? 'Email copied to clipboard' : 'Couldn’t copy the email', ok ? 'success' : 'error'),
          );
        },
      });
    }
    const github = getSocial('github');
    if (github) {
      list.push({ id: 'github', group: 'Actions', label: 'Open GitHub', hint: 'new tab', keywords: 'code repo source', icon: <GitHubIcon />, run: () => openExternal(github.url) });
    }
    const linkedin = getSocial('linkedin');
    if (linkedin) {
      list.push({ id: 'linkedin', group: 'Actions', label: 'Open LinkedIn', hint: 'new tab', keywords: 'profile network', icon: <LinkedInIcon />, run: () => openExternal(linkedin.url) });
    }
    const tiktok = getSocial('tiktok');
    if (tiktok) {
      list.push({ id: 'tiktok', group: 'Actions', label: 'Open TikTok', hint: 'new tab', keywords: 'social video', icon: <TikTokIcon />, run: () => openExternal(tiktok.url) });
    }
    if (hasResume()) {
      list.push({
        id: 'view-cv',
        group: 'Actions',
        label: 'View CV',
        hint: 'PDF · new tab',
        keywords: 'cv resume pdf open',
        icon: <FileText aria-hidden />,
        run: () => openExternal(profile.resumePath),
      });
      list.push({
        id: 'resume',
        group: 'Actions',
        label: 'Download Résumé',
        hint: 'PDF',
        keywords: 'cv resume pdf',
        icon: <FileDown aria-hidden />,
        run: () => {
          const a = document.createElement('a');
          a.href = profile.resumePath;
          a.download = 'Resume_Satetapong_Sanguansuk.pdf';
          a.click();
        },
      });
    }

    projects.forEach((p) =>
      list.push({
        id: `project-${p.id}`,
        group: 'Projects',
        label: p.title,
        hint: p.code,
        keywords: `${p.categoryLabel} ${p.tech.join(' ')} project`,
        icon: <FolderGit2 aria-hidden />,
        run: () => onOpenProject(p.id),
      }),
    );
    return list;
  }, [notify, onOpenProject]);

  const filtered = useMemo(() => {
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return items;
    return items.filter((item) => {
      const haystack = `${item.label} ${item.keywords} ${item.hint ?? ''} ${item.group}`.toLowerCase();
      return terms.every((t) => haystack.includes(t));
    });
  }, [items, query]);

  // Reset when (re)opened.
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => setActiveIndex(0), [query]);

  // Keep the highlighted option visible inside the list.
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const select = (item: PaletteItem | undefined) => {
    if (!item) return;
    onClose();
    // Act after the dialog has released focus and the scroll lock.
    requestAnimationFrame(() => item.run());
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((i) => (filtered.length ? (i + 1) % filtered.length : 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(Math.max(0, filtered.length - 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      select(filtered[activeIndex]);
    }
  };

  let lastGroup = '';

  return (
    <Dialog open={open} onClose={onClose} labelledBy="palette-label" variant="palette" panelClassName="palette" initialFocus={inputRef}>
      <div className="palette__search">
        <Search aria-hidden />
        <label id="palette-label" htmlFor="palette-input" className="sr-only">
          Search sections and actions
        </label>
        <input
          ref={inputRef}
          id="palette-input"
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-activedescendant={filtered[activeIndex] ? `palette-opt-${filtered[activeIndex].id}` : undefined}
          aria-autocomplete="list"
          placeholder="Search sections, actions, projects…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          spellCheck={false}
        />
        <kbd className="palette__esc">Esc</kbd>
      </div>

      <ul ref={listRef} id="palette-list" role="listbox" aria-label="Results" className="palette__list">
        {filtered.length === 0 && (
          <li className="palette__empty" role="presentation">
            No results for “{query}”.
          </li>
        )}
        {filtered.map((item, index) => {
          const showGroup = item.group !== lastGroup;
          lastGroup = item.group;
          const active = index === activeIndex;
          return (
            <li key={item.id} role="presentation">
              {showGroup && (
                <p className="palette__group mono" aria-hidden="true">
                  {item.group}
                </p>
              )}
              <div
                id={`palette-opt-${item.id}`}
                role="option"
                aria-selected={active}
                data-index={index}
                className={`palette__option ${active ? 'is-active' : ''}`}
                onMouseMove={() => !active && setActiveIndex(index)}
                onClick={() => select(item)}
              >
                <span className="palette__icon">{item.icon}</span>
                <span className="palette__label">{item.label}</span>
                {item.hint && <span className="palette__hint mono">{item.hint}</span>}
                {active ? <CornerDownLeft className="palette__enter" aria-hidden /> : <ArrowRight className="palette__enter palette__enter--idle" aria-hidden />}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="palette__footer mono" aria-hidden="true">
        <span>
          <kbd>↑</kbd>
          <kbd>↓</kbd> navigate
        </span>
        <span>
          <kbd>↵</kbd> select
        </span>
        <span>
          <kbd>esc</kbd> close
        </span>
      </div>
    </Dialog>
  );
}
