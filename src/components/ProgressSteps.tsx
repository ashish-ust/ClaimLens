import { useEffect, useState } from 'react';
import Icon from './Icon';
import './ProgressSteps.css';

export const ANALYSIS_STEPS = [
  'Checking for duplicate images',
  'Checking if photos are AI-generated',
  'Verifying the narrative against the photos',
  'Building the summary',
] as const;

/** Time each step stays active before the next one starts. The last step stays active until the response arrives. */
const STEP_INTERVAL_MS = 6000;

interface Props {
  /** True once the API has responded. All steps are then shown as complete. */
  done: boolean;
}

export default function ProgressSteps({ done }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (done) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => Math.min(index + 1, ANALYSIS_STEPS.length - 1));
    }, STEP_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [done]);

  return (
    <div className="progress-view" aria-busy={!done}>
      <h2>{done ? 'Analysis complete' : 'Analyzing your claim'}</h2>
      <p className="muted">This usually takes 10 to 30 seconds. Please keep this page open.</p>

      <ol className="progress-steps">
        {ANALYSIS_STEPS.map((label, index) => {
          const isComplete = done || index < activeIndex;
          const isCurrent = !done && index === activeIndex;
          const state = isComplete ? 'complete' : isCurrent ? 'current' : 'pending';
          const stateText = isComplete ? 'done' : isCurrent ? 'in progress' : 'waiting';

          return (
            <li key={label} className={`progress-step is-${state}`}>
              <span className="progress-marker" aria-hidden="true">
                {isComplete && <Icon name="check" />}
                {isCurrent && <span className="spinner" />}
              </span>
              <span className="progress-label">
                {label}
                <span className="visually-hidden"> ({stateText})</span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
