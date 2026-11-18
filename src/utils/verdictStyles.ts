import type { IconName } from '../components/Icon';
import type {
  AiVerdict,
  ConsistencyVerdict,
  DuplicateVerdict,
  MatchType,
  Recommendation,
  RiskLevel,
} from '../types';

/** Severity drives colour. Every severity also has an icon and a text label, so colour is never the only signal. */
export type Severity = 'ok' | 'caution' | 'high' | 'unavailable';

export interface VerdictStyle {
  label: string;
  severity: Severity;
  icon: IconName;
}

const SEVERITY_ICON: Record<Severity, IconName> = {
  ok: 'check',
  caution: 'alert',
  high: 'cross',
  unavailable: 'question',
};

function style(label: string, severity: Severity): VerdictStyle {
  return { label, severity, icon: SEVERITY_ICON[severity] };
}

export const UNAVAILABLE_STYLE = style('Unavailable', 'unavailable');

export const DUPLICATE_STYLES: Record<DuplicateVerdict, VerdictStyle> = {
  UNIQUE: style('Unique', 'ok'),
  POSSIBLE_DUPLICATE: style('Possible duplicate', 'caution'),
  DUPLICATE: style('Duplicate', 'high'),
  UNAVAILABLE: UNAVAILABLE_STYLE,
};

export const AI_STYLES: Record<AiVerdict, VerdictStyle> = {
  LIKELY_AUTHENTIC: style('Likely authentic', 'ok'),
  POSSIBLY_EDITED: style('Possibly edited', 'caution'),
  LIKELY_AI_GENERATED: style('Likely AI-generated', 'high'),
  UNAVAILABLE: UNAVAILABLE_STYLE,
};

export const CONSISTENCY_STYLES: Record<ConsistencyVerdict, VerdictStyle> = {
  CONSISTENT: style('Consistent', 'ok'),
  PARTIALLY_CONSISTENT: style('Partially consistent', 'caution'),
  INCONSISTENT: style('Inconsistent', 'high'),
  UNAVAILABLE: UNAVAILABLE_STYLE,
};

export const RISK_STYLES: Record<RiskLevel, VerdictStyle> = {
  LOW: style('Low risk', 'ok'),
  MEDIUM: style('Medium risk', 'caution'),
  HIGH: style('High risk', 'high'),
};

export const RECOMMENDATION_STYLES: Record<Recommendation, VerdictStyle> = {
  PROCEED: style('PROCEED', 'ok'),
  REVIEW: style('REVIEW', 'caution'),
  ESCALATE: style('ESCALATE', 'high'),
};

export const MATCH_TYPE_LABELS: Record<MatchType, string> = {
  EXACT: 'Exact match',
  NEAR: 'Near match',
  POSSIBLE: 'Possible match',
};
