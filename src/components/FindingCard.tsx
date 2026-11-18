import type { ReactNode } from 'react';
import type { VerdictStyle } from '../utils/verdictStyles';
import ConfidenceBar from './ConfidenceBar';
import VerdictChip from './VerdictChip';
import './FindingCard.css';

interface Props {
  /** Unique id prefix used for the heading and accessible names. */
  id: string;
  title: string;
  verdict: VerdictStyle;
  confidence: number;
  summary: string;
  /** Shown inside the expandable Details area. */
  children: ReactNode;
}

export default function FindingCard({ id, title, verdict, confidence, summary, children }: Props) {
  const headingId = `${id}-heading`;
  const isUnavailable = verdict.severity === 'unavailable';

  return (
    <article className={`card finding-card sev-${verdict.severity}`} aria-labelledby={headingId}>
      <h3 id={headingId}>{title}</h3>
      <VerdictChip verdict={verdict} />
      <ConfidenceBar value={confidence} muted={isUnavailable} />
      <p className="finding-summary">{summary}</p>

      <details className="finding-details">
        <summary>
          Details <span className="visually-hidden">for {title}</span>
        </summary>
        <div className="finding-details-body">{children}</div>
      </details>
    </article>
  );
}
