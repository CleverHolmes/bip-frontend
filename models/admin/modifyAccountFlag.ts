import { AccountFlags } from 'models/user/user';

export type ModifyAccountFlagRequest = {
  userUuid: string;
  modificationOperation: 'set' | 'remove';
  accountFlag: AccountFlags;
};

export type ModifyAccountFlagResponse = {
  userUuid: string;
  accountFlags: Array<AccountFlags>;
};
