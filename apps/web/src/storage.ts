import type { Rule } from '@blb/shared';

const KEY = 'block-list-builder:rules:v1';

export function loadRules(): Rule[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Rule[];
  } catch {
    return [];
  }
}

export function saveRules(rules: Rule[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(rules));
  } catch {
    // quota exceeded or storage disabled — silently ignore
  }
}
