export type Rule<T> = (token: T) => Promise<RuleResult> | RuleResult;

export interface RuleResult {
  passed: boolean;
  ruleName: string;
}
