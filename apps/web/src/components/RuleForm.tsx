import { useEffect, useState } from 'react';
import type { IpFamily, Rule, RuleKind } from '@blb/shared';
import { DEFAULT_PREFIX, MAX_PREFIX, placeholderForFamily } from '@blb/shared';
import { FamilySelect } from './FamilySelect.js';

interface Props {
  onAdd: (rule: Rule) => void;
}

export function RuleForm({ onAdd }: Props) {
  const [kind, setKind] = useState<RuleKind>('address');
  const [family, setFamily] = useState<IpFamily>('ipv4');
  const [address, setAddress] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [network, setNetwork] = useState('');
  const [prefix, setPrefix] = useState(String(DEFAULT_PREFIX.ipv4));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPrefix(String(DEFAULT_PREFIX[family]));
  }, [family]);

  function reset() {
    setAddress('');
    setStart('');
    setEnd('');
    setNetwork('');
    setPrefix(String(DEFAULT_PREFIX[family]));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const id = crypto.randomUUID();
    let rule: Rule;
    if (kind === 'address') {
      if (!address.trim()) return setError('Address required');
      rule = { id, kind, family, address: address.trim() };
    } else if (kind === 'range') {
      if (!start.trim() || !end.trim()) return setError('Start and end required');
      rule = { id, kind, family, start: start.trim(), end: end.trim() };
    } else {
      const n = Number(prefix);
      if (!network.trim()) return setError('Network required');
      if (!Number.isInteger(n) || n < 0 || n > MAX_PREFIX[family]) {
        return setError(`Prefix must be 0–${MAX_PREFIX[family]}`);
      }
      rule = { id, kind, family, network: network.trim(), prefix: n };
    }
    onAdd(rule);
    reset();
  }

  return (
    <form onSubmit={submit} className="rule-form">
      <div className="row">
        <label>
          Kind
          <select value={kind} onChange={(e) => setKind(e.target.value as RuleKind)}>
            <option value="address">Address</option>
            <option value="range">Range</option>
            <option value="subnet">Subnet</option>
          </select>
        </label>
        <FamilySelect value={family} onChange={setFamily} />
      </div>

      {kind === 'address' && (
        <label>
          Address
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={placeholderForFamily(family)}
          />
        </label>
      )}

      {kind === 'range' && (
        <div className="row">
          <label>
            Start
            <input value={start} onChange={(e) => setStart(e.target.value)} placeholder="1.2.3.0" />
          </label>
          <label>
            End
            <input value={end} onChange={(e) => setEnd(e.target.value)} placeholder="1.2.3.255" />
          </label>
        </div>
      )}

      {kind === 'subnet' && (
        <div className="row">
          <label>
            Network
            <input
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              placeholder={family === 'ipv4' ? '10.0.0.0' : '2001:db8::'}
            />
          </label>
          <label>
            Prefix
            <input
              type="number"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              min={0}
              max={MAX_PREFIX[family]}
            />
          </label>
        </div>
      )}

      {error && <div className="error">{error}</div>}
      <button type="submit">Add rule</button>
    </form>
  );
}
