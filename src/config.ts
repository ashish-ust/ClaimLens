const DEFAULT_API_BASE_URL = 'http://localhost:8000';

/** Backend base URL with any trailing slashes removed. */
export const API_BASE_URL: string = (
  import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL
).replace(/\/+$/, '');

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const NARRATIVE_MIN_LENGTH = 20;
export const NARRATIVE_MAX_LENGTH = 3000;
