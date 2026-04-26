import { useState } from 'react';
import type { IpFamily, Rule } from '@blb/shared';
import { placeholderForFamily } from '@blb/shared';
import { check } from '../api.js';
import { FamilySelect } from './FamilySelect.js';

interface Props {
  rules: Rule[];
}

type Result = { kind: 'blocked' } | { kind: 'allowed' } | { kind: 'error'; message: string };

export function IpTester({ rules }: Props) {
  const [address, setAddress] = useState('');
  const [family, setFamily] = useState<IpFamily>('ipv4');
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!address.trim()) return;
    setBusy(true);
    setResult(null);
    try {
      const res = await check(rules, address.trim(), family);
      setResult({ kind: res.blocked ? 'blocked' : 'allowed' });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setResult({ kind: 'error', message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel">
      <h2>Test an IP</h2>
      <form onSubmit={submit} className="rule-form">
        <div className="row">
          <label>
            Address
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={placeholderForFamily(family)}
            />
          </label>
          <FamilySelect value={family} onChange={setFamily} />
        </div>
        <button type="submit" disabled={busy}>
          {busy ? 'Checking…' : 'Check'}
        </button>
      </form>
      {result && (
        <div className={`result result-${result.kind}`}>
          {result.kind === 'blocked' && 'Blocked'}
          {result.kind === 'allowed' && 'Allowed'}
          {result.kind === 'error' && `Error: ${result.message}`}
        </div>
      )}
    </section>
  );
}
