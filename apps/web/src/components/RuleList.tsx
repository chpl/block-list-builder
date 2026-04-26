import type { Rule } from '@blb/shared';
import { formatRule } from '@blb/shared';

interface Props {
  rules: Rule[];
  invalidId: string | null;
  onDelete: (id: string) => void;
}

export function RuleList({ rules, invalidId, onDelete }: Props) {
  if (rules.length === 0) {
    return <p className="empty">No rules yet. Add one above.</p>;
  }
  return (
    <ul className="rule-list">
      {rules.map((rule) => (
        <li key={rule.id} className={invalidId === rule.id ? 'invalid' : ''}>
          <code>{formatRule(rule)}</code>
          <button type="button" onClick={() => onDelete(rule.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
