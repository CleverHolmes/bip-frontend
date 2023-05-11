import { AccountFlags } from 'models/user/user';
import { getCurrentAccountFlags } from 'utils/getCurrentAccountFlags';

export const checkAccountFlag = (
  accountFlag: AccountFlags,
  checkOperatingUser = false
) => {
  const accountFlags = getCurrentAccountFlags(checkOperatingUser);

  return accountFlags.includes(accountFlag);
};
