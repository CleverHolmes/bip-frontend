import { useTranslation } from 'next-i18next';
import * as _ from 'lodash';
import React, { useState } from 'react';

import { ModalDismissAsyncButton } from 'components/ModalWindow';
import Button from 'components/Buttons/Button';
import useStore from 'modules/Store';
import FileUploadField, { FileBase64Type } from 'components/FileUploadField';
import { postUserPropertyListFileBase64Call } from 'api/user/postUserPropertyListFileBase64';
import CircleLoaderSpinner from 'components/CircleLoaderSpinner';
import useTokensOrCookies from 'contexts/TokensOrCookies';

interface Props {
  refreshUser: () => void;
}

const UploadProperty: React.FC<Props> = ({ refreshUser }) => {
  const userUUID = useStore((state) => state.userUUID);
  const { t } = useTranslation();
  const { companyRepresented } = useTokensOrCookies();
  const [propertiesError, setPropertiesError] = useState<any>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedBase64Files, setUploadedBase64Files] = useState<
    FileBase64Type[]
  >([]);
  const [uploadedFilesError, setUploadedFilesError] = useState(false);

  const uploadFiles = (files: File[]) => {
    if (files.length) {
      setUploadedFilesError(false);
    }

    setUploadedFiles(files);
  };

  const uploadBase64Files = (files: FileBase64Type[]) => {
    setUploadedBase64Files(files);
  };

  const post = async () => {
    setIsSubmitting(true);
    setIsDisabled(true);

    try {
      await postUserPropertyListFileBase64Call({
        fileBase64String: uploadedBase64Files[0].fileContentsBase64String,
        filename_original: uploadedBase64Files[0].filenameOriginal,
        user_uuid: companyRepresented ? companyRepresented : userUUID,
      });
      refreshUser();
      setIsSubmitting(false);
      setIsDisabled(false);
      useStore.setState({ refreshUser: true });
      return new Promise((resolve, reject) => {
        resolve(201);
      });
    } catch (err: any) {
      setIsSubmitting(false);
      setIsDisabled(false);
      setPropertiesError(JSON.parse(err.request.response).message);
    }
  };

  return (
    <>
      <div className="mt-2 mb-4 text-3xl text-center text-inputGray font-custom3">
        Upload a file with your properties
      </div>
      <div className="px-4 py-4 my-5 text-base text-white rounded-lg font-custom1 lg:text-lg bg-button">
        We will verify that you own these properties before you can list a
        property on BIP
      </div>
      {!isSubmitting ? (
        <>
          <FileUploadField
            uploadFiles={uploadFiles}
            uploadBase64Files={uploadBase64Files}
            files={uploadedFiles}
            isBase64
            // acceptedFileTypes={onlyDocuments}
            numberOfFiles={6}
            errorText={
              uploadedFilesError
                ? t('errors:you-need-to-upload-at-least-one-file')
                : ''
            }
          />

          <div className="h-4 mt-2 ml-4 text-sm text-red-400 font-custom2">
            {propertiesError && propertiesError}
          </div>
          <div className="flex items-center justify-center my-10">
            <ModalDismissAsyncButton>
              <Button
                disabled={isDisabled || uploadedFiles.length === 0}
                onClick={post}
              >
                {t('submit')}
              </Button>
            </ModalDismissAsyncButton>
          </div>
        </>
      ) : (
        <CircleLoaderSpinner size={500} />
      )}
    </>
  );
};

export default UploadProperty;
