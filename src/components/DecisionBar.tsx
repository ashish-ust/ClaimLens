import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { submitDecision } from '../api/client';
import type { DecisionResponse, DecisionValue } from '../types';
import { describeError } from '../utils/errors';
import ConfirmModal from './ConfirmModal';
import Icon from './Icon';
import './DecisionBar.css';

interface Props {
  analysisId: string;
  onDecided: (response: DecisionResponse) => void;
}

const MAX_NOTE_LENGTH = 1000;

/** Sticky bar at the bottom of the review page: reviewer note plus approve / reject actions. */
export default function DecisionBar({ analysisId, onDecided }: Props) {
  const noteId = useId();
  const [note, setNote] = useState('');
  const [pendingDecision, setPendingDecision] = useState<DecisionValue | null>(null);
  const [confirming, setConfirming] = useState<DecisionValue | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isSubmitting = pendingDecision !== null;

  async function handleConfirm() {
    if (!confirming) return;
    const decision = confirming;
    setPendingDecision(decision);
    setError(null);
    try {
      const response = await submitDecision(analysisId, decision, note.trim() || null);
      setConfirming(null);
      setPendingDecision(null);
      onDecided(response);
    } catch (err) {
      setConfirming(null);
      setPendingDecision(null);
      const info = describeError(err);
      setError(`${info.title}: ${info.message}`);
    }
  }

  return (
    <div className="decision-dock">
      <div className="container decision-inner">
        <div className="decision-note">
          <label htmlFor={noteId} className="field-label">
            Reviewer note <span className="muted">(optional)</span>
          </label>
          <input
            id={noteId}
            type="text"
            className="text-input"
            maxLength={MAX_NOTE_LENGTH}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Add context for the audit trail"
            disabled={isSubmitting}
          />
        </div>

        <div className="decision-actions">
          <button
            type="button"
            className="button button-primary"
            onClick={() => setConfirming('APPROVED')}
            disabled={isSubmitting}
          >
            <Icon name="check" />
            Approve claim
          </button>
          <button
            type="button"
            className="button button-danger"
            onClick={() => setConfirming('REJECTED')}
            disabled={isSubmitting}
          >
            <Icon name="cross" />
            Reject claim
          </button>
        </div>

        {error && (
          <p className="decision-error" role="alert">
            <Icon name="alert" /> {error}
          </p>
        )}
      </div>

      <ConfirmModal
        open={confirming === 'APPROVED'}
        title="Approve and save this claim?"
        tone="primary"
        confirmLabel="Approve claim"
        busy={isSubmitting}
        onConfirm={handleConfirm}
        onCancel={() => setConfirming(null)}
      >
        <p>The claim will be saved to the approved claims list with a new claim ID.</p>
      </ConfirmModal>

      <ConfirmModal
        open={confirming === 'REJECTED'}
        title="Reject this claim?"
        tone="danger"
        confirmLabel="Reject claim"
        busy={isSubmitting}
        onConfirm={handleConfirm}
        onCancel={() => setConfirming(null)}
      >
        <p>The claim will be marked as rejected. It will not appear in the approved claims list.</p>
      </ConfirmModal>
    </div>
  );
}

interface DecisionResultProps {
  outcome: DecisionValue;
  claimId: string | null;
  /** True when the analysis was already decided before this page was opened. */
  alreadyDecided: boolean;
  message?: string;
}

/** Replaces the decision bar once a claim has been approved or rejected. */
export function DecisionResult({ outcome, claimId, alreadyDecided, message }: DecisionResultProps) {
  const isApproved = outcome === 'APPROVED';
  let text: string;
  if (isApproved) {
    if (claimId) {
      text = alreadyDecided ? `Claim approved - ID ${claimId}` : `Claim approved and saved - ID ${claimId}`;
    } else {
      text = alreadyDecided ? 'This claim was already approved.' : 'Claim approved and saved.';
    }
  } else {
    text = alreadyDecided ? 'This claim was already rejected.' : 'Claim rejected';
  }

  return (
    <div className="decision-dock">
      <div className="container decision-inner decision-result-row">
        <div className={`decision-result sev-${isApproved ? 'ok' : 'high'}`} role="status">
          <span className="decision-result-icon" aria-hidden="true">
            <Icon name={isApproved ? 'check' : 'cross'} />
          </span>
          <div>
            <p className="decision-result-title">{text}</p>
            {message && !alreadyDecided && <p className="muted decision-result-message">{message}</p>}
          </div>
        </div>
        <Link to="/" className="button button-primary">
          Review another claim
          <Icon name="arrow-right" />
        </Link>
      </div>
    </div>
  );
}
