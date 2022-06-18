<div align="center">

# authorized-rules

  Add your custom rules to authorize your tokens 🔐

</div>

## Install
```
yarn add @osskit/authorized-rules
```

## Usage
### Basic Example
```
import { RuleResult, or, authorize } from '@osskit/authorized-rules';

export interface AuthorizedUser {
  admin?: boolean;
  email?: string;
  ids?: string[];
}

const userIsAdmin =
  () =>
  ({ admin }: AuthorizedUser): RuleResult => ({ passed: !!admin, ruleName: 'userIsAdmin' });

export const userHasAccess =
  (scopes: string[]) =>
  ({ scopes }: AuthorizedUser): RuleResult => ({
    ruleName: 'userHasAccess',
    passed: !!scopes?.length && scopes.every((scope) => scopes.includes(scope)),
  });

export const validExample = () => {
  authorize<AuthorizedUser>({ admin: true, email: 'a@a.com', scopes: ['scope-1', 'scope-2'] }, or([userHasAccess(['scope-1']), userIsAdmin()]));
  console.log('valid!');
};

export const invalidExample = () => {
  authorize<AuthorizedUser>({ admin: true, email: 'a@a.com', scopes: ['scope-1', 'scope-2'] }, or([userHasAccess(['scope-3']), userIsAdmin()]));
  // throws 403 Forbidden error
};
```
