import * as _ from 'lodash';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

import Button from 'components/Buttons/Button';
import CheckBubbles from 'components/CheckBubbles';
import { ModalDismissAsyncButton } from 'components/ModalWindow';
import VisibleModalToggle from 'components/VisibleModal';
import useStore from 'modules/Store';
import { patchUser } from 'api/user/patchUser';
import useTokensOrCookies from 'contexts/TokensOrCookies';

interface Props {
  defaultValue: string[];
  defaultValueToggle?: string[];
  refreshUser?: () => void;
  profile?: boolean;
  visibilityToggle?: boolean;
}

const CurrentLicenses: React.FC<Props> = ({
  defaultValue,
  refreshUser,
  profile,
  defaultValueToggle,
  visibilityToggle,
}) => {
  const userUUID = useStore((state) => state.userUUID);
  const { t } = useTranslation();
  const { companyRepresented } = useTokensOrCookies();

  const copy = _.cloneDeep(defaultValue);

  const { register, getValues, setValue } = useForm();

  const [state, setState] = useState({
    selections: copy || [],
  });
  const [error, setError] = useState('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const patch = () => {
    let item = getValues('current_licenses');
    let sel = state.selections;
    if (!sel.includes(item) && item) {
      sel.push(item);
    }

    if (profile === true) {
      setIsDisabled(true);
      const user: any = {
        current_licenses: state.selections,
        user_uuid: companyRepresented ? companyRepresented : userUUID,
      };

      if (visibilityToggle) {
        user.publicly_visible = visibleTerms;
      }

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
      useStore.setState({ current_licenses: state.selections });
      return new Promise((resolve, reject) => {
        resolve(201);
      });
    }
  };

  const copyVisible = _.cloneDeep(defaultValueToggle);
  const [visibleTerms, setVisibleTerms] = useState<any>(copyVisible);

  const handleToggle = (item: string) => {
    if (visibleTerms.includes(item)) {
      setVisibleTerms(visibleTerms.filter((i: string) => item !== i));
    } else {
      setVisibleTerms([...visibleTerms, item]);
    }
  };

  return (
    <>
      <CheckBubbles
        register={register}
        checkList={[]}
        label="onboarding.name-5-current-licenses-you-hold"
        required={true}
        bubbleName="current_licenses"
        state={state}
        setState={setState}
        smaller
        getValues={getValues}
        setValue={setValue}
      />
      {visibilityToggle && (
        <VisibleModalToggle
          onChange={() => handleToggle('current_licenses')}
          toggleValue="current_licenses"
          toggleID="current_licenses"
          checked={visibleTerms.includes('current_licenses')}
        />
      )}
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

export default CurrentLicenses;
