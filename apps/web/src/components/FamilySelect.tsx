import type { IpFamily } from '@blb/shared';

interface Props {
  value: IpFamily;
  onChange: (value: IpFamily) => void;
}

export function FamilySelect({ value, onChange }: Props) {
  return (
    <label>
      Family
      <select value={value} onChange={(e) => onChange(e.target.value as IpFamily)}>
        <option value="ipv4">IPv4</option>
        <option value="ipv6">IPv6</option>
      </select>
    </label>
  );
}
