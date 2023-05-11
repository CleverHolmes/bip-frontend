import 'rc-slider/assets/index.css';

import { useTranslation } from 'next-i18next';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import Slider from 'rc-slider';
import AvatarEditor from 'react-avatar-editor';

import useStore from 'modules/Store';
import { onlyImages } from 'constants/acceptedFiles';
import FileUploadField, { FileBase64Type } from 'components/FileUploadField';
import Button from 'components/Buttons/Button';
import { ModalDismissAsyncButton } from 'components/ModalWindow';
import { uploadCompanyLogo } from 'api/user/uploadCompanyLogo';
import { throwError } from 'utils/error';
import HeaderSplitPrimaryButton from 'components/HeaderSplitPrimaryButton';
import CircleLoaderSpinner from 'components/CircleLoaderSpinner';
import { getCurrentUuid } from 'utils/getCurrentUuid';
import { getUserQueryKey } from 'api/user/getUserCall';
import { delegateQueryKey } from 'api/delegate/delegate';

interface CompanyLogoFileUploadProps {
  refreshUser: () => void;
}

const CompanyLogoFileUpload: React.FC<CompanyLogoFileUploadProps> = ({
  refreshUser,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  let editor: any;
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedBase64Files, setUploadedBase64Files] = useState<
    FileBase64Type[]
  >([]);
  const [uploadedFilesError, setUploadedFilesError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const disabledButton =
    uploadedFilesError || !uploadedBase64Files.length || isSubmitting;

  const uploadFiles = (files: File[]) => {
    setUploadedFiles(files);
  };

  const uploadBase64Files = (files: FileBase64Type[]) => {
    setUploadedBase64Files(files);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setUploadedFilesError(false);

    const canvasScaled = editor.getImageScaledToCanvas();
    const croppedImg = canvasScaled.toDataURL();

    return uploadCompanyLogo({
      imageBase64String: croppedImg,
      filenameOriginal: uploadedBase64Files[0].filenameOriginal,
      userUuid: getCurrentUuid(),
    })
      .then(() => {
        refreshUser();
        queryClient.invalidateQueries({
          queryKey: [getUserQueryKey, delegateQueryKey],
        });
        useStore.setState({ refreshUserAppWrapper: true });
        setIsSubmitting(false);
        return new Promise((resolve, reject) => {
          resolve(201);
        });
      })
      .catch((err) => {
        throwError(err);
        setIsSubmitting(false);
      });
  };

  const [zoom, setZoom] = useState(1);

  const setEditorRef = (ed: any) => {
    editor = ed;
  };

  return (
    <>
      <div className="block mb-8 text-lg font-bold md:text-xl lg:text-2xl font-custom1">
        <HeaderSplitPrimaryButton label={t('company-logo')} />
        <div className="mt-2 text-lg font-normal md:text-2xl font-custom1 text-inputGray">
          {t('minimum-brand-image-text')}
        </div>
      </div>
      {!isSubmitting ? (
        <div>
          <div className="mt-10 mb-10">
            <FileUploadField
              uploadFiles={uploadFiles}
              uploadBase64Files={uploadBase64Files}
              files={uploadedFiles}
              isBase64={true}
              acceptedFileTypes={onlyImages}
              allowMultiple={false}
              numberOfFiles={1}
              errorFileTypeText={t('errors:only-images-accepted')}
              errorText={
                uploadedFilesError
                  ? t('errors:you-need-to-upload-at-least-one-file')
                  : ''
              }
              // photoMinWidth={100}
              // photoMinHeight={100}
            />
          </div>
          {uploadedFiles.length > 0 && (
            <div className="flex flex-col items-center justify-center w-full mb-20">
              <AvatarEditor
                ref={setEditorRef}
                image={uploadedFiles[0]}
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
          <div className="flex items-center justify-center my-10">
            <ModalDismissAsyncButton>
              <Button
                onClick={handleSubmit}
                disabled={disabledButton}
                className="my-2 mr-2"
              >
                {t('submit')}
              </Button>
            </ModalDismissAsyncButton>
          </div>
        </div>
      ) : (
        <CircleLoaderSpinner className="mt-10" size={250} />
      )}
    </>
  );
};

export default CompanyLogoFileUpload;
