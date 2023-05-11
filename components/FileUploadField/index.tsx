import React, { useState, useEffect } from 'react';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { FilePond, registerPlugin } from 'react-filepond';
import { FilePondFile, FilePondErrorDescription } from 'filepond';
import {
  // Trans,
  useTranslation,
} from 'next-i18next';

import Paper from 'components/Paper';
// import InfoBox from 'components/InfoBox';
// import { ValidateImg } from 'public/helpers/validateImage';

registerPlugin(
  FilePondPluginFileEncode,
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
);

export type FileBase64Type = {
  filenameOriginal: string;
  fileContentsBase64String: string;
};
export type FilePondFilesType = {
  id: any;
  string?: FilePondFile | undefined;
};

interface UploadProps {
  uploadFiles: (files: File[]) => void;
  uploadBase64Files?: (files: FileBase64Type[]) => void;
  files: File[];
  acceptedFileTypes?: string[];
  allowMultiple?: boolean;
  isBase64?: boolean;
  numberOfFiles?: number;
  errorFileTypeText?: string;
  errorText?: string;
  // photoMinWidth?: number;
  // photoMinHeight?: number;
  photoSize?: 'coverImage' | 'image' | 'logo' | 'document';
  smaller?: boolean;
}

const MultipleFileUploadField: React.FC<UploadProps> = ({
  uploadFiles,
  uploadBase64Files,
  files,
  acceptedFileTypes,
  allowMultiple = true,
  isBase64 = false,
  numberOfFiles = 1,
  errorFileTypeText,
  errorText,
  smaller,
  // photoMinWidth,
  // photoMinHeight,
}) => {
  const { t } = useTranslation();
  const [filePondFiles, setFilePondFiles] = useState<FilePondFilesType | {}>(
    {}
  );
  // const [sizeError, setSizeError] = useState<any>('');

  useEffect(() => {
    if (!filePondFiles) return;
    if (isBase64 && uploadBase64Files) {
      const data: FileBase64Type[] = Object.values(filePondFiles).map(
        (item: FilePondFile) => ({
          filenameOriginal: item?.filename,
          // @ts-ignore
          fileContentsBase64String: item.getFileEncodeBase64String(),
        })
      );
      uploadBase64Files(data);
    }
  }, [filePondFiles]);

  const handleUpdateFiles = (props: FilePondFile[]) => {
    const data: File[] = props.map((item) => item.file as File);
    // if (!!photoMinWidth && !!photoMinHeight) {
    //   for (let i = data.length - 1; i >= 0; i--) {
    //     await ValidateImg(
    //       data[i] as File,
    //       (meta) => {
    //         if (meta === 'correct') {
    //           return true;
    //         } else {
    //           setSizeError(
    //             <Trans i18nKey="photo-minimum-size">
    //               Every photo must adhere to the required minimum width of
    //               {{ photoMinWidth }}px and height of {{ photoMinHeight }}px
    //             </Trans>
    //           );
    //           data.splice(i, 1);
    //           return false;
    //         }
    //       },
    //       photoMinWidth,
    //       photoMinHeight
    //     );
    //   }
    // }
    uploadFiles(data);
  };
  const handleAddFile = (
    error: FilePondErrorDescription | null,
    file: FilePondFile
  ) => {
    if (!error) {
      setFilePondFiles((currentState) => ({
        ...currentState,
        [file.id]: file,
      }));
    }
  };

  const handleRemoveFile = (
    error: FilePondErrorDescription | null,
    file: FilePondFile
  ) => {
    if (!error) {
      const updatedFilePondFiles: FilePondFilesType | {} = { ...filePondFiles };
      // @ts-ignore
      const updatedFileName = updatedFilePondFiles[file.id]?.file?.name;
      // @ts-ignore
      delete updatedFilePondFiles[file.id];
      setFilePondFiles(updatedFilePondFiles);
      const filteredFiles = files.filter(
        (item) => item.name !== updatedFileName
      );
      uploadFiles(filteredFiles);
    }
  };

  return (
    <>
      <Paper className={`${smaller ? 'lg:!py-10' : ''}`}>
        <FilePond
          files={files}
          allowFileMetadata={true}
          dropOnPage={true}
          onupdatefiles={handleUpdateFiles}
          instantUpload={false}
          allowMultiple={allowMultiple}
          checkValidity={true}
          onaddfile={handleAddFile}
          onremovefile={handleRemoveFile}
          allowFileEncode={true}
          maxFiles={numberOfFiles}
          acceptedFileTypes={acceptedFileTypes}
          labelFileTypeNotAllowed={t('errors:file-type-invalid')}
          fileValidateTypeLabelExpectedTypes={
            errorFileTypeText || t('errors:only-documents-accepted')
          }
          name="file"
          maxParallelUploads={1}
          labelIdle={`${t(
            'drag-and-drop-files-or'
          )} <span className="filepond--label-action">${t(
            'browse-button'
          )}</span><br/>
          <span class="upload-file-icon">
            <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg" class="upload-file-icon">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M30.4526 19.885V19.63C30.4526 15.975 27.5677 13 23.9409 13C21.2208 13 18.9953 14.7 18.0062 17.08C17.5117 16.825 17.0171 16.74 16.4401 16.74C14.2146 16.74 12.4837 18.525 12.4837 20.82V21.245C11.577 22.095 11 23.37 11 24.815C11 27.705 13.2255 30 16.028 30H28.9689C31.7714 30 33.9969 27.705 33.9969 24.815C34.0793 22.52 32.5132 20.48 30.4526 19.885ZM25.1773 23.88L23.0342 26.005L22.9518 26.09C22.8694 26.175 22.7045 26.175 22.6221 26.175H22.5397C22.3748 26.175 22.21 26.09 22.0451 25.92L19.902 23.795C19.5723 23.455 19.5723 23.03 19.902 22.69C20.2317 22.35 20.6439 22.35 20.9736 22.69L21.8802 23.625V19.545C21.8802 19.12 22.21 18.78 22.6221 18.78C23.0342 18.78 23.3639 19.12 23.3639 19.545V23.625L24.2706 22.775C24.6003 22.435 25.0124 22.435 25.3421 22.775C25.6719 23.115 25.507 23.625 25.1773 23.88Z" fill="url(#paint0_linear_2283_26061)"/>
              <defs>
                <linearGradient id="paint0_linear_2283_26061" x1="21.9241" y1="18.0947" x2="12.3702" y2="34.5897" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#79C9E7"/>
                  <stop offset="1" stop-color="#887EF1"/>
                </linearGradient>
              </defs>
            </svg>        
          </span>
        `}
          credits={false}
        />
      </Paper>
      {/* {sizeError && (
        <InfoBox text={sizeError} smaller color="redButton" warning />
      )} */}
      {errorText && (
        <div className="h-4 mt-4 mb-2 ml-4 text-sm text-red-400 font-custom2">
          *{errorText}
        </div>
      )}
    </>
  );
};

export default MultipleFileUploadField;
