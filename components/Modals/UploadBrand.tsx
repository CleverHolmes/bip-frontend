import { useTranslation, Trans } from 'next-i18next';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import Slider from 'rc-slider';
import AvatarEditor from 'react-avatar-editor';

import FileUploadField, { FileBase64Type } from 'components/FileUploadField';
import { onlyDocuments, onlyImages } from 'constants/acceptedFiles';
import Button from 'components/Buttons/Button';
import CircleLoaderSpinner from 'components/CircleLoaderSpinner';
import { throwError } from 'utils/error';
import { postItemDocumentBase64Call } from 'api/item/postItemDocumentBase64';
import { postItemImageBase64 } from 'api/item/postItemImageBase64';
import { postItemBannerImageBase64Call } from 'api/item/postItemBannerImageBase64Call';
import { postItemLogoImageBase64Call } from 'api/item/postItemLogoImageBase64Call';
import { findItemsQueryKey } from 'api/item/findItems';

interface Props {
  closeModal: () => void;
  max?: number;
  itemUuid?: string;
  refresh: () => void;
  postType?: 'document' | 'image' | 'logo' | 'coverImage';
}

const UploadBrand: React.FC<Props> = ({
  closeModal,
  refresh,
  postType,
  itemUuid,
  max,
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setUploadedFilesError(false);

    try {
      if (postType === 'logo') {
        if (!itemUuid) return;
        const canvasScaled = editor.getImageScaledToCanvas();
        const croppedImg = canvasScaled.toDataURL();
        const item = {
          fileContentsBase64String: croppedImg,
          filename_original: uploadedBase64Files[0].filenameOriginal,
          item_uuid: itemUuid,
        };
        await postItemLogoImageBase64Call(item);
        queryClient.invalidateQueries({
          queryKey: [findItemsQueryKey],
        });
        refresh();
      } else if (postType === 'document') {
        if (!itemUuid) return;
        for (let i = 0; i < uploadedBase64Files.length; i++) {
          const item = {
            fileContentsBase64String:
              uploadedBase64Files[i].fileContentsBase64String,
            filename_original: uploadedBase64Files[i].filenameOriginal,
            item_uuid: itemUuid,
          };
          await postItemDocumentBase64Call(item);
        }
        refresh();
      } else if (postType === 'image') {
        if (!itemUuid) return;
        for (let i = 0; i < uploadedBase64Files.length; i++) {
          const item = {
            fileContentsBase64String:
              uploadedBase64Files[i].fileContentsBase64String,
            filename_original: uploadedBase64Files[i].filenameOriginal,
            item_uuid: itemUuid,
          };
          await postItemImageBase64(item);
        }
        refresh();
      } else if (postType === 'coverImage') {
        if (!itemUuid) return;
        const canvasScaled = editor.getImageScaledToCanvas();
        const croppedImg = canvasScaled.toDataURL();

        const item = {
          fileContentsBase64String: croppedImg,
          filename_original: uploadedBase64Files[0].filenameOriginal,
          item_uuid: itemUuid,
        };
        await postItemBannerImageBase64Call(item);
        refresh();
      }
    } catch (err) {
      throwError(err);
    } finally {
      setIsSubmitting(false);
      handleClose();
    }
  };

  const handleClose = () => {
    closeModal();
    setUploadedFiles([]);
    setUploadedBase64Files([]);
  };

  const [zoom, setZoom] = useState(1);

  const setEditorRef = (ed: any) => {
    editor = ed;
  };

  return (
    <>
      {!!max && postType === 'image' && (
        <div className="mt-2 text-xl font-normal md:text-3xl font-custom1 text-inputGray">
          <Trans i18nKey="number-of-upload-photos-left" max={max}>
            You can upload {{ max }} more photos
          </Trans>
        </div>
      )}
      {!isSubmitting && (
        <div>
          <div className="mt-10 mb-10">
            <FileUploadField
              uploadFiles={uploadFiles}
              uploadBase64Files={uploadBase64Files}
              files={uploadedFiles}
              isBase64={true}
              acceptedFileTypes={
                postType === 'document' ? onlyDocuments : onlyImages
              }
              allowMultiple={postType === 'logo' || max === 1 ? false : true}
              numberOfFiles={
                postType === 'logo' ? 1 : postType === 'document' ? 100 : max
              }
              errorFileTypeText={
                postType === 'document'
                  ? t('errors:only-documents-accepted')
                  : t('errors:only-images-accepted')
              }
              errorText={
                uploadedFilesError
                  ? t('errors:you-need-to-upload-at-least-one-file')
                  : ''
              }
              // photoMinWidth={
              //   postType === 'coverImage'
              //     ? 1200
              //     : postType === 'image'
              //     ? 300
              //     : postType === 'logo'
              //     ? 400
              //     : undefined
              // }
              // photoMinHeight={
              //   postType === 'coverImage'
              //     ? 400
              //     : postType === 'image'
              //     ? 200
              //     : postType === 'logo'
              //     ? 400
              //     : undefined
              // }
            />
          </div>

          {uploadedFiles.length > 0 &&
            (postType === 'coverImage' || postType === 'logo') && (
              <div className="flex flex-col items-center justify-center mb-20">
                <AvatarEditor
                  ref={setEditorRef}
                  image={uploadedFiles[0]}
                  width={postType === 'coverImage' ? 1200 : 800}
                  height={postType === 'coverImage' ? 250 : 800}
                  border={50}
                  color={[255, 255, 255, 0.6]} // RGBA
                  scale={zoom}
                  rotate={0}
                  className={
                    postType === 'coverImage' ? 'canvasAvatar' : 'logoAvatar'
                  }
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
          <div
            className={
              '!z-50 sm:fixed sm:left-0 sm:bottom-0 w-full  !bg-white !border-t-2 border-borderColor rounded-t-xl drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]'
            }
          >
            <div className="flex items-center justify-end px-4 pt-5 pb-5 sm:px-10 lg:container lg:mx-auto">
              <Button
                onClick={handleSubmit}
                disabled={disabledButton}
                className="my-2 mr-2"
              >
                {t('submit')}
              </Button>
            </div>
          </div>
        </div>
      )}
      {isSubmitting && <CircleLoaderSpinner size={250} className="mt-10" />}
    </>
  );
};

export default UploadBrand;
