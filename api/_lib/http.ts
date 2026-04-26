import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { ApiError } from '../../packages/shared/src/index.js';
import { RuleError } from './buildBlockList.js';

export function parseBody(body: unknown): unknown {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return null;
    }
  }
  return body;
}

export function send<T>(res: VercelResponse, status: number, data: T): void {
  res.status(status).json(data);
}

export function sendError(res: VercelResponse, status: number, message: string, ruleId?: string): void {
  const payload: ApiError = ruleId ? { error: message, ruleId } : { error: message };
  res.status(status).json(payload);
}

export function handleRuleError(res: VercelResponse, err: unknown, fallbackStatus: number): void {
  if (err instanceof RuleError) {
    sendError(res, 400, err.message, err.ruleId);
    return;
  }
  const msg = err instanceof Error ? err.message : 'Unknown error';
  sendError(res, fallbackStatus, msg);
}

export function requirePost(req: VercelRequest, res: VercelResponse): boolean {
  if (req.method !== 'POST') {
    sendError(res, 405, 'Method not allowed');
    return false;
  }
  return true;
}
