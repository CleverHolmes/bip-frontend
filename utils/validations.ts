import * as Yup from 'yup';

const firstName = Yup.string()
  .required('errors:field-is-required')
  .matches(/^[a-zA-Z0-9_ ]+$/, 'errors:dont-allow-special-characters');

const lastName = Yup.string()
  .required('errors:field-is-required')
  .matches(/^[a-zA-Z0-9_ ]+$/, 'errors:dont-allow-special-characters');

const roles = Yup.array()
  .min(1, 'errors:at-least-one-must-be-selected')
  .required('errors:field-is-required');

const companyName = Yup.string()
  .required('errors:field-is-required')
  .matches(/^[a-zA-Z0-9_ ]+$/, 'errors:dont-allow-special-characters');

const email = Yup.string()
  .trim()
  .required('errors:field-is-required')
  .matches(
    /(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gm,
    'Email is invalid'
  );

const confirmEmail = Yup.string()
  .required('errors:field-is-required')
  .oneOf([Yup.ref('email'), ''], 'errors:emails-dont-match');

const password = Yup.string()
  .required('errors:field-is-required')
  .min(6, 'errors:password-min-characters')
  .max(40, 'errors:password-max-characters');

const confirmPassword = Yup.string()
  .required('errors:field-is-required')
  .oneOf([Yup.ref('password'), ''], 'errors:passwords-dont-match');

const newPassword = Yup.string()
  .required('errors:field-is-required')
  .min(6, 'errors:password-min-characters')
  .max(40, 'errors:password-max-characters')
  .notOneOf([Yup.ref('password'), ''], 'errors:passwords-match');

const confirmNewPassword = Yup.string()
  .required('errors:field-is-required')
  .oneOf([Yup.ref('newPassword'), ''], 'errors:passwords-dont-match');

const acceptTerms = Yup.bool().oneOf([true], 'errors:accept-terms-is-required');

const mustBeYes = Yup.string().oneOf(['yes'], 'errors:answer-must-be-yes');

const youtubeMedia = Yup.string().matches(
  /^http(?:s?):\/\/(?:www\.)?youtu(?:\.be\/|be.com\/\S*(?:embed)(?:(?:(?=\/[-a-zA-Z0-9_]{11,}(?!\S))\/)|(?:\S*v=|v\/)))([-a-zA-Z0-9_]{11,})?$/,
  {
    message: 'errors:wrong-youtube-url',
    excludeEmptyString: true,
  }
);

const requiredStringField = Yup.string().required('errors:field-is-required');
const requiredNumberField = Yup.number().required('errors:field-is-required');
const requiredDropdownField = Yup.object().required('errors:field-is-required');
const requiredUSZipCodeField = Yup.string()
  .required('errors:field-is-required')
  .matches(/^[0-9]+$/, 'errors:only-digits')
  .min(5, 'errors:exactly-5-digits')
  .max(5, 'errors:exactly-5-digits');

const validations = {
  firstName,
  lastName,
  roles,
  companyName,
  email,
  confirmEmail,
  password,
  confirmPassword,
  newPassword,
  confirmNewPassword,
  acceptTerms,
  mustBeYes,
  youtubeMedia,
  requiredStringField,
  requiredNumberField,
  requiredDropdownField,
  requiredUSZipCodeField,
};

export default validations;
