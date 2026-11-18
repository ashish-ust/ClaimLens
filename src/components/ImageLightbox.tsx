import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon';
import './ImageLightbox.css';

const ZOOM_LEVELS = [1, 1.5, 2, 3] as const;

interface Props {
  src: string;
  alt: string;
  onClose: () => void;
}

/** Full-screen image viewer with zoom controls. Closes on Escape or backdrop click. */
export default function ImageLightbox({ src, alt, onClose }: Props) {
  const [zoomIndex, setZoomIndex] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const zoom = ZOOM_LEVELS[zoomIndex];

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Focus the close button on open, restore focus on close, handle keys.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onCloseRef.current();
      if (event.key === '+' || event.key === '=') setZoomIndex((i) => Math.min(i + 1, ZOOM_LEVELS.length - 1));
      if (event.key === '-') setZoomIndex((i) => Math.max(i - 1, 0));
    }

    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      previouslyFocused?.focus();
    };
  }, []);

  return createPortal(
    <div className="lightbox-backdrop" onClick={onClose}>
      <div
        className="lightbox"
        role="dialog"
        aria-modal="true"
        aria-label={`Enlarged view: ${alt}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="lightbox-toolbar">
          <span className="lightbox-title">{alt}</span>
          <div className="lightbox-controls">
            <button
              type="button"
              className="button button-secondary lightbox-button"
              onClick={() => setZoomIndex((i) => Math.max(i - 1, 0))}
              disabled={zoomIndex === 0}
              aria-label="Zoom out"
            >
              <Icon name="zoom-out" />
            </button>
            <span className="lightbox-zoom" aria-live="polite">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              className="button button-secondary lightbox-button"
              onClick={() => setZoomIndex((i) => Math.min(i + 1, ZOOM_LEVELS.length - 1))}
              disabled={zoomIndex === ZOOM_LEVELS.length - 1}
              aria-label="Zoom in"
            >
              <Icon name="zoom-in" />
            </button>
            <button
              ref={closeRef}
              type="button"
              className="button button-primary lightbox-button"
              onClick={onClose}
              aria-label="Close enlarged view"
            >
              <Icon name="close" />
            </button>
          </div>
        </div>

        <div className="lightbox-stage">
          <img
            src={src}
            alt={alt}
            className="lightbox-image"
            style={{ width: zoom === 1 ? '100%' : `${zoom * 100}%` }}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
