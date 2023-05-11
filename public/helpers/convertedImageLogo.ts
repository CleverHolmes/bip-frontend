export const convertedImageLogo = (itemURI: string) => {
  if (itemURI.match(/\.(jpeg|jpg|png|gif)/g)) {
    return itemURI;
  } else if (itemURI.match(/\.(ai)/g) != null) {
    return '/images/Vault/AI.svg';
  } else if (itemURI.match(/\.(avi)/g) != null) {
    return '/images/Vault/AVI.svg';
  } else if (itemURI.match(/\.(doc|docx)/g) != null) {
    return '/images/Vault/DOC.svg';
  } else if (itemURI.match(/\.(dwg)/g) != null) {
    return '/images/Vault/DWG.svg';
  } else if (itemURI.match(/\.(eps)/g) != null) {
    return '/images/Vault/EPS.svg';
  } else if (itemURI.match(/\.(html)/g) != null) {
    return '/images/Vault/HTML.svg';
  } else if (itemURI.match(/\.(css)/g) != null) {
    return '/images/Vault/CSS.svg';
  } else if (itemURI.match(/\.(mp3)/g) != null) {
    return '/images/Vault/MP3.svg';
  } else if (itemURI.match(/\.(pdf)/g) != null) {
    return '/images/Vault/PDF.svg';
  } else if (itemURI.match(/\.(psd)/g) != null) {
    return '/images/Vault/PSD.svg';
  } else if (itemURI.match(/\.(video|mp4)/g) != null) {
    return '/images/Vault/MP4.svg';
  } else if (itemURI.match(/\.(xls)/g) != null) {
    return '/images/Vault/XLS.svg';
  } else if (itemURI.match(/\.(zip)/g) != null) {
    return '/images/Vault/ZIP.svg';
  } else if (itemURI.match(/\.(raw)/g) != null) {
    return '/images/Vault/RAW.svg';
  } else if (itemURI.match(/\.(ppt)/g) != null) {
    return '/images/Vault/PPT.svg';
  } else if (itemURI.match(/\.(js)/g) != null) {
    return '/images/Vault/JS.svg';
  } else if (itemURI.match(/\.(gelse if)/g) != null) {
    return '/images/Vault/Gelse if.svg';
  } else if (itemURI.match(/\.(iso)/g) != null) {
    return '/images/Vault/ISO.svg';
  } else {
    return '/images/Vault/other.svg';
  }
};
