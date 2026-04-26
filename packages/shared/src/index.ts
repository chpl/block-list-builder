export type IpFamily = 'ipv4' | 'ipv6';

export type RuleKind = 'address' | 'range' | 'subnet';

export interface AddressRule {
  id: string;
  kind: 'address';
  family: IpFamily;
  address: string;
}

export interface RangeRule {
  id: string;
  kind: 'range';
  family: IpFamily;
  start: string;
  end: string;
}

export interface SubnetRule {
  id: string;
  kind: 'subnet';
  family: IpFamily;
  network: string;
  prefix: number;
}

export type Rule = AddressRule | RangeRule | SubnetRule;

export interface SerializeRequest {
  rules: Rule[];
}

export interface SerializeResponse {
  json: unknown;
}

export interface CheckRequest {
  rules: Rule[];
  address: string;
  family: IpFamily;
}

export interface CheckResponse {
  blocked: boolean;
}

export interface ApiError {
  error: string;
  ruleId?: string;
}

export const DEFAULT_PREFIX: Record<IpFamily, number> = { ipv4: 24, ipv6: 64 };
export const MAX_PREFIX: Record<IpFamily, number> = { ipv4: 32, ipv6: 128 };

const ADDRESS_PLACEHOLDER: Record<IpFamily, string> = {
  ipv4: '1.2.3.4',
  ipv6: '2001:db8::1',
};

export function placeholderForFamily(family: IpFamily): string {
  return ADDRESS_PLACEHOLDER[family];
}

export function isIpFamily(value: unknown): value is IpFamily {
  return value === 'ipv4' || value === 'ipv6';
}

export function formatRule(rule: Rule): string {
  switch (rule.kind) {
    case 'address':
      return `addAddress(${rule.address}, ${rule.family})`;
    case 'range':
      return `addRange(${rule.start}, ${rule.end}, ${rule.family})`;
    case 'subnet':
      return `addSubnet(${rule.network}, ${rule.prefix}, ${rule.family})`;
  }
}
