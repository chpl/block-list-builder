import { useEffect, useState } from 'react';
import type { Rule } from '@blb/shared';
import { ApiCallError, serialize } from '../api.js';

interface Props {
  rules: Rule[];
  onInvalidRule: (id: string | null) => void;
}

export function JsonOutput({ rules, onInvalidRule }: Props) {
  const [output, setOutput] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await serialize(rules);
        if (cancelled) return;
        setOutput(res.json);
        setError(null);
        onInvalidRule(null);
      } catch (err) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        setOutput(null);
        onInvalidRule(err instanceof ApiCallError && err.ruleId ? err.ruleId : null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(t);
      onInvalidRule(null);
    };
  }, [rules, onInvalidRule]);

  const text = output ? JSON.stringify(output, null, 2) : '[]';
  const canCopy = !error;

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>blockList.toJSON()</h2>
        <button type="button" className="copy-btn" onClick={copy} disabled={!canCopy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      {loading && <div className="muted">Updating…</div>}
      {error && <div className="error">{error}</div>}
      <pre>{text}</pre>
    </section>
  );
}
