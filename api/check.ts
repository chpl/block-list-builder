import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { CheckRequest, CheckResponse } from '../packages/shared/src/index.js';
import { isIpFamily } from '../packages/shared/src/index.js';
import { buildBlockList } from './_lib/buildBlockList.js';
import { handleRuleError, parseBody, requirePost, send, sendError } from './_lib/http.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requirePost(req, res)) return;
  const body = parseBody(req.body) as CheckRequest | null;
  if (!body || !Array.isArray(body.rules) || typeof body.address !== 'string') {
    return sendError(res, 400, 'rules[] and address required');
  }
  if (!isIpFamily(body.family)) {
    return sendError(res, 400, "family must be 'ipv4' or 'ipv6'");
  }
  try {
    const list = buildBlockList(body.rules);
    send<CheckResponse>(res, 200, { blocked: list.check(body.address, body.family) });
  } catch (err) {
    handleRuleError(res, err, 400);
  }
}
