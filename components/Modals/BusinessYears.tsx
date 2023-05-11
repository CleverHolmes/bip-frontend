import * as _ from 'lodash';
import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';

import Button from 'components/Buttons/Button';
import InputNoRegister from 'components/InputNoRegister';
import { ModalDismissAsyncButton } from 'components/ModalWindow';
import VisibleModalToggle from 'components/VisibleModal';
import useStore from 'modules/Store';
import { patchUser } from 'api/user/patchUser';
import useTokensOrCookies from 'contexts/TokensOrCookies';
import { getCurrentUuid } from 'utils/getCurrentUuid';

interface Props {
  defaultValue: number;
  defaultValueToggle?: string[];
  refreshUser?: () => void;
  profile?: boolean;
  visibilityToggle?: boolean;
}

const BusinessYears: React.FC<Props> = ({
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

  const [input, setInput] = useState(copy);
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

  const handleChange = (e: any) => {
    setInput(e.target.value);
  };

  const patch = () => {
    if (profile === true) {
      setIsDisabled(true);
      const user: any = {
        business_years: input,
        user_uuid: getCurrentUuid(),
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
      useStore.setState({ business_years: input });
      return new Promise((resolve, reject) => {
        resolve(201);
      });
    }
  };

  return (
    <>
      <InputNoRegister
        name="business_years"
        label="onboarding.how-many-years-have-you-been-in-business"
        placeholder={t('onboarding.enter-number-of-years')}
        type="number"
        value={input}
        onChange={handleChange}
        smaller
      />
      {visibilityToggle && (
        <VisibleModalToggle
          onChange={() => handleToggle('business_years')}
          toggleValue="business_years"
          toggleID="business_years"
          checked={visibleTerms.includes('business_years')}
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

export default BusinessYears;
