import { environment } from '@/lib/env';

import { ApiError } from './ApiError';

/** Request options accepted by {@link apiRequest}. */
export type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  /** Value serialized as JSON when provided. */
  body?: unknown;
};

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get('content-type');
  return contentType?.includes('application/json') ? response.json() : response.text();
}

/**
 * Sends an HTTP request through the application's configured API boundary.
 *
 * @typeParam TResponse - Response shape expected by the caller. This function does not
 * validate that shape; validate untrusted responses at the feature boundary.
 * @param path - API-relative path appended to the configured base URL.
 * @param options - Standard request options with an optionally JSON-serialized body.
 * @throws `ApiError` when the response status is unsuccessful.
 */
export async function apiRequest<TResponse>(
  path: string,
  { body, headers, ...options }: ApiRequestOptions = {},
): Promise<TResponse> {
  const requestHeaders = new Headers(headers);
  requestHeaders.set('Accept', 'application/json');

  const requestOptions: RequestInit = {
    ...options,
    headers: requestHeaders,
  };

  if (body !== undefined) {
    if (!requestHeaders.has('Content-Type')) {
      requestHeaders.set('Content-Type', 'application/json');
    }
    requestOptions.body = JSON.stringify(body);
  }

  const response = await fetch(`${environment.VITE_API_BASE_URL}${path}`, requestOptions);

  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    throw new ApiError(
      `Request failed with status ${response.status}.`,
      response.status,
      responseBody,
    );
  }

  return responseBody as TResponse;
}
