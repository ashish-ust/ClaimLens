import { resolveAssetUrl } from '../api/client';
import type { AiGeneratedDetector, AnalysisImage } from '../types';
import { photoLabel } from '../utils/images';
import { AI_STYLES } from '../utils/verdictStyles';
import ConfidenceBar from './ConfidenceBar';
import VerdictChip from './VerdictChip';
import './DetailBlocks.css';

interface Props {
  ai: AiGeneratedDetector;
  images: AnalysisImage[];
}

function TextList({ items, emptyText }: { items: string[]; emptyText: string }) {
  if (items.length === 0) return <p className="detail-note">{emptyText}</p>;
  return (
    <ul className="detail-list">
      {items.map((item, index) => (
        <li key={`${index}-${item}`}>
          <span className="muted">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function AiDetails({ ai, images }: Props) {
  if (ai.per_image.length === 0) {
    return <p className="detail-note">No per-photo results were returned.</p>;
  }

  return (
    <div>
      {ai.per_image.map((result, index) => {
        const label = photoLabel(images, result.image_index);
        const image = images.find((img) => img.index === result.image_index) ?? images[index];
        const verdict = AI_STYLES[result.verdict];
        return (
          <section className="detail-item" key={`${result.image_index}-${index}`} aria-label={label}>
            <div className="ai-item-head">
              {image && (
                <img
                  className="ai-thumb"
                  src={resolveAssetUrl(image.url)}
                  alt={`${label} thumbnail`}
                  loading="lazy"
                />
              )}
              <div className="stack ai-item-verdict">
                <h4>{label}</h4>
                <div>
                  <VerdictChip verdict={verdict} />
                </div>
                <ConfidenceBar value={result.confidence} muted={verdict.severity === 'unavailable'} />
              </div>
            </div>

            <p>{result.explanation}</p>

            <h4 className="detail-heading">Indicators</h4>
            <TextList items={result.indicators} emptyText="No visual indicators reported." />

            <h4 className="detail-heading">EXIF findings</h4>
            <TextList items={result.exif_findings} emptyText="No EXIF findings reported." />
          </section>
        );
      })}
    </div>
  );
}
