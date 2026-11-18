import { API_BASE_URL } from '../config';
import { ApiError } from '../api/client';

export interface ErrorInfo {
  title: string;
  message: string;
}

/** Converts any thrown value into a message a person can act on. */
export function describeError(err: unknown): ErrorInfo {
  if (err instanceof ApiError) {
    if (err.kind === 'network') {
      return {
        title: "Can't reach the ClaimLens server",
        message: `Check that the backend is running on port 8000 (currently set to ${API_BASE_URL}), then try again.`,
      };
    }
    if (err.status === 404) {
      return { title: 'Not found', message: err.message };
    }
    return { title: 'Something went wrong', message: err.message };
  }
  return { title: 'Something went wrong', message: 'An unexpected error occurred. Please try again.' };
}
