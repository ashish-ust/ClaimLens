import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listApprovedClaims, resolveAssetUrl } from '../api/client';
import ErrorState from '../components/ErrorState';
import Icon from '../components/Icon';
import VerdictChip from '../components/VerdictChip';
import { PageSkeleton } from '../components/Skeleton';
import type { ApprovedClaim } from '../types';
import { describeError, type ErrorInfo } from '../utils/errors';
import { excerpt, formatDateTime } from '../utils/format';
import { RISK_STYLES, UNAVAILABLE_STYLE } from '../utils/verdictStyles';
import './ClaimsPage.css';

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; info: ErrorInfo }
  | { status: 'ready'; claims: ApprovedClaim[] };

export default function ClaimsPage() {
  const [load, setLoad] = useState<LoadState>({ status: 'loading' });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoad({ status: 'loading' });

    listApprovedClaims(controller.signal)
      .then((claims) => setLoad({ status: 'ready', claims }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setLoad({ status: 'error', info: describeError(err) });
      });

    return () => controller.abort();
  }, [reloadKey]);

  return (
    <div className="container page">
      <header className="claims-header">
        <p className="eyebrow">Approved claims</p>
        <h1>Approved claims</h1>
        <p className="muted">Claims a reviewer has approved and saved.</p>
      </header>

      {load.status === 'loading' && <PageSkeleton label="Loading approved claims" cards={3} />}

      {load.status === 'error' && (
        <ErrorState info={load.info} onRetry={() => setReloadKey((k) => k + 1)} />
      )}

      {load.status === 'ready' && load.claims.length === 0 && (
        <div className="card empty-state">
          <Icon name="document" className="empty-icon" />
          <h2>No approved claims yet</h2>
          <p>Claims appear here after a reviewer approves them.</p>
          <Link to="/" className="button button-primary">
            Start a new claim
          </Link>
        </div>
      )}

      {load.status === 'ready' && load.claims.length > 0 && (
        <ul className="claims-grid list-plain">
          {load.claims.map((claim) => (
            <li key={claim.claim_id}>
              <ClaimCard claim={claim} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ClaimCard({ claim }: { claim: ApprovedClaim }) {
  const risk = RISK_STYLES[claim.risk_level] ?? UNAVAILABLE_STYLE;
  return (
    <article className="card claim-card">
      <header className="claim-card-head">
        <div className="claim-card-id">
          <h2 className="claim-id">Claim {claim.claim_id}</h2>
          <time className="muted claim-date" dateTime={claim.created_at}>
            {formatDateTime(claim.created_at)}
          </time>
        </div>
        <VerdictChip verdict={risk} />
      </header>

      <p className="claim-excerpt">{excerpt(claim.narrative, 180)}</p>

      {claim.images.length > 0 && (
        <ul className="thumb-row list-plain" aria-label="Claim photos">
          {claim.images.map((image, position) => (
            <li key={`${image.index}-${position}`}>
              <img
                className="thumb"
                src={resolveAssetUrl(image.url)}
                alt={`Photo ${position + 1} for claim ${claim.claim_id}`}
                loading="lazy"
                width={72}
                height={72}
              />
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
