import axios from 'axios';

export function getAuthErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    const bodyMsg =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof (data as { message: unknown }).message === 'string'
        ? (data as { message: string }).message
        : undefined;
    if (bodyMsg?.trim()) return bodyMsg.trim();
    if (err.response?.status === 401) return 'Invalid email or password.';
    if (!err.response && err.request) {
      return 'Cannot reach the API. Start the backend and use npm run dev (proxy to /api).';
    }
    if (err.code === 'ERR_NETWORK') {
      return 'Network error — is the backend running?';
    }
  }
  if (err instanceof Error && err.message) return err.message;
  return 'Something went wrong.';
}
