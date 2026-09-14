import { environment } from '@/lib/env';

import { ApiError } from './ApiError';

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get('content-type');
  return contentType?.includes('application/json') ? response.json() : response.text();
}

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
