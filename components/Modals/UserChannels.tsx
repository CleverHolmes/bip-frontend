import { useTranslation } from 'next-i18next';
import * as _ from 'lodash';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import BubbleListAndInput from 'components/BubbleLists/BubbleListAndInput';
import Button from 'components/Buttons/Button';
import { ModalDismissAsyncButton } from 'components/ModalWindow';
import { channelsOfDist, channelsOfDistValue } from 'public/helpers/data';
import useStore from 'modules/Store';
import { patchUser } from 'api/user/patchUser';
import useTokensOrCookies from 'contexts/TokensOrCookies';

interface Props {
  defaultValue: string[];
  refreshUser?: () => void;
}

const UserChannels: React.FC<Props> = ({ defaultValue, refreshUser }) => {
  const userUUID = useStore((state) => state.userUUID);
  const { t } = useTranslation();
  const { companyRepresented } = useTokensOrCookies();
  const copy = _.cloneDeep(defaultValue);

  const { register, getValues, setValue } = useForm();

  const [state, setState] = useState<{ selections: string[] }>({
    selections: copy || [],
  });
  const [error, setError] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const patch = () => {
    let item = getValues('distribution_channels');
    let sel = state.selections;
    if (!sel.includes(item) && item) {
      sel.push(item);
    }

    setIsDisabled(true);
    const user = {
      distribution_channels: state.selections,
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
  };

  return (
    <>
      <BubbleListAndInput
        checkList={channelsOfDist}
        checkList2={channelsOfDistValue}
        label="onboarding.choose-channels-of-distribution"
        bubbleName="distribution_channels"
        state={state}
        setState={setState}
        defaultValue={[]}
        smaller
        register={register}
        getValues={getValues}
        setValue={setValue}
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

export default UserChannels;
