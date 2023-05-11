import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';
import { NextRouter, useRouter } from 'next/router';

import useStore from 'modules/Store';
import Accordion from 'components/Accordions/Accordion';
import BoxField from 'components/BoxFields/BoxField';
import { AuthorizedUser } from 'models/delegate/retrieveAuthorizedUsers';
import { removeAuthorizedUserCall } from 'api/user/removeAuthorizedUser';
import Toast from 'components/Toast';
import { throwError } from 'utils/error';
import { retrieveAuthorizedUsersCall } from 'api/delegate/retrieveAuthorizedUsers';
import Icon from 'components/Icon';
import DialogModal from 'components/DialogModal';
import Button from 'components/Buttons/Button';
import AddAuthorizedUser from 'components/Modals/AddAuthorizedUser';
import useTokensOrCookies from 'contexts/TokensOrCookies';
import { getCurrentUuid } from 'utils/getCurrentUuid';
import routes from 'constants/routes';
import { UserRoles } from 'models/user/user';

const AuthorizedUsers: React.FC = () => {
  const { companyRepresented, operatingUser } = useTokensOrCookies();
  const [authorizedUsers, setAuthorizedUsers] = useState<AuthorizedUser[]>();
  const [refreshAuthorizedUsers, setRefreshAuthorizedUsers] =
    useState<boolean>(true);
  const userUUID = useStore((state) => state.userUUID);
  const roles = useStore((state) => state.roles);
  const { t } = useTranslation();
  const router: NextRouter = useRouter();

  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [authorizedDelete, setAuthorizedDelete] = useState<string>();

  function openModalDelete() {
    setIsOpenDelete(true);
  }
  function closeModalDelete() {
    setIsOpenDelete(false);
  }

  const removeAuthorizedUser = async () => {
    if (!authorizedDelete) return;
    try {
      await removeAuthorizedUserCall({
        authorizedUserUuid: authorizedDelete,
      });
      setRefreshAuthorizedUsers(true);
      closeModalDelete();
      toast(
        <Toast message={`${t('settings.authorized-user-has-been-deleted')}`} />
      );
    } catch (err) {
      throwError(err);
    }
  };
  const allowPage =
    !companyRepresented ||
    companyRepresented === operatingUser ||
    (roles.includes(UserRoles.AGENCY) && !operatingUser);

  useEffect(() => {
    if (userUUID && refreshAuthorizedUsers) {
      const item = {
        userUuid: getCurrentUuid(),
      };
      retrieveAuthorizedUsersCall(item)
        .then((res) => {
          setAuthorizedUsers(res);
          setRefreshAuthorizedUsers(false);
        })
        .catch((err: any) => throwError(err));
    }
  }, [userUUID, companyRepresented, refreshAuthorizedUsers]);

  const [isOpenAddAuthorizedUser, setIsOpenAddAuthorizedUser] = useState(false);

  function closeModalAddAuthorizedUser() {
    setIsOpenAddAuthorizedUser(false);
  }

  function openModalAddAuthorizedUser() {
    setIsOpenAddAuthorizedUser(true);
  }

  useEffect(() => {
    if (!allowPage) {
      router.push(routes.settingsProfile);
    }
  }, [allowPage]);

  if (!allowPage) {
    return null;
  }

  return (
    <>
      <div className="pb-6 text-xl font-bold font-custom1 lg:text-3xl text-primary">
        {t('settings.authorized-users')}
        {!!authorizedUsers && authorizedUsers.length > 0 ? (
          authorizedUsers.map((user) => {
            return (
              <>
                <div
                  key={`${user.uuid}`}
                  className="flex items-center justify-between w-full py-6 border-b-2 md:col-span-2 border-horizontalDivider"
                >
                  <div className="flex items-center justify-between w-full cursor-pointer">
                    <div className="ml-6 text-xl text-primary font-custom1 text-bold">
                      <div>{`${user.nameFirst} ${user.nameLast}`}</div>
                      <div className="text-sm mt-2 text-primary">
                        {user.email}
                      </div>
                    </div>
                    <div className="flex w-12 h-12 mr-10 rounded-lg shadow-lg 2xl:mr-0 hover:bg-button">
                      <div className="relative inline-block w-full h-full group">
                        <Icon
                          name="ThreeDots"
                          className="h-full mx-auto my-auto cursor-pointer fill-primary hover:fill-white"
                          viewBox="0 0 20 4"
                          size="18"
                        />
                        <div className="absolute z-20 hidden text-base rounded-lg shadow-lg top-12 -left-40 -sm:left-12 w-30 font-custom1 text-primary group-hover:block group-hover:bg-white">
                          <div
                            className="flex w-[14rem] px-8 py-3 rounded-b-lg cursor-pointer hover:bg-backgroundInput"
                            onClick={() => {
                              openModalDelete();
                              setAuthorizedDelete(user.uuid);
                            }}
                          >
                            {t('settings.delete-authorized-user')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogModal
                  closeModal={closeModalDelete}
                  isOpen={isOpenDelete}
                  dialogTitle={t('settings.delete-authorized-user')}
                >
                  <div className="py-10 mx-auto text-lg font-custom1 font-primary">{`${t(
                    'settings.delete-authorized-modal'
                  )}`}</div>
                  <Button onClick={() => removeAuthorizedUser()}>
                    {t('settings.delete-authorized-user')}
                  </Button>
                </DialogModal>
              </>
            );
          })
        ) : (
          <div className="px-10 py-8 text-lg font-normal text-left text-inputGray font-custom1">
            {t('settings.there-are-no-current-authorized users')}
          </div>
        )}
      </div>
      <Accordion title={t('settings.add-authorized-user')}>
        <BoxField
          title={t('settings.add-authorized-user')}
          description={t('settings.submit-new-authorized-user')}
          onClick={openModalAddAuthorizedUser}
        />
      </Accordion>
      <AddAuthorizedUser
        isOpen={isOpenAddAuthorizedUser}
        closeModal={closeModalAddAuthorizedUser}
        setRefreshAuthorizedUsers={setRefreshAuthorizedUsers}
      />
    </>
  );
};

export default AuthorizedUsers;
