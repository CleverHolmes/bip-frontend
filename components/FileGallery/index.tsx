import { MessageAttachmentAlternate } from 'models/messages/message';
import UploadedFileSmaller from 'components/UploadedFileSmaller';

interface FileGalleryProps {
  files: MessageAttachmentAlternate[];
}

const FileGallery: React.FC<FileGalleryProps> = ({ files }) => {
  return (
    <div className="flex flex-wrap">
      {files.map((file: MessageAttachmentAlternate) => {
        return (
          <UploadedFileSmaller
            image={file.uri}
            title={
              file.filenameOriginal
                ? file.filenameOriginal
                : file.filename_original
            }
            uri={file.uri}
            deleteCapable={false}
            key={file.uri}
          />
        );
      })}
    </div>
  );
};

export default FileGallery;
