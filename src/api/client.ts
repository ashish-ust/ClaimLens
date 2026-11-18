import { API_BASE_URL } from '../config';
import type {
  AnalysisResult,
  ApprovedClaim,
  DecisionResponse,
  DecisionValue,
} from '../types';

export type ApiErrorKind = 'network' | 'http' | 'parse';

/** Error raised for every failed API call. `kind` tells the UI what went wrong. */
export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number | null;

  constructor(kind: ApiErrorKind, message: string, status: number | null = null) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
  }
}

function isAbortError(err: unknown): boolean {
  return err instanceof Error && err.name === 'AbortError';
}

/** Pulls a readable message out of a FastAPI-style `{ detail }` error body. */
async function readErrorMessage(response: Response): Promise<string> {
  const fallback = `The server returned an error (HTTP ${response.status}).`;
  try {
    const body: unknown = await response.json();
    if (body && typeof body === 'object' && 'detail' in body) {
      const detail = (body as { detail: unknown }).detail;
      if (typeof detail === 'string') return detail;
      if (Array.isArray(detail)) {
        const messages = detail
          .map((item) =>
            item && typeof item === 'object' && 'msg' in item ? String((item as { msg: unknown }).msg) : '',
          )
          .filter(Boolean);
        if (messages.length > 0) return messages.join('; ');
      }
    }
  } catch {
    // Body was not JSON; fall through to the generic message.
  }
  return fallback;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, init);
  } catch (err) {
    if (isAbortError(err)) throw err;
    throw new ApiError('network', 'Could not reach the ClaimLens server.');
  }

  if (!response.ok) {
    throw new ApiError('http', await readErrorMessage(response), response.status);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError('parse', 'The server sent a response that could not be read.', response.status);
  }
}

/** Turns an API-relative path (e.g. /api/...) into an absolute URL on the backend. */
export function resolveAssetUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

export function createAnalysis(image1: File, image2: File, narrative: string): Promise<AnalysisResult> {
  const body = new FormData();
  body.append('image1', image1);
  body.append('image2', image2);
  body.append('narrative', narrative);
  return request<AnalysisResult>('/api/analyses', { method: 'POST', body });
}

export function getAnalysis(analysisId: string, signal?: AbortSignal): Promise<AnalysisResult> {
  return request<AnalysisResult>(`/api/analyses/${encodeURIComponent(analysisId)}`, { signal });
}

export function submitDecision(
  analysisId: string,
  decision: DecisionValue,
  reviewerNote: string | null,
): Promise<DecisionResponse> {
  return request<DecisionResponse>(`/api/analyses/${encodeURIComponent(analysisId)}/decision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ decision, reviewer_note: reviewerNote }),
  });
}

export function listApprovedClaims(signal?: AbortSignal): Promise<ApprovedClaim[]> {
  return request<ApprovedClaim[]>('/api/claims', { signal });
}
