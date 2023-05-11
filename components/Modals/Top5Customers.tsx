import { useTranslation } from 'next-i18next';
import * as _ from 'lodash';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { ModalDismissAsyncButton } from 'components/ModalWindow';
import CheckBubbles from 'components/CheckBubbles';
import Button from 'components/Buttons/Button';
import useStore from 'modules/Store';
import { patchUser } from 'api/user/patchUser';
import VisibleModalToggle from 'components/VisibleModal';
import useTokensOrCookies from 'contexts/TokensOrCookies';

interface Props {
  defaultValue: string[];
  refreshUser?: () => void;
  defaultValueToggle?: string[];
  profile?: boolean;
  visibilityToggle?: boolean;
}

const Top5Customers: React.FC<Props> = ({
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

  const { register, getValues, setValue } = useForm();

  const [state, setState] = useState({
    selections: copy || [],
  });
  const [error, setError] = useState('');

  const patch = () => {
    let item = getValues('top_5_customers');
    let sel = state.selections;
    if (!sel.includes(item) && item) {
      sel.push(item);
    }

    if (profile === true) {
      const user: any = {
        top_5_customers: state.selections,
        user_uuid: companyRepresented
          ? companyRepresented
          : userUUID,
      };

      if (visibilityToggle) {
        user.publicly_visible = visibleTerms;
      }

      return patchUser(user)
        .then((res) => {
          if (refreshUser) {
            refreshUser();
          }
          return res;
        })
        .catch((err) => setError(JSON.parse(err.request.response).message));
    } else {
      useStore.setState({ top_5_customers: state.selections });
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
        label="onboarding.who-are-your-top-customers"
        required={true}
        bubbleName="top_5_customers"
        state={state}
        setState={setState}
        smaller
        getValues={getValues}
        setValue={setValue}
      />
      {visibilityToggle && (
        <VisibleModalToggle
          onChange={() => handleToggle('top_5_customers')}
          toggleValue="top_5_customers"
          toggleID="top_5_customers"
          checked={visibleTerms.includes('top_5_customers')}
        />
      )}
      <div className="h-4 mt-2 ml-4 text-sm text-red-400 font-custom2">
        {error && error}
      </div>
      <div className="flex items-center justify-center my-10">
        <ModalDismissAsyncButton>
          <Button onClick={patch}>{t('submit')}</Button>
        </ModalDismissAsyncButton>
      </div>
    </>
  );
};

export default Top5Customers;
