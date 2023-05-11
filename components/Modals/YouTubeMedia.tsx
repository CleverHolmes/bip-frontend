import { useTranslation } from 'next-i18next';
import * as _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import Button from 'components/Buttons/Button';
import { ModalDismissAsyncButton } from 'components/ModalWindow';
import { patchItem } from 'api/item/patchItem';
import Input from 'components/Input';
import { MediaUri, MediaUriEnum } from 'models/item/item';
import validations from 'utils/validations';

interface Props {
  defaultValue: string;
  refreshProperties: () => void;
  uuid: string;
  mediaUris: MediaUri[];
}

type FormType = {
  youtubeMedia: string;
};

const YouTubeMedia: React.FC<Props> = ({
  defaultValue,
  refreshProperties,
  uuid,
  mediaUris,
}) => {
  const { t } = useTranslation();
  const inputName = 'youtubeMedia';
  const validationSchema = Yup.object().shape({
    [inputName]: validations.youtubeMedia,
  });

  const copy = _.cloneDeep(defaultValue);
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<FormType>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });
  const youtubeMedia = watch('youtubeMedia');

  const [error, setError] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const errorText = t(errors[inputName]?.message || '') || error || '';

  useEffect(() => {
    setValue(inputName, copy);
  }, [copy]);

  const onSubmit = () => {
    setIsDisabled(true);
    let item = getValues(inputName);
    const filteredMediaUris = mediaUris.filter(
      (mediaUri) => mediaUri.media_uri_type !== MediaUriEnum.YOUTUBE
    );
    const user = {
      media_uris: [...filteredMediaUris],
      uuid,
    };
    if (item) {
      user.media_uris.push({
        media_uri_type: MediaUriEnum.YOUTUBE,
        media_uri: item,
      });
    }

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

  const handleClick = async () => {
    await trigger();
    await handleSubmit(onSubmit)();
  };

  return (
    <>
      <Input
        type="text"
        label={'add-product.youtube-media'}
        register={register}
        name={inputName}
        placeholder={t('add-product.youtube-media-placeholder')}
        required={true}
        errorText={errorText}
        smaller
      />
      {youtubeMedia && !errorText && (
        <div className="w-full lg:w-[70%] mx-auto flex justify-center relative pb-[56.25%] lg:pb-[37.3%] pt-[25px] h-0">
          <iframe
            className="w-full h-full absolute top-0 left-0 m-auto"
            src={youtubeMedia}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      )}
      <div className="flex items-center justify-center my-10">
        <ModalDismissAsyncButton>
          <Button disabled={isDisabled} onClick={handleClick}>
            {t('submit')}
          </Button>
        </ModalDismissAsyncButton>
      </div>
    </>
  );
};

export default YouTubeMedia;
