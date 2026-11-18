import { toPercent } from '../utils/format';
import './ConfidenceBar.css';

interface Props {
  /** Confidence from 0 to 1. */
  value: number;
  label?: string;
  muted?: boolean;
}

export default function ConfidenceBar({ value, label = 'Confidence', muted = false }: Props) {
  const percent = toPercent(value);
  return (
    <div className={`confidence${muted ? ' is-muted' : ''}`}>
      <div className="confidence-head">
        <span>{label}</span>
        <span className="confidence-value">{percent}%</span>
      </div>
      <div
        className="confidence-track"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={`${percent}%`}
      >
        <div className="confidence-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
