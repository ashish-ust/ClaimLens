import type { ConsistencyDetector } from '../types';
import type { IconName } from './Icon';
import Icon from './Icon';
import './DetailBlocks.css';

interface Props {
  consistency: ConsistencyDetector;
}

interface ListBlockProps {
  heading: string;
  icon: IconName;
  tone: 'ok' | 'high' | 'unavailable';
  items: string[];
  emptyText: string;
}

function ListBlock({ heading, icon, tone, items, emptyText }: ListBlockProps) {
  return (
    <section>
      <h4 className="detail-heading">{heading}</h4>
      {items.length === 0 ? (
        <p className="detail-note">{emptyText}</p>
      ) : (
        <ul className={`detail-list tone-${tone}`}>
          {items.map((item, index) => (
            <li key={`${index}-${item}`}>
              <Icon name={icon} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Narrative vs photos: what matches, what contradicts, and what could not be verified. */
export default function ConsistencyDetails({ consistency }: Props) {
  return (
    <div>
      <ListBlock
        heading="Matches"
        icon="check"
        tone="ok"
        items={consistency.matched_details}
        emptyText="No matching details were confirmed."
      />
      <ListBlock
        heading="Contradictions"
        icon="cross"
        tone="high"
        items={consistency.contradictions}
        emptyText="No contradictions found."
      />
      <ListBlock
        heading="Could not verify"
        icon="question"
        tone="unavailable"
        items={consistency.missing_or_unverifiable}
        emptyText="Nothing was left unverified."
      />
    </div>
  );
}
