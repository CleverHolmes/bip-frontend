import useStore from 'modules/Store';

export const getCurrentAccountFlags = (checkOperatingUser: boolean = true) => {
  const userAccountFlags = useStore.getState().account_flags;
  const operatingUserAccountFlags =
    useStore.getState().account_flags_operating_user;
  const operatingUserUuid = useStore.getState().uuid_operating_user;

  return operatingUserUuid && checkOperatingUser
    ? operatingUserAccountFlags
    : userAccountFlags;
};
