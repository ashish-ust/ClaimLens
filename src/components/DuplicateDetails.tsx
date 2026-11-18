import { resolveAssetUrl } from '../api/client';
import type { AnalysisImage, DuplicateDetector, DuplicateMatch } from '../types';
import { findImageByIndex, otherImage, photoLabel } from '../utils/images';
import { MATCH_TYPE_LABELS } from '../utils/verdictStyles';
import Icon from './Icon';
import './DetailBlocks.css';

export type OpenImageHandler = (src: string, alt: string) => void;

interface Props {
  duplicate: DuplicateDetector;
  images: AnalysisImage[];
  onOpenImage: OpenImageHandler;
}

/** Hamming distance is reported for 64-bit perceptual hashes, so similarity = 1 - distance / 64. */
function describeSimilarity(distance: number | null): string {
  if (distance === null) return 'Not reported';
  const similarity = Math.max(0, Math.round((1 - distance / 64) * 100));
  return `${similarity}% (Hamming distance ${distance})`;
}

function describeSource(match: DuplicateMatch): string {
  if (match.matched_source === 'EXISTING_CLAIM') return 'An existing approved claim';
  return 'The other uploaded photo';
}

export default function DuplicateDetails({ duplicate, images, onOpenImage }: Props) {
  if (duplicate.matches.length === 0) {
    return <p className="detail-note">No matching images were found.</p>;
  }

  return (
    <ul className="list-plain">
      {duplicate.matches.map((match, matchIndex) => (
        <MatchItem
          key={`${match.image_index}-${matchIndex}`}
          match={match}
          images={images}
          onOpenImage={onOpenImage}
        />
      ))}
    </ul>
  );
}

interface MatchItemProps {
  match: DuplicateMatch;
  images: AnalysisImage[];
  onOpenImage: OpenImageHandler;
}

function MatchItem({ match, images, onOpenImage }: MatchItemProps) {
  const uploaded = findImageByIndex(images, match.image_index);
  const uploadedLabel = photoLabel(images, match.image_index);
  const other = otherImage(images, match.image_index);
  const otherLabel = other ? photoLabel(images, other.index) : 'the other photo';
  const matchedSrc = match.matched_image_url ? resolveAssetUrl(match.matched_image_url) : null;

  return (
    <li className="detail-item">
      <h4>Applies to {uploadedLabel}</h4>
      <dl className="detail-kv">
        <dt>Match type</dt>
        <dd>{MATCH_TYPE_LABELS[match.match_type]}</dd>
        <dt>Similarity</dt>
        <dd>{describeSimilarity(match.hamming_distance)}</dd>
        <dt>Matched against</dt>
        <dd>{describeSource(match)}</dd>
        {match.matched_claim_id && (
          <>
            <dt>Claim ID</dt>
            <dd>{match.matched_claim_id}</dd>
          </>
        )}
      </dl>

      {matchedSrc && uploaded ? (
        <div className="detail-compare">
          <figure>
            <button
              type="button"
              className="detail-thumb-button"
              onClick={() => onOpenImage(resolveAssetUrl(uploaded.url), `${uploadedLabel}, uploaded`)}
            >
              <img src={resolveAssetUrl(uploaded.url)} alt={`${uploadedLabel}, uploaded for this claim`} />
            </button>
            <figcaption>{uploadedLabel} (uploaded)</figcaption>
          </figure>
          <figure>
            <button
              type="button"
              className="detail-thumb-button"
              onClick={() => onOpenImage(matchedSrc, 'Matched image')}
            >
              <img src={matchedSrc} alt="Matched image from the earlier record" />
            </button>
            <figcaption>Matched image</figcaption>
          </figure>
        </div>
      ) : (
        <p className="detail-note">
          <Icon name="image" className="inline-icon" />{' '}
          {match.matched_source === 'OTHER_UPLOADED_IMAGE'
            ? `This photo matched the other uploaded photo (${otherLabel}); no separate image is available for comparison.`
            : 'No comparison image is available for this match.'}
        </p>
      )}
    </li>
  );
}
