import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { SerializeRequest, SerializeResponse } from '../packages/shared/src/index.js';
import { buildBlockList } from './_lib/buildBlockList.js';
import { handleRuleError, parseBody, requirePost, send, sendError } from './_lib/http.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requirePost(req, res)) return;
  const body = parseBody(req.body) as SerializeRequest | null;
  if (!body || !Array.isArray(body.rules)) {
    return sendError(res, 400, 'rules must be an array');
  }
  try {
    const list = buildBlockList(body.rules);
    send<SerializeResponse>(res, 200, { json: list.toJSON() });
  } catch (err) {
    handleRuleError(res, err, 500);
  }
}
