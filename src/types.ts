export interface JwtToken {
  iss: string;
  sub: string;
}

export type Rule = (token: JwtToken) => Promise<RuleResult>;

export interface RuleResult {
  passed: boolean;
  ruleName: string;
}
