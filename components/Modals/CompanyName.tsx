import * as _ from 'lodash';
import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import * as Yup from 'yup';

import Button from 'components/Buttons/Button';
import InputNoRegister from 'components/InputNoRegister';
import { ModalDismissAsyncButton } from 'components/ModalWindow';
import useStore from 'modules/Store';
import { patchUser } from 'api/user/patchUser';
import useTokensOrCookies from 'contexts/TokensOrCookies';
import validations from 'utils/validations';

interface Props {
  defaultValue: string;
  refreshUser?: () => void;
  profile?: boolean;
}

const CompanyName: React.FC<Props> = ({
  defaultValue,
  refreshUser,
  profile,
}) => {
  const userUUID = useStore((state) => state.userUUID);
  const { t } = useTranslation();
  const { companyRepresented } = useTokensOrCookies();

  const copy = _.cloneDeep(defaultValue);

  const [input, setInput] = useState(copy);
  const [error, setError] = useState('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const handleChange = (e: any) => {
    setInput(e.target.value);
  };

  const patch = () => {
    const userSchema = Yup.object({
      company_name: validations.companyName,
    });
    try {
      userSchema.validateSync({
        company_name: input,
      });
      if (profile === true) {
        setIsDisabled(true);
        const user = {
          company_name: input,
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
        useStore.setState({ company_name: input });
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
      <InputNoRegister
        name="company_name"
        label="onboarding.whats-your-company-name"
        placeholder="Type company name"
        type="text"
        value={input}
        onChange={handleChange}
        smaller
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

export default CompanyName;
