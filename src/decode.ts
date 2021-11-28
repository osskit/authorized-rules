import jwtDecoder from 'jwt-decode';
import type { Request, Response } from 'express';
import createError from 'http-errors';
import type { JwtToken } from './types/models';

const parseToken = (token: string): JwtToken & { iss: string } => jwtDecoder(token);

export const decodeToken = (jwtToken: string): JwtToken => {
  let token: JwtToken;

  try {
    token = parseToken(jwtToken);
  } catch {
    throw createError(403, 'invalid token: parse failed');
  }

  if (!token.iss) {
    throw createError(403, 'invalid token: missing issuer');
  }

  return token;
};

export const decodeJwtMiddleware =
  ({ transformRequest, header }: { transformRequest?: (request: Request) => void; header?: string }) =>
  (request: Request, _: Response, next: (error?: Error) => void) => {
    const authHeader = request.header(header ?? 'Authorization');

    if (!authHeader) {
      next();

      return;
    }

    const token = decodeToken(authHeader.replace('Bearer ', ''));

    if (!token) {
      next();

      return;
    }

    transformRequest?.(request);
  };
