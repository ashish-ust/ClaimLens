import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAnalysis } from '../api/client';
import Icon from '../components/Icon';
import ImageDropzone from '../components/ImageDropzone';
import ProgressSteps from '../components/ProgressSteps';
import { NARRATIVE_MAX_LENGTH, NARRATIVE_MIN_LENGTH } from '../config';
import { describeError, type ErrorInfo } from '../utils/errors';
import { isNarrativeValid, narrativeLengthError } from '../utils/validation';
import './UploadPage.css';

/** Short pause so the user sees all steps ticked before the review page opens. */
const SUCCESS_PAUSE_MS = 600;

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export default function UploadPage() {
  const navigate = useNavigate();
  const [photo1, setPhoto1] = useState<File | null>(null);
  const [photo2, setPhoto2] = useState<File | null>(null);
  const [narrative, setNarrative] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<ErrorInfo | null>(null);

  const narrativeError = narrativeLengthError(narrative);
  const canSubmit = photo1 !== null && photo2 !== null && isNarrativeValid(narrative);

  async function submit() {
    if (!photo1 || !photo2 || !isNarrativeValid(narrative)) return;
    setIsSubmitting(true);
    setIsDone(false);
    setError(null);
    try {
      const result = await createAnalysis(photo1, photo2, narrative.trim());
      setIsDone(true);
      await wait(SUCCESS_PAUSE_MS);
      navigate(`/review/${encodeURIComponent(result.analysis_id)}`);
    } catch (err) {
      // Keep the user's photos and narrative so they can retry without re-entering anything.
      setIsSubmitting(false);
      setIsDone(false);
      setError(describeError(err));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSubmit) void submit();
  }

  return (
    <div className="container page">
      <section className="upload-hero">
        <p className="eyebrow">New claim</p>
        <h1>See through every claim.</h1>
        <p className="lead muted">
          Upload two photos and describe what happened. ClaimLens checks for duplicate images, signs of AI generation,
          and whether the narrative matches the photos. A reviewer makes the final call.
        </p>
      </section>

      <div className="card upload-card">
        {isSubmitting ? (
          <ProgressSteps done={isDone} />
        ) : (
          <form onSubmit={handleSubmit} noValidate className="upload-form">
            <div className="photo-grid">
              <ImageDropzone label="Photo 1" file={photo1} onFileChange={setPhoto1} />
              <ImageDropzone label="Photo 2" file={photo2} onFileChange={setPhoto2} />
            </div>

            <div className="narrative-field">
              <label htmlFor="narrative" className="field-label">
                Describe what happened
              </label>
              <textarea
                id="narrative"
                className="text-area"
                value={narrative}
                maxLength={NARRATIVE_MAX_LENGTH}
                onChange={(event) => setNarrative(event.target.value)}
                aria-invalid={narrativeError !== null}
                aria-describedby="narrative-hint narrative-count"
                placeholder="When and where did it happen? What do the photos show?"
              />
              <div className="narrative-meta">
                <p id="narrative-hint" className={narrativeError ? 'field-error' : 'field-hint'}>
                  {narrativeError ?? `At least ${NARRATIVE_MIN_LENGTH} characters. Include when and where it happened.`}
                </p>
                <p id="narrative-count" className="counter">
                  {narrative.length} / {NARRATIVE_MAX_LENGTH}
                </p>
              </div>
            </div>

            {error && (
              <div className="alert" role="alert">
                <Icon name="alert" />
                <div className="alert-body">
                  <p className="alert-title">{error.title}</p>
                  <p>{error.message}</p>
                  <button type="button" className="button button-secondary retry-button" onClick={() => void submit()}>
                    <Icon name="refresh" />
                    Retry
                  </button>
                </div>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="button button-primary" disabled={!canSubmit}>
                Analyze claim
                <Icon name="arrow-right" />
              </button>
              {!canSubmit && (
                <p className="field-hint">Add both photos and a description of at least {NARRATIVE_MIN_LENGTH} characters to continue.</p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
