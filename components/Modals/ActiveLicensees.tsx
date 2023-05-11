import * as _ from 'lodash';
import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';

import Button from 'components/Buttons/Button';
import { ModalDismissAsyncButton } from 'components/ModalWindow';
import RadioButton from 'components/RadioButton';
import { activeLicenseesChoices } from 'public/helpers/data';
import useStore from 'modules/Store';
import VisibleModalToggle from 'components/VisibleModal';
import { patchUser } from 'api/user/patchUser';
import useTokensOrCookies from 'contexts/TokensOrCookies';

interface Props {
  defaultValue: string;
  refreshUser?: () => void;
  profile?: boolean;
  visibilityToggle?: boolean;
  defaultValueToggle?: string[];
}

const ActiveLicensees: React.FC<Props> = ({
  defaultValue,
  refreshUser,
  profile,
  visibilityToggle,
  defaultValueToggle,
}) => {
  const userUUID = useStore((state) => state.userUUID);
  const { t } = useTranslation();
  const { companyRepresented } = useTokensOrCookies();

  const copy = _.cloneDeep(defaultValue);
  const [selectedRadio, setSelectedRadio] = useState<string>(copy);

  const radioHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRadio(event.target.value);
  };
  const [error, setError] = useState('');

  const copyVisible = _.cloneDeep(defaultValueToggle);
  const [visibleTerms, setVisibleTerms] = useState<any>(copyVisible);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const handleToggle = (item: string) => {
    if (visibleTerms.includes(item)) {
      setVisibleTerms(visibleTerms.filter((i: string) => item !== i));
    } else {
      setVisibleTerms([...visibleTerms, item]);
    }
  };

  const patch = () => {
    if (profile === true) {
      setIsDisabled(true);
      const licenseeSelection = activeLicenseesChoices.filter(
        (item) => item.value === selectedRadio
      )[0];
      const user: any = {
        active_licensees: [licenseeSelection.min, licenseeSelection.max],
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
      useStore.setState({ active_licensees: selectedRadio });
      return new Promise((resolve, reject) => {
        resolve(201);
      });
    }
  };

  return (
    <>
      <RadioButton
        radioObject={activeLicenseesChoices}
        label="onboarding.how-many-active-licensees-do-you-have"
        defaultValue={copy}
        radioHandler={radioHandler}
        selectedRadio={selectedRadio}
      />
      {visibilityToggle && (
        <VisibleModalToggle
          onChange={() => handleToggle('active_licensees')}
          toggleValue="active_licensees"
          toggleID="active_licensees"
          checked={visibleTerms.includes('active_licensees')}
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

export default ActiveLicensees;
