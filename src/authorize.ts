import jwtDecoder from 'jwt-decode';
import createError from 'http-errors';
import type { JwtToken, Rule } from './types';

const parseToken = (token: string): JwtToken & { iss: string } => jwtDecoder(token);

export const authorize = async (jwtToken: string, executionRule: Rule): Promise<void> => {
  let token: JwtToken;

  try {
    token = parseToken(jwtToken);
  } catch {
    throw createError(403, 'invalid token: parse failed');
  }

  if (!token.iss) {
    throw createError(403, 'invalid token: missing issuer');
  }

  const ruleResult = await executionRule(token);

  if (!ruleResult.passed) {
    throw createError(403, 'operation not authorized');
  }
};

export const and =
  (rules: Rule[]): Rule =>
  async (token: JwtToken) => {
    const ruleResults = await Promise.all(rules.map((rule) => rule(token)));
    const failed = ruleResults.find((result) => !result.passed);

    if (!failed) {
      return { passed: true, ruleName: 'and' };
    }

    return failed;
  };

export const or =
  (rules: Rule[]): Rule =>
  async (token: JwtToken) => {
    const ruleResults = await Promise.all(rules.map((rule) => rule(token)));
    const success = ruleResults.find((result) => result.passed);

    if (!success) {
      return { passed: false, ruleName: 'or' };
    }

    return success;
  };
