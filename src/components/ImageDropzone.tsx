import { useEffect, useId, useRef, useState, type DragEvent } from 'react';
import { ACCEPTED_IMAGE_TYPES } from '../config';
import { formatBytes } from '../utils/format';
import { validateImageFile } from '../utils/validation';
import Icon from './Icon';
import './ImageDropzone.css';

interface Props {
  label: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  /** Shows an "(optional)" note next to the label. Slots are required unless this is set. */
  optional?: boolean;
}

const ACCEPT = ACCEPTED_IMAGE_TYPES.join(',');

/** Drag-and-drop or click-to-browse photo slot with preview, validation and remove. */
export default function ImageDropzone({ label, file, onFileChange, optional = false }: Props) {
  const inputId = useId();
  const errorId = useId();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function acceptFiles(files: FileList | null) {
    const picked = files?.[0];
    if (!picked) return;
    const problem = validateImageFile(picked, label);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    onFileChange(picked);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (!file) acceptFiles(event.dataTransfer.files);
  }

  function handleRemove() {
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
    onFileChange(null);
  }

  const describedBy = error ? errorId : undefined;

  return (
    <div className="dropzone-field">
      <span className="field-label" id={`${inputId}-label`}>
        {label}
        {optional && <span className="muted"> (optional)</span>}
      </span>

      {file && previewUrl ? (
        <div className="dropzone is-filled">
          <img className="dropzone-preview" src={previewUrl} alt={`Preview of ${label}: ${file.name}`} />
          <div className="dropzone-meta">
            <p className="dropzone-filename" title={file.name}>
              {file.name}
            </p>
            <p className="muted dropzone-size">{formatBytes(file.size)}</p>
            <button type="button" className="button button-ghost" onClick={handleRemove} aria-label={`Remove ${label}`}>
              <Icon name="trash" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`dropzone${isDragging ? ' is-dragging' : ''}${error ? ' has-error' : ''}`}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <label htmlFor={inputId} className="dropzone-body">
            <Icon name="upload" className="dropzone-icon" />
            <span className="dropzone-title">Drop a photo here or click to browse</span>
            <span className="muted dropzone-hint">JPEG, PNG or WebP, up to 10 MB</span>
          </label>
        </div>
      )}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPT}
        className="visually-hidden"
        aria-labelledby={`${inputId}-label`}
        aria-describedby={describedBy}
        onChange={(event) => {
          acceptFiles(event.target.files);
          // Allow picking the same file again after a remove.
          event.target.value = '';
        }}
        disabled={Boolean(file)}
      />

      {error && (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
