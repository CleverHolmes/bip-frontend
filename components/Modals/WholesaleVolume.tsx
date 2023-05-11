import { useTranslation } from 'next-i18next';
import * as _ from 'lodash';
import React, { useState } from 'react';

import Button from 'components/Buttons/Button';
import { ModalDismissAsyncButton } from 'components/ModalWindow';
import RadioButton from 'components/RadioButton';
import VisibleModalToggle from 'components/VisibleModal';
import { wholesaleVolumeChoices } from 'public/helpers/data';
import useStore from 'modules/Store';
import { patchUser } from 'api/user/patchUser';
import useTokensOrCookies from 'contexts/TokensOrCookies';

interface Props {
  defaultValue: string;
  refreshUser?: () => void;
  defaultValueToggle?: string[];
  profile?: boolean;
  visibilityToggle?: boolean;
}

const WholesaleVolume: React.FC<Props> = ({
  defaultValue,
  refreshUser,
  defaultValueToggle,
  profile,
  visibilityToggle,
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
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const patch = () => {
    if (profile === true) {
      setIsDisabled(true);
      const wholeSaleSelection = wholesaleVolumeChoices.filter(
        (item) => item.value === selectedRadio
      )[0];

      const user: any = {
        annual_wholesale_volume: [
          wholeSaleSelection.min,
          wholeSaleSelection.max,
        ],
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
      useStore.setState({ annual_wholesale_volume: selectedRadio });
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
      <RadioButton
        radioObject={wholesaleVolumeChoices}
        label="onboarding.what-is-your-annual-wholesale-volume"
        defaultValue={copy}
        radioHandler={radioHandler}
        selectedRadio={selectedRadio}
      />
      {visibilityToggle && (
        <VisibleModalToggle
          onChange={() => handleToggle('annual_wholesale_volume')}
          toggleValue="annual_wholesale_volume"
          toggleID="annual_wholesale_volume"
          checked={visibleTerms.includes('annual_wholesale_volume')}
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

export default WholesaleVolume;
