import type { Overall } from '../types';
import { RECOMMENDATION_STYLES, RISK_STYLES } from '../utils/verdictStyles';
import Icon from './Icon';
import VerdictChip from './VerdictChip';
import './RiskBanner.css';

interface Props {
  overall: Overall;
}

export default function RiskBanner({ overall }: Props) {
  const risk = RISK_STYLES[overall.risk_level];
  const recommendation = RECOMMENDATION_STYLES[overall.recommendation];
  const score = Math.round(Math.min(100, Math.max(0, overall.risk_score)));

  return (
    <section className={`card risk-banner sev-${risk.severity}`} aria-labelledby="risk-heading">
      <div className="risk-top">
        <div className="stack risk-level">
          <p className="eyebrow" id="risk-heading">
            Overall risk
          </p>
          <div>
            <VerdictChip verdict={risk} large />
          </div>
        </div>

        <div className="risk-score-block">
          <p className="eyebrow">Risk score</p>
          <p className="risk-score">
            <span className="risk-score-value">{score}</span>
            <span className="muted">/100</span>
          </p>
        </div>
      </div>

      <div
        className="risk-gauge"
        role="meter"
        aria-label="Risk score"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={score}
        aria-valuetext={`${score} out of 100`}
      >
        <div className="risk-gauge-fill" style={{ width: `${score}%` }} />
      </div>
      <div className="risk-scale" aria-hidden="true">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>

      <div className="risk-recommendation">
        <span className="muted">Suggested:</span>
        <span className={`chip sev-${recommendation.severity}`}>
          <Icon name={recommendation.icon} />
          <span>{recommendation.label}</span>
        </span>
        <span className="muted risk-advisory">Advisory only</span>
      </div>

      <p className="risk-brief">{overall.brief}</p>
    </section>
  );
}
