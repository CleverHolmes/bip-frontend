export const ValidateImg = (
  file: File,
  cb: (str: string) => boolean,
  photoMinWidth?: number,
  photoMinHeight?: number
) => {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.src = window.URL.createObjectURL(file);
    img.onload = () => {
      if (!photoMinWidth || !photoMinHeight) return;
      if (img.width >= photoMinWidth && img.height >= photoMinHeight) {
        resolve(cb('correct'));
        return true;
      }
      resolve(cb('incorrect'));
      return true;
    };
  });
};
