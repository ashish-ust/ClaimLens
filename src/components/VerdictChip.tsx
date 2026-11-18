import type { VerdictStyle } from '../utils/verdictStyles';
import Icon from './Icon';

interface Props {
  verdict: VerdictStyle;
  large?: boolean;
}

/** Verdict badge: icon + readable label + severity colour. */
export default function VerdictChip({ verdict, large = false }: Props) {
  return (
    <span className={`chip sev-${verdict.severity}${large ? ' chip-lg' : ''}`}>
      <Icon name={verdict.icon} />
      <span>{verdict.label}</span>
    </span>
  );
}
