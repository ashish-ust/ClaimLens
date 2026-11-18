import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  NARRATIVE_MAX_LENGTH,
  NARRATIVE_MIN_LENGTH,
} from '../config';

/** Returns a user-facing error for an unacceptable photo, or null when it is valid. */
export function validateImageFile(file: File, label: string): string | null {
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return `${label} must be a JPEG, PNG or WebP image.`;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `${label} is larger than 10 MB. Choose a smaller image.`;
  }
  return null;
}

/** Validation uses the trimmed narrative, so whitespace-only input does not count. */
export function narrativeLengthError(narrative: string): string | null {
  const length = narrative.trim().length;
  if (length === 0) return null;
  if (length < NARRATIVE_MIN_LENGTH) {
    const more = NARRATIVE_MIN_LENGTH - length;
    return `Add at least ${more} more character${more === 1 ? '' : 's'} (minimum ${NARRATIVE_MIN_LENGTH}).`;
  }
  if (length > NARRATIVE_MAX_LENGTH) {
    return `Please shorten the description to ${NARRATIVE_MAX_LENGTH} characters or fewer.`;
  }
  return null;
}

export function isNarrativeValid(narrative: string): boolean {
  const length = narrative.trim().length;
  return length >= NARRATIVE_MIN_LENGTH && length <= NARRATIVE_MAX_LENGTH;
}
