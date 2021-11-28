import type { AuthorizedUser } from './test.spec';

declare namespace Express {
  export interface Request {
    auth: {
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      user: AuthorizedUser;
    };
  }
}
