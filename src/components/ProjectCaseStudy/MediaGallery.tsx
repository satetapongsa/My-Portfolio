import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ProjectImage } from '../../data/types';
import { Dialog } from '../ui/Dialog';

export interface GalleryLabels {
  open: string;
  close: string;
  previous: string;
  next: string;
  counter: string; // "{n} / {total}"
}

type Shot = ProjectImage & { caption: string; alt?: string };

/**
 * Screenshot grid (720 px WebP thumbnails, lazy) with a full-screen viewer
 * that loads the 1440 px image only when opened. Arrow keys page through.
 */
export function MediaGallery({ shots, labels, title }: { shots: Shot[]; labels: GalleryLabels; title: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;
  const current = index !== null ? shots[index] : null;

  useEffect(() => {
    if (!open || shots.length < 2) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setIndex((i) => (i === null ? i : (i + 1) % shots.length));
      if (e.key === 'ArrowLeft') setIndex((i) => (i === null ? i : (i - 1 + shots.length) % shots.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, shots.length]);

  return (
    <>
      <ul className={`gallery ${shots.length === 1 ? 'gallery--single' : ''}`}>
        {shots.map((shot, i) => (
          <li key={shot.src}>
            <figure className="gallery__item">
              <button type="button" className="gallery__btn" onClick={() => setIndex(i)} aria-label={`${labels.open}: ${shot.caption}`}>
                <img
                  src={shot.thumb}
                  srcSet={`${shot.thumb} 720w, ${shot.src} 1440w`}
                  sizes="(max-width: 700px) 100vw, 600px"
                  alt={shot.alt ?? shot.caption}
                  width={shot.width}
                  height={shot.height}
                  loading="lazy"
                  decoding="async"
                />
                <span className="gallery__zoom" aria-hidden="true">
                  <Maximize2 />
                </span>
              </button>
              <figcaption className="gallery__caption">{shot.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <Dialog open={open} onClose={() => setIndex(null)} labelledBy="lightbox-caption" panelClassName="lightbox">
        {current && index !== null && (
          <>
            <div className="lightbox__bar">
              <p className="lightbox__count mono" aria-live="polite">
                {title} · {labels.counter.replace('{n}', String(index + 1)).replace('{total}', String(shots.length))}
              </p>
              <button type="button" className="icon-btn" onClick={() => setIndex(null)} aria-label={labels.close}>
                <X aria-hidden />
              </button>
            </div>
            <figure className="lightbox__figure">
              <img src={current.src} alt={current.alt ?? current.caption} width={current.width} height={current.height} decoding="async" />
              <figcaption id="lightbox-caption" className="lightbox__caption">
                {current.caption}
              </figcaption>
            </figure>
            {shots.length > 1 && (
              <div className="lightbox__nav">
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setIndex((index - 1 + shots.length) % shots.length)}>
                  <ChevronLeft aria-hidden /> {labels.previous}
                </button>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setIndex((index + 1) % shots.length)}>
                  {labels.next} <ChevronRight aria-hidden />
                </button>
              </div>
            )}
          </>
        )}
      </Dialog>
    </>
  );
}
