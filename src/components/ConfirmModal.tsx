import { useEffect, useId, useRef, type ReactNode } from 'react';
import Icon from './Icon';
import './ConfirmModal.css';

interface Props {
  open: boolean;
  title: string;
  tone: 'primary' | 'danger';
  confirmLabel: string;
  busy: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children: ReactNode;
}

/** Confirmation dialog for irreversible decisions. Escape or the Cancel button closes it unless a request is in flight. */
export default function ConfirmModal({ open, title, tone, confirmLabel, busy, onConfirm, onCancel, children }: Props) {
  const titleId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Move focus into the dialog once when it opens.
  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  const onCancelRef = useRef(onCancel);
  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    if (!open) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape' && !busy) onCancelRef.current();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, busy]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={() => !busy && onCancel()}>
      <div
        className="modal card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-busy={busy}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={`modal-icon modal-icon-${tone}`} aria-hidden="true">
          <Icon name={tone === 'danger' ? 'cross' : 'check'} />
        </div>
        <h2 id={titleId}>{title}</h2>
        <div className="modal-body">{children}</div>

        <div className="modal-actions">
          <button ref={cancelRef} type="button" className="button button-secondary" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button
            type="button"
            className={`button ${tone === 'danger' ? 'button-danger-solid' : 'button-primary'}`}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy && <span className="spinner" aria-hidden="true" />}
            {busy ? 'Saving...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
