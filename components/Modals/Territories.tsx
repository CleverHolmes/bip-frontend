import { useTranslation } from 'next-i18next';
import * as _ from 'lodash';
import React, { useState } from 'react';

import BubbleList from 'components/BubbleLists/BubbleList';
import Button from 'components/Buttons/Button';
import { ModalDismissAsyncButton } from 'components/ModalWindow';
import VisibleModalToggle from 'components/VisibleModal';
import { listOfTerritories, typesOfTerritories } from 'public/helpers/data';
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

const Territories: React.FC<Props> = ({
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

  const [state, setState] = useState<{ selections: string[] }>({
    selections: copy || [],
  });
  const [error, setError] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const copyVisible = _.cloneDeep(defaultValueToggle);
  const [visibleTerms, setVisibleTerms] = useState<any>(copyVisible);

  const handleToggle = (item: string) => {
    if (visibleTerms.includes(item)) {
      setVisibleTerms(visibleTerms.filter((i: string) => item !== i));
    } else {
      setVisibleTerms([...visibleTerms, item]);
    }
  };

  const patch = () => {
    if (profile === true) {
      setIsDisabled(true);
      const user: any = {
        territories: state.selections,
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
      useStore.setState({ territories: state.selections });
      return new Promise((resolve, reject) => {
        resolve(201);
      });
    }
  };

  return (
    <>
      <BubbleList
        checkList={listOfTerritories}
        types={typesOfTerritories}
        label="onboarding.what-territories-do-you-operate-in"
        bubbleName="territories"
        state={state}
        setState={setState}
        defaultValue={[]}
        smaller
      />
      {visibilityToggle && (
        <VisibleModalToggle
          onChange={() => handleToggle('territories')}
          toggleValue="territories"
          toggleID="territories"
          checked={visibleTerms.includes('territories')}
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

export default Territories;
