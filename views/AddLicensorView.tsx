import 'rc-slider/assets/index.css';

import React, { useState } from 'react';
import Slider from 'rc-slider';
import AvatarEditor from 'react-avatar-editor';
import { useTranslation } from 'next-i18next';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { NextRouter, useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';

import Paper from 'components/Paper';
import FileUploadField, { FileBase64Type } from 'components/FileUploadField';
import validations from 'utils/validations';
import Input from 'components/Input';
import { createNonInteractiveUser } from 'api/user/createNonInteractiveUser';
import { uploadCompanyLogo } from 'api/user/uploadCompanyLogo';
import routes from 'constants/routes';
import { onlyDocuments, onlyImages } from 'constants/acceptedFiles';
import CircleLoaderSpinner from 'components/CircleLoaderSpinner';
import Button from 'components/Buttons/Button';
import useStore from 'modules/Store';
import { delegateQueryKey } from 'api/delegate/delegate';
import RadioButtonField from 'views/ProductView/components/RadioButtonField';
import { UserRoles } from 'models/user/user';

type FormType = {
  role: UserRoles;
  companyName: string;
  about: string;
};

const AddLicensorView: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router: NextRouter = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedBase64Files, setUploadedBase64Files] = useState<
    FileBase64Type[]
  >([]);
  const [uploadedLogo, setUploadedLogo] = useState<File[]>([]);
  const [uploadedBase64Logo, setUploadedBase64Logo] = useState<
    FileBase64Type[]
  >([]);
  const [uploadedLogoError, setUploadedLogoError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const validationSchema = Yup.object().shape({
    companyName: validations.requiredStringField,
    about: validations.requiredStringField,
  });
  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    defaultValues: {
      role: UserRoles.LICENSOR,
    },
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema),
  });
  let editor: any;
  const isValid = !Object.keys(errors).length && !uploadedLogoError;

  const [zoom, setZoom] = useState(1);
  const radioItems = [
    { label: t('licensor'), value: UserRoles.LICENSOR },
    { label: t('licensee'), value: UserRoles.LICENSEE },
  ];

  const uploadFiles = (files: File[]) => {
    setUploadedFiles(files);
  };

  const uploadLogo = (files: File[]) => {
    if (files.length) {
      setUploadedLogoError(false);
    }

    setUploadedLogo(files);
  };

  const uploadBase64Files = (files: FileBase64Type[]) => {
    setUploadedBase64Files(files);
  };

  const uploadBase64Logo = (files: FileBase64Type[]) => {
    setUploadedBase64Logo(files);
  };

  const onSubmit = async (data: FormType) => {
    if (uploadedLogoError) return;

    setIsSubmitting(true);
    const canvasScaled = editor.getImageScaledToCanvas();
    const croppedImg = canvasScaled.toDataURL();
    try {
      const nonInteractiveUser = await createNonInteractiveUser({
        companyName: data.companyName,
        about: data.about,
        role: data.role,
        representationDocuments: uploadedBase64Files,
      });
      await uploadCompanyLogo({
        imageBase64String: croppedImg,
        filenameOriginal: uploadedBase64Logo[0].filenameOriginal,
        userUuid: nonInteractiveUser.uuid,
      });
      useStore.setState({ refreshUserAppWrapper: true });
      router.push(routes.congrats);
      queryClient.invalidateQueries({
        queryKey: [delegateQueryKey],
      });
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const checkForm = async () => {
    let hasError = false;

    if (!uploadedBase64Logo.length) {
      setUploadedLogoError(true);
      hasError = true;
    }

    if (hasError) {
      await trigger();
    } else {
      setUploadedLogoError(false);
      handleSubmit(onSubmit)();
    }
  };

  const setEditorRef = (ed: any) => {
    editor = ed;
  };

  return (
    <>
      {!isSubmitting ? (
        <>
          <div className="mb-10 text-xl font-bold text-primary font-custom1 md:text-3xl lg:text-5xl">
            {t('add-licensor.title')}
          </div>
          <div className="mb-4 text-xl font-bold text-primary font-custom1 md:text-xl lg:text-3xl">
            {t('add-licensor.sub-title-1')}
          </div>
          <Paper className="mb-10">
            <RadioButtonField
              register={register}
              name="role"
              label="add-licensor.role"
              items={radioItems}
            />
          </Paper>
          <Paper className="mb-10">
            <div className="mb-16">
              <Input
                type="text"
                register={register}
                label="licensor-brand-name"
                name="companyName"
                placeholder={t('enter-brand-name')}
                required={true}
                smaller={true}
                errorText={t(errors.companyName?.message || '')}
              />
            </div>
            <Input
              type="text"
              register={register}
              label="brand-description"
              name="about"
              placeholder={t('describe-your-licensor')}
              required={true}
              smaller={true}
              maxLength={10000}
              errorText={t(errors.about?.message || '')}
            />
          </Paper>
          <div className="mb-4 text-xl font-bold text-primary font-custom1 md:text-xl lg:text-3xl">
            {t('add-licensor.sub-title-2')}
          </div>
          <FileUploadField
            uploadFiles={uploadLogo}
            uploadBase64Files={uploadBase64Logo}
            files={uploadedLogo}
            isBase64
            allowMultiple={false}
            acceptedFileTypes={onlyImages}
            numberOfFiles={1}
            errorFileTypeText={t('errors:only-images-accepted')}
            errorText={
              uploadedLogoError ? t('errors:you-need-to-upload-a-logo') : ''
            }
          />
          {uploadedLogo.length > 0 && (
            <div className="flex flex-col items-center justify-center mb-20">
              <AvatarEditor
                ref={setEditorRef}
                image={uploadedLogo[0]}
                width={800}
                height={800}
                border={50}
                color={[255, 255, 255, 0.6]} // RGBA
                scale={zoom}
                rotate={0}
                className={'logoAvatar'}
              />
              <Slider
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(value: any) => {
                  setZoom(value);
                }}
                className="mt-5"
                value={zoom}
                railStyle={{
                  backgroundColor: 'rgba(10, 2, 39, 0.04)',
                  height: 17,
                }}
                trackStyle={{
                  backgroundColor: 'rgba(74,167,202,1)',
                  height: 17,
                }}
                handleStyle={{
                  background: '#FFFFFF',
                  boxShadow: '0px 7px 25px rgba(157, 164, 184, 0.1)',
                  height: 28,
                  width: 28,
                  marginLeft: 0,
                  marginTop: -5,
                  backgroundColor: 'white',
                  opacity: 100,
                }}
                dotStyle={{
                  width: 10,
                  height: 10,
                  background: '#FFFFFF',
                  position: 'absolute',
                  top: 3,
                }}
              />
            </div>
          )}
          <div className="mt-10 mb-4 text-xl font-bold text-primary font-custom1 md:text-xl lg:text-3xl">
            {t('add-licensor.sub-title-3')}
          </div>
          <FileUploadField
            uploadFiles={uploadFiles}
            uploadBase64Files={uploadBase64Files}
            files={uploadedFiles}
            isBase64
            acceptedFileTypes={onlyDocuments}
            numberOfFiles={6}
          />
          <div className="mt-10 flex items-center justify-end pt-5 lg:container lg:mx-auto">
            <div className="flex flex-col items-center justify-center">
              {!isValid && (
                <div className="mb-4 text-sm text-red-400 font-custom2">
                  {t('errors:all-fields-must-be-filled')}
                </div>
              )}
              <Button onClick={checkForm}>
                {t('confirm-and-send-button')}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <CircleLoaderSpinner size={500} />
      )}
    </>
  );
};

export default AddLicensorView;
