import * as _ from 'lodash';
import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';

import Button from 'components/Buttons/Button';
import { ModalDismissAsyncButton } from 'components/ModalWindow';
import useStore from 'modules/Store';
import { patchUser } from 'api/user/patchUser';
import TextArea from 'components/TextArea';
import VisibleModalToggle from 'components/VisibleModal';
import useTokensOrCookies from 'contexts/TokensOrCookies';

interface Props {
  defaultValue: string;
  defaultValueToggle?: string[];
  refreshUser?: () => void;
  // profile?: boolean;
  visibilityToggle?: boolean;
}

const About: React.FC<Props> = ({
  defaultValue,
  refreshUser,
  // profile,
  defaultValueToggle,
  visibilityToggle,
}) => {
  const userUUID = useStore((state) => state.userUUID);
  const { t } = useTranslation();
  const { companyRepresented } = useTokensOrCookies();

  const copy = _.cloneDeep(defaultValue);

  const [error, setError] = useState('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const [text, setText] = useState<string>(copy);

  const handleText = (e: React.FormEvent<HTMLInputElement>) => {
    setText(e.currentTarget.value);
  };

  const patch = () => {
    // if (profile === true) {
    setIsDisabled(true);
    const user: any = {
      about: text,
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
    // } else {
    //   useStore.setState({ about: text });
    //   return new Promise((resolve, reject) => {
    //     resolve(201);
    //   });
    // }
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
      <TextArea
        name="about"
        label="onboarding.about-my-company"
        value={text}
        onChange={handleText}
        placeholder={t('onboarding.describe-your-company')}
        max={500}
        smaller
      />
      {visibilityToggle && (
        <VisibleModalToggle
          onChange={() => handleToggle('about')}
          toggleValue="about"
          toggleID="about"
          checked={visibleTerms.includes('about')}
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

export default About;
