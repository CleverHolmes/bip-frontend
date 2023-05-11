import { useTranslation } from 'next-i18next';
import * as _ from 'lodash';
import React, { useState } from 'react';

import { patchItem } from 'api/item/patchItem';
import Button from 'components/Buttons/Button';
import { ModalDismissAsyncButton } from 'components/ModalWindow';
import TextArea from 'components/TextArea';

interface Props {
  defaultValue: string;
  refreshProperties: () => void;
  uuid: string;
}

const Description: React.FC<Props> = ({
  defaultValue,
  refreshProperties,
  uuid,
}) => {
  const { t } = useTranslation();

  const [text, setText] = useState<string>(defaultValue);

  const handleText = (e: React.FormEvent<HTMLInputElement>) => {
    setText(e.currentTarget.value);
  };

  const [error, setError] = useState('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const patch = () => {
    setIsDisabled(true);
    const item = {
      description: text,
      uuid,
    };

    return patchItem(item)
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
      <TextArea
        name="description"
        label="add-product.property-description"
        value={text}
        onChange={handleText}
        placeholder="Describe your property"
        max={10000}
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

export default Description;
