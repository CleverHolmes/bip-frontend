import React, { useRef } from 'react';

type Props = {
  uploadButton: JSX.Element;
  uploadCallback: (files: FileList) => void;
  className: string;
};

const FileUploader: React.FC<Props> = ({
  uploadButton,
  uploadCallback,
  className,
}) => {
  const hiddenFileInput = useRef(null);

  const handleClick = () => {
    // @ts-ignore
    hiddenFileInput.current.value = null;
    // @ts-ignore
    hiddenFileInput.current.click();
  };

  const handleChange = (event: React.BaseSyntheticEvent) => {
    uploadCallback(event.target.files);
  };

  return (
    <div className={className} onClick={handleClick}>
      {uploadButton}
      <input
        type="file"
        multiple
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default FileUploader;
