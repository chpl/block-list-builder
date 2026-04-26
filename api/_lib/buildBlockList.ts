import { BlockList } from 'node:net';
import type { Rule } from '../../packages/shared/src/index.js';

export class RuleError extends Error {
  constructor(message: string, public ruleId: string) {
    super(message);
    this.name = 'RuleError';
  }
}

export function buildBlockList(rules: Rule[]): BlockList {
  const list = new BlockList();
  for (const rule of rules) {
    try {
      switch (rule.kind) {
        case 'address':
          list.addAddress(rule.address, rule.family);
          break;
        case 'range':
          list.addRange(rule.start, rule.end, rule.family);
          break;
        case 'subnet':
          list.addSubnet(rule.network, rule.prefix, rule.family);
          break;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new RuleError(msg, rule.id);
    }
  }
  return list;
}
