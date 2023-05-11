import { useTranslation } from 'next-i18next';
import * as _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import Button from 'components/Buttons/Button';
import { ModalDismissAsyncButton } from 'components/ModalWindow';
import { patchItem } from 'api/item/patchItem';
import Input from 'components/Input';

interface Props {
  defaultValue: string;
  refreshProperties: () => void;
  uuid: string;
  inputName: string;
  inputPlaceholder: string;
  label: string;
}

const Demographics: React.FC<Props> = ({
  defaultValue,
  refreshProperties,
  uuid,
  inputName,
  inputPlaceholder,
  label,
}) => {
  const { t } = useTranslation();
  const copy = _.cloneDeep(defaultValue);
  const { register, getValues, setValue } = useForm();

  const [error, setError] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  useEffect(() => {
    setValue(inputName, copy);
  }, [copy]);

  const patch = () => {
    setIsDisabled(true);
    let item = getValues(inputName);
    const user = {
      [inputName]: item,
      uuid,
    };

    return patchItem(user)
      .then((res) => {
        refreshProperties();
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
      <Input
        type="text"
        label={label}
        register={register}
        name={inputName}
        placeholder={inputPlaceholder}
        required={true}
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

export default Demographics;
