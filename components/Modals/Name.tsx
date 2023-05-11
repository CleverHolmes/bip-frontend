import { useTranslation } from 'next-i18next';
import _ from 'lodash';
import React, { useState } from 'react';
import * as Yup from 'yup';

import Button from 'components/Buttons/Button';
import InputDoubleNoRegisterColumn from 'components/InputDoubleNoRegisterColumn';
import { ModalDismissAsyncButton } from 'components/ModalWindow';
import useStore from 'modules/Store';
import { patchUser } from 'api/user/patchUser';
import useTokensOrCookies from 'contexts/TokensOrCookies';
import validations from 'utils/validations';

interface Props {
  defaultValue1: string;
  defaultValue2: string;
  refreshUser?: () => void;
  profile?: boolean;
}

const Name: React.FC<Props> = ({
  defaultValue1,
  defaultValue2,
  refreshUser,
  profile,
}) => {
  const userUUID = useStore((state) => state.userUUID);
  const { t } = useTranslation();

  const { accessToken, companyRepresented, operatingUser, primaryUser } =
    useTokensOrCookies();

  const copy1 = _.cloneDeep(defaultValue1);
  const copy2 = _.cloneDeep(defaultValue2);

  const [input1, setInput1] = useState(copy1);
  const [input2, setInput2] = useState(copy2);
  const [error, setError] = useState('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const handleChange1 = (e: any) => {
    setInput1(e.target.value);
  };

  const handleChange2 = (e: any) => {
    setInput2(e.target.value);
  };

  const patch = () => {
    const userSchema = Yup.object({
      name_first: validations.firstName,
      name_last: validations.lastName,
    });
    try {
      userSchema.validateSync({
        name_first: input1,
        name_last: input2,
      });
      if (profile === true) {
        setIsDisabled(true);
        const user = {
          name_first: input1,
          name_last: input2,
          user_uuid:
            operatingUser && companyRepresented === primaryUser
              ? operatingUser
              : companyRepresented
              ? companyRepresented
              : userUUID,
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
        useStore.setState({ name_first: input1 });
        useStore.setState({ name_last: input2 });
        return new Promise((resolve, reject) => {
          resolve(201);
        });
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setError(`${t(error.message)}`);
      }
      return new Promise((resolve) => {
        resolve(400);
      });
    }
  };

  return (
    <>
      <InputDoubleNoRegisterColumn
        name="brand"
        label="whats-your-name"
        placeholder1={t('onboarding.first-name')}
        placeholder2={t('onboarding.last-name')}
        type="text"
        smaller
        value1={input1}
        value2={input2}
        onChange1={handleChange1}
        onChange2={handleChange2}
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

export default Name;
