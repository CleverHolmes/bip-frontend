import { useTranslation } from 'next-i18next';
import * as _ from 'lodash';
import React, { useState } from 'react';

import Button from 'components/Buttons/Button';
import InputNoRegister from 'components/InputNoRegister';
import { ModalDismissAsyncButton } from 'components/ModalWindow';
import useStore from 'modules/Store';
import { renameFolder } from 'api/vault/renameFolder';
import useTokensOrCookies from 'contexts/TokensOrCookies';

interface Props {
  defaultValue: string;
  refreshVault: () => void;
  adjustSection: any;
}

const UpdateFolderName: React.FC<Props> = ({
  defaultValue,
  refreshVault,
  adjustSection,
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
    setIsDisabled(true);
    const user = {
      folder: defaultValue,
      folder_new_name: input,
      user_uuid: companyRepresented ? companyRepresented : userUUID,
    };

    return renameFolder(user)
      .then(() => {
        refreshVault();
        adjustSection(input);
        setIsDisabled(false);
        return new Promise((resolve, reject) => {
          resolve(201);
        });
      })
      .catch((err) => {
        setIsDisabled(false);
        setError(JSON.parse(err.request.response).message);
      });
  };

  return (
    <>
      <InputNoRegister
        name="folder_new_name"
        label="vault.update-folder-name"
        placeholder={t('vault.enter-folder-name')}
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

export default UpdateFolderName;
