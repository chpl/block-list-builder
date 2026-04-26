import type {
  ApiError,
  CheckRequest,
  CheckResponse,
  Rule,
  SerializeResponse,
  IpFamily,
} from '@blb/shared';

export class ApiCallError extends Error {
  constructor(message: string, public ruleId?: string) {
    super(message);
    this.name = 'ApiCallError';
  }
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new ApiCallError(`Invalid response from ${path}: ${text.slice(0, 200)}`);
  }
  if (!res.ok) {
    const err = data as ApiError | null;
    throw new ApiCallError(err?.error ?? `Request failed: ${res.status}`, err?.ruleId);
  }
  return data as T;
}

export function serialize(rules: Rule[]): Promise<SerializeResponse> {
  return post<SerializeResponse>('/api/serialize', { rules });
}

export function check(rules: Rule[], address: string, family: IpFamily): Promise<CheckResponse> {
  const req: CheckRequest = { rules, address, family };
  return post<CheckResponse>('/api/check', req);
}
