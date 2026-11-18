import type { ReactNode } from 'react';
import type { ErrorInfo } from '../utils/errors';
import Icon from './Icon';

interface Props {
  info: ErrorInfo;
  onRetry?: () => void;
  children?: ReactNode;
}

/** Friendly full-card error with an optional retry action. */
export default function ErrorState({ info, onRetry, children }: Props) {
  return (
    <div className="card error-state" role="alert">
      <Icon name="cross" className="state-icon" />
      <h2>{info.title}</h2>
      <p>{info.message}</p>
      {children}
      {onRetry && (
        <button type="button" className="button button-primary" onClick={onRetry}>
          <Icon name="refresh" />
          Retry
        </button>
      )}
    </div>
  );
}
