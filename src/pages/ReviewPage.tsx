import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ApiError, getAnalysis, resolveAssetUrl } from '../api/client';
import AiDetails from '../components/AiDetails';
import ConsistencyDetails from '../components/ConsistencyDetails';
import DecisionBar, { DecisionResult } from '../components/DecisionBar';
import DuplicateDetails from '../components/DuplicateDetails';
import ErrorState from '../components/ErrorState';
import FindingCard from '../components/FindingCard';
import Icon from '../components/Icon';
import ImageLightbox from '../components/ImageLightbox';
import RiskBanner from '../components/RiskBanner';
import { PageSkeleton } from '../components/Skeleton';
import type { AnalysisResult, DecisionResponse, DecisionValue } from '../types';
import { formatDateTime } from '../utils/format';
import { photoLabel } from '../utils/images';
import { describeError, type ErrorInfo } from '../utils/errors';
import {
  AI_STYLES,
  CONSISTENCY_STYLES,
  DUPLICATE_STYLES,
} from '../utils/verdictStyles';
import './ReviewPage.css';

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; info: ErrorInfo; notFound: boolean }
  | { status: 'ready'; analysis: AnalysisResult };

interface ZoomedImage {
  src: string;
  alt: string;
}

export default function ReviewPage() {
  const { analysisId = '' } = useParams();
  const [load, setLoad] = useState<LoadState>({ status: 'loading' });
  const [reloadKey, setReloadKey] = useState(0);
  const [decision, setDecision] = useState<DecisionResponse | null>(null);
  const [zoomed, setZoomed] = useState<ZoomedImage | null>(null);

  const openImage = useCallback((src: string, alt: string) => setZoomed({ src, alt }), []);
  const closeImage = useCallback(() => setZoomed(null), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoad({ status: 'loading' });
    setDecision(null);

    getAnalysis(analysisId, controller.signal)
      .then((analysis) => setLoad({ status: 'ready', analysis }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        const notFound = err instanceof ApiError && err.status === 404;
        setLoad({ status: 'error', info: describeError(err), notFound });
      });

    return () => controller.abort();
  }, [analysisId, reloadKey]);

  if (load.status === 'loading') {
    return (
      <div className="container page">
        <PageSkeleton label="Loading claim analysis" cards={3} />
      </div>
    );
  }

  if (load.status === 'error') {
    return (
      <div className="container page">
        <ErrorState info={load.info} onRetry={load.notFound ? undefined : () => setReloadKey((k) => k + 1)}>
          <Link to="/" className="button button-secondary">
            Start a new claim
          </Link>
        </ErrorState>
      </div>
    );
  }

  const { analysis } = load;
  const { duplicate, ai_generated: ai, consistency } = analysis.detectors;
  const alreadyDecided = analysis.status !== 'PENDING_DECISION' && decision === null;
  const outcome: DecisionValue | null =
    decision?.decision ?? (analysis.status === 'PENDING_DECISION' ? null : analysis.status);

  return (
    <div className="review-page">
      <div className="container page">
        <header className="review-header">
          <p className="eyebrow">Claim review</p>
          <h1>Review claim</h1>
          <p className="muted review-meta">
            Analysis <code>{analysis.analysis_id}</code> · Submitted {formatDateTime(analysis.created_at)}
          </p>
        </header>

        <RiskBanner overall={analysis.overall} />

        <section className="section" aria-labelledby="evidence-heading">
          <h2 id="evidence-heading">Claim evidence</h2>
          <div className="evidence-grid">
            <div className="photo-row">
              {analysis.images.map((image, position) => {
                const src = resolveAssetUrl(image.url);
                const label = photoLabel(analysis.images, image.index);
                const alt = `${label}: ${image.filename}`;
                return (
                  <figure className="photo-figure" key={`${image.index}-${position}`}>
                    <button
                      type="button"
                      className="photo-button"
                      onClick={() => openImage(src, alt)}
                      aria-label={`Enlarge ${label}`}
                    >
                      <img src={src} alt={alt} loading="lazy" />
                      <span className="photo-hint">
                        <Icon name="zoom-in" /> Click to enlarge
                      </span>
                    </button>
                    <figcaption>
                      <strong>{label}</strong> <span className="muted">{image.filename}</span>
                    </figcaption>
                  </figure>
                );
              })}
            </div>

            <figure className="narrative-card">
              <figcaption className="narrative-label">Narrative as submitted</figcaption>
              <blockquote>
                <p>{analysis.narrative}</p>
              </blockquote>
            </figure>
          </div>
        </section>

        <section className="section" aria-labelledby="findings-heading">
          <h2 id="findings-heading">Findings</h2>
          <div className="findings-grid">
            <FindingCard
              id="duplicate"
              title="Duplicate check"
              verdict={DUPLICATE_STYLES[duplicate.verdict]}
              confidence={duplicate.confidence}
              summary={duplicate.summary}
            >
              <DuplicateDetails duplicate={duplicate} images={analysis.images} onOpenImage={openImage} />
            </FindingCard>

            <FindingCard
              id="ai-generated"
              title="AI-generated photo check"
              verdict={AI_STYLES[ai.verdict]}
              confidence={ai.confidence}
              summary={ai.summary}
            >
              <AiDetails ai={ai} images={analysis.images} />
            </FindingCard>

            <FindingCard
              id="consistency"
              title="Narrative consistency"
              verdict={CONSISTENCY_STYLES[consistency.verdict]}
              confidence={consistency.confidence}
              summary={consistency.summary}
            >
              <ConsistencyDetails consistency={consistency} />
            </FindingCard>
          </div>
        </section>

        <section className="section" aria-labelledby="followup-heading">
          <h2 id="followup-heading">Suggested follow-up questions</h2>
          {analysis.overall.follow_up_questions.length > 0 ? (
            <ol className="card follow-up-list">
              {analysis.overall.follow_up_questions.map((question, index) => (
                <li key={`${index}-${question}`}>{question}</li>
              ))}
            </ol>
          ) : (
            <p className="muted">No follow-up questions were suggested.</p>
          )}
        </section>

        <footer className="page-disclaimer">
          <p>ClaimLens findings are advisory and probabilistic. The final decision rests with the reviewer.</p>
        </footer>
      </div>

      {outcome ? (
        <DecisionResult
          outcome={outcome}
          claimId={decision?.claim_id ?? null}
          alreadyDecided={alreadyDecided}
          message={decision?.message}
        />
      ) : (
        <DecisionBar analysisId={analysis.analysis_id} onDecided={setDecision} />
      )}

      {zoomed && <ImageLightbox src={zoomed.src} alt={zoomed.alt} onClose={closeImage} />}
    </div>
  );
}
