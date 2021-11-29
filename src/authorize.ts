import createError from 'http-errors';
import type { Rule } from './types';

export const authorize = async <T>(decodedToken: T, executionRule: Rule<T>): Promise<void> => {
  const ruleResult = await executionRule(decodedToken);

  if (!ruleResult.passed) {
    throw createError(403, 'operation not authorized');
  }
};

export const and =
  <T>(rules: Rule<T>[]): Rule<T> =>
  async (decodedToken: T) => {
    const ruleResults = await Promise.all(rules.map((rule) => rule(decodedToken)));
    const failed = ruleResults.find((result) => !result.passed);

    if (!failed) {
      return { passed: true, ruleName: 'and' };
    }

    return failed;
  };

export const or =
  <T>(rules: Rule<T>[]): Rule<T> =>
  async (decodedToken: T) => {
    const ruleResults = await Promise.all(rules.map((rule) => rule(decodedToken)));
    const success = ruleResults.find((result) => result.passed);

    if (!success) {
      return { passed: false, ruleName: 'or' };
    }

    return success;
  };
