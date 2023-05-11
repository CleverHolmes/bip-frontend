import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginFileMetadata from 'filepond-plugin-file-metadata';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import React from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import { FilePondFile } from 'filepond';
// import { Trans } from 'next-i18next';

import Paper from 'components/Paper';
import { postItemImageBase64 } from 'api/item/postItemImageBase64';
import { onlyImages, onlyDocuments } from 'constants/acceptedFiles';
import { postItemDocumentBase64Call } from 'api/item/postItemDocumentBase64';
import { throwError } from 'utils/error';
// import InfoBox from 'components/InfoBox';
// import { ValidateImg } from 'public/helpers/validateImage';

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileEncode,
  FilePondPluginFileMetadata
);

interface UploadProps {
  setFiles: any;
  files: string[];
  cover?: boolean;
  itemUUID: string;
  numberOfFiles?: number;
  refresh?: any;
  // photoMinWidth?: number;
  // photoMinHeight?: number;
  postType?: 'document' | 'image';
}

const MultipleFileUploadField: React.FC<UploadProps> = ({
  setFiles,
  files,
  cover,
  itemUUID,
  numberOfFiles,
  refresh,
  postType,
  // photoMinWidth,
  // photoMinHeight,
}) => {
  // const [sizeError, setSizeError] = useState<any>('');

  const handleUpdateFiles = (props: FilePondFile[]) => {
    const data: File[] = props.map((item) => item.file as File);
    // if (postType === 'image') {
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
    setFiles(data);
  };

  const addFile = async (error: any, filePondFile: any) => {
    const item = {
      filename_original: filePondFile.filename,
      item_uuid: filePondFile.getMetadata().item_uuid,
      fileContentsBase64String: filePondFile.getFileEncodeBase64String(),
    };

    try {
      if (postType === 'document') {
        await postItemDocumentBase64Call(item);
      }
      // else if (!!photoMinWidth || !!photoMinHeight) {
      //   let validated;
      //   await ValidateImg(
      //     filePondFile.file as File,
      //     (meta) => {
      //       if (meta === 'correct') {
      //         validated = true;
      //         return true;
      //       } else {
      //         return false;
      //       }
      //     },
      //     photoMinWidth,
      //     photoMinHeight
      //   );
      //   validated && (await postItemImageBase64(item));
      // }
      else {
        await postItemImageBase64(item);
      }
      refresh();
    } catch (err) {
      throwError(err);
    }
  };

  return (
    <>
      {/* {sizeError && (
        <InfoBox text={sizeError} smaller color="redButton" warning />
      )} */}
      <Paper>
        <FilePond
          files={files && files}
          allowFileMetadata={true}
          dropOnPage={true}
          onupdatefiles={handleUpdateFiles}
          onaddfile={addFile}
          instantUpload={false}
          allowMultiple={true}
          maxFiles={cover ? 1 : numberOfFiles ? numberOfFiles : 5}
          acceptedFileTypes={
            postType === 'document' ? onlyDocuments : onlyImages
          }
          fileMetadataObject={{
            item_uuid: itemUUID,
          }}
          name="file"
          labelIdle={`Drag & Drop your ${
            cover ? 'file' : 'files'
          } or <span className="filepond--label-action">Browse</span><br/>
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
    </>
  );
};

export default MultipleFileUploadField;
