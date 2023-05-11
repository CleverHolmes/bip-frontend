import { UserRoles } from 'models/user/user';
import useStore from 'modules/Store';
import useTokensOrCookies from 'contexts/TokensOrCookies';

function usePlans() {
  const roles = useStore((state) => state.roles);
  const userUUID = useStore((state) => state.userUUID);

  const { companyRepresented, operatingUser } = useTokensOrCookies();

  const showPaymentPlans =
    !operatingUser &&
    ((roles.length === 1 && !roles.includes(UserRoles.LICENSEE)) ||
      roles.length > 1) &&
    (!companyRepresented || companyRepresented === userUUID);

  return {
    showPaymentPlans,
  };
}

export default usePlans;
