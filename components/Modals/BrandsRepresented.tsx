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

const BrandsRepresented: React.FC<Props> = ({
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

  const [error, setError] = useState('');

  const patch = () => {
    let item = getValues('brands_represented');
    let sel = state.selections;
    if (!sel.includes(item) && item) {
      sel.push(item);
    }

    if (profile === true) {
      setIsDisabled(true);
      const user: any = {
        brands_represented: state.selections,
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
      useStore.setState({ brands_represented: state.selections });
      return new Promise((resolve, reject) => {
        resolve(201);
      });
    }
  };

  return (
    <>
      <CheckBubbles
        register={register}
        checkList={[]}
        label="onboarding.name-5-brand-you-currently-represent"
        required={true}
        bubbleName="brands_represented"
        state={state}
        setState={setState}
        smaller
        getValues={getValues}
        setValue={setValue}
      />
      {visibilityToggle && (
        <VisibleModalToggle
          onChange={() => handleToggle('brands_represented')}
          toggleValue="brands_represented"
          toggleID="brands_represented"
          checked={visibleTerms.includes('brands_represented')}
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

export default BrandsRepresented;
