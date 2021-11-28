import { RuleResult, or, authorize } from '../src';
export interface AuthorizedUser {
  admin?: boolean;
  email?: string;
  ids?: string[];
}

const userIsAdmin =
  () =>
  ({ admin }: AuthorizedUser): RuleResult => ({ passed: !!admin, ruleName: 'userIsAdmin' });

export const userHasAccess =
  (requestedIds: string[]) =>
  ({ ids }: AuthorizedUser): RuleResult => ({
    ruleName: 'userHasAccess',
    passed: !!ids?.length && requestedIds.every((id) => ids.includes(id)),
  });

export const example = () => {
  authorize<AuthorizedUser>({ admin: true, email: 'a@a.com', ids: ['1', '2'] }, or([userHasAccess(['1']), userIsAdmin()]));
  console.log('valid!');
};
