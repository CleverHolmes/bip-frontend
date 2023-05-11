import { useTranslation } from 'next-i18next';
import * as _ from 'lodash';
import React, { useState } from 'react';

import Button from 'components/Buttons/Button';
import CheckBoxes from 'components/CheckBoxes';
import { ModalDismissAsyncButton } from 'components/ModalWindow';
import { typeOfUser } from 'public/helpers/data';
import useStore from 'modules/Store';
import { patchUser } from 'api/user/patchUser';
import useTokensOrCookies from 'contexts/TokensOrCookies';

interface Props {
  defaultValue: string[];
  refreshUser?: () => void;
  profile?: boolean;
}

const Roles: React.FC<Props> = ({ defaultValue, refreshUser, profile }) => {
  const userUUID = useStore((state) => state.userUUID);
  const { t } = useTranslation();
  const { companyRepresented } = useTokensOrCookies();

  const copy = _.cloneDeep(defaultValue);
  const [state, setState] = React.useState<{ selections: string[] }>({
    selections: copy || [],
  });

  const [error, setError] = useState('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  function handleCheckboxChange(key: string) {
    let sel = state.selections;
    let find = sel.indexOf(key);
    if (find > -1) {
      sel.splice(find, 1);
    } else {
      sel.push(key);
    }
    setError('');

    setState({
      selections: sel,
    });
  }

  const patch = () => {
    if (profile === true) {
      setIsDisabled(true);
      const user = {
        roles: state.selections,
        user_uuid: companyRepresented ? companyRepresented : userUUID,
      };

      return patchUser(user)
        .then((res) => {
          if (refreshUser) {
            refreshUser();
          }
          setIsDisabled(false);
          return res;
        })
        .catch((err) => {
          setIsDisabled(false);
          setError(JSON.parse(err.request.response).message);
        });
    } else {
      useStore.setState({ roles: state.selections });
      return new Promise((resolve, reject) => {
        resolve(201);
      });
    }
  };

  return (
    <>
      <CheckBoxes
        selections={state.selections}
        checkList={typeOfUser}
        onChange={handleCheckboxChange}
        label="onboarding.who-are-you"
      />
      <div className="h-4 mt-2 ml-4 text-sm text-red-400 font-custom2">
        {error && error}
      </div>
      <div className="flex items-center justify-center my-10">
        <ModalDismissAsyncButton>
          <Button disabled={isDisabled} onClick={patch}>
            {t('submit')}
          </Button>
        </ModalDismissAsyncButton>
      </div>
    </>
  );
};

export default Roles;
