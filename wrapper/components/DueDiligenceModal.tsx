import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { getCountryCallingCode, CountryCode } from 'libphonenumber-js';
import { useCookies } from 'react-cookie';

import validations from 'utils/validations';
import Button from 'components/Buttons/Button';
import Input from 'components/Input';
import Modal from 'components/new/Modal';
import RadioButtonField from 'views/ProductView/components/RadioButtonField';
import FileUploadField, { FileBase64Type } from 'components/FileUploadField';
import { onlyDocuments } from 'constants/acceptedFiles';
import HeaderSplitPrimaryButton from 'components/HeaderSplitPrimaryButton';
import CircleLoaderSpinner from 'components/CircleLoaderSpinner';
import { dueDiligenceQuestionnaireCall } from 'api/user/dueDiligenceQuestionnaire';
import { DueDiligenceQuestionnaireRequest } from 'models/user/dueDiligenceQuestionnaire';
import Dropdown from 'components/new/Dropdown';
import { states, StateType } from 'constants/states';
import { countries, defaultCountry, CountryType } from 'constants/countries';
import { getCurrentUuid } from 'utils/getCurrentUuid';
import 'yup-phone-lite';
import DueDiligenceCongratsModal from 'wrapper/components/DueDiligenceCongratsModal';
import useStore from 'modules/Store';
import { AccountFlags } from 'models/user/user';
import { COOKIE_CONSENT } from 'hooks/useAuth';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export type DueDiligenceFormProps = {
  dueDiligenceAgencyActingBehalfCompany: string;
  dueDiligenceAgencyActingBehalfCompanyName: string;
  dueDiligenceActiveInsurancePol: string;
  dueDiligenceDbas: string;
  dueDiligenceActiveInsurancePolLackDetails: string;
  dueDiligenceSpecialtyCertifications: string;
  dueDiligenceAttestTrueAndCorrect: string;
  dueDiligenceCompanyAddressLine_1: string;
  dueDiligenceCompanyAddressLine_2: string;
  dueDiligenceCompanyAddressCity: string;
  dueDiligenceCompanyAddressState: StateType;
  dueDiligenceCompanyAddressZipCode: string;
  dueDiligenceCompanyAddressCountry: CountryType;
  dueDiligenceCompanyPhoneNumberCountryCode: CountryType;
  dueDiligenceCompanyPhoneNumber: string;
};

const DueDiligenceModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [cookies, setCookie] = useCookies([COOKIE_CONSENT]);

  const isDueDiligenceCongratsModalOpen = useStore(
    (state) => state.isDueDiligenceCongratsModalOpen
  );
  const updateDueDiligenceCongratsModalOpen = useStore(
    (state) => state.updateDueDiligenceCongratsModalOpen
  );
  const addAccountFlag = useStore((state) => state.addAccountFlag);

  const [
    uploadedAgencyActingBehalfCompanyFiles,
    setUploadedAgencyActingBehalfCompanyFiles,
  ] = useState<File[]>([]);
  const [
    uploadedBase64AgencyActingBehalfCompanyFiles,
    setUploadedBase64AgencyActingBehalfCompanyFiles,
  ] = useState<FileBase64Type[]>([]);

  const [uploadedInsurancePolFiles, setUploadedInsurancePolFiles] = useState<
    File[]
  >([]);
  const [uploadedBase64InsurancePolFiles, setUploadedBase64InsurancePolFiles] =
    useState<FileBase64Type[]>([]);
  const [uploadedInsurancePolFilesError, setUploadedInsurancePolFilesError] =
    useState(false);

  const [uploadedBusinessLicenseFiles, setUploadedBusinessLicenseFiles] =
    useState<File[]>([]);
  const [
    uploadedBase64BusinessLicenseFiles,
    setUploadedBase64BusinessLicenseFiles,
  ] = useState<FileBase64Type[]>([]);
  const [
    uploadedBusinessLicenseFilesError,
    setUploadedBusinessLicenseFilesError,
  ] = useState(false);

  const [
    uploadedSpecialtyCertificationsFiles,
    setUploadedSpecialtyCertificationsFiles,
  ] = useState<File[]>([]);
  const [
    uploadedBase64SpecialtyCertificationsFiles,
    setUploadedBase64SpecialtyCertificationsFiles,
  ] = useState<FileBase64Type[]>([]);
  const [
    uploadedSpecialtyCertificationsFilesError,
    setUploadedSpecialtyCertificationsFilesError,
  ] = useState(false);

  const [countryCode, setCountryCode] = useState<CountryCode>();
  const [countryPhoneCode, setCountryPhoneCode] = useState('');

  const { isLoading: isSubmitting, mutate: sendDueDiligenceQuestionnaire } =
    useMutation(
      async (data: DueDiligenceQuestionnaireRequest) => {
        return await dueDiligenceQuestionnaireCall(data);
      },
      {
        onSuccess: () => {
          updateDueDiligenceCongratsModalOpen(true);
          addAccountFlag(AccountFlags.DUE_DILIGENCE_QUESTIONNAIRE_SUBMITTED);
        },
      }
    );

  const validateSubFields = (value: string) => ({
    is: value,
    then: validations.requiredStringField,
  });
  const validationSchema = Yup.object().shape({
    dueDiligenceAgencyActingBehalfCompanyName: Yup.string().when(
      'dueDiligenceAgencyActingBehalfCompany',
      validateSubFields('yes')
    ),
    dueDiligenceActiveInsurancePolLackDetails: Yup.string().when(
      'dueDiligenceActiveInsurancePol',
      validateSubFields('no')
    ),
    dueDiligenceDbas: validations.requiredStringField,
    dueDiligenceAttestTrueAndCorrect: validations.mustBeYes,
    dueDiligenceCompanyAddressLine_1: validations.requiredStringField,
    dueDiligenceCompanyAddressCity: validations.requiredStringField,
    dueDiligenceCompanyAddressZipCode: Yup.string().when(
      'dueDiligenceCompanyAddressCountry.value',
      {
        is: 'US',
        then: validations.requiredUSZipCodeField,
        otherwise: validations.requiredStringField,
      }
    ),
    dueDiligenceCompanyAddressState: Yup.object()
      .shape({
        value: Yup.string(),
        name: Yup.string(),
      })
      .default(undefined)
      .when('dueDiligenceCompanyAddressCountry.value', {
        is: 'US',
        then: validations.requiredDropdownField,
      }),
    dueDiligenceCompanyPhoneNumber: Yup.string()
      .phone(countryCode, 'errors:wrong-phone-number')
      .required('errors:field-is-required'),
  });

  const radioItems = [
    { label: t('yes'), value: 'yes' },
    { label: t('no'), value: 'no' },
  ];

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<DueDiligenceFormProps>({
    defaultValues: {
      dueDiligenceAgencyActingBehalfCompany: 'no',
      dueDiligenceActiveInsurancePol: 'yes',
      dueDiligenceSpecialtyCertifications: 'no',
      dueDiligenceAttestTrueAndCorrect: 'no',
      dueDiligenceCompanyAddressCountry: defaultCountry,
      dueDiligenceCompanyPhoneNumberCountryCode: defaultCountry,
    },
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema),
  });

  const dueDiligenceAgencyActingBehalfCompany = watch(
    'dueDiligenceAgencyActingBehalfCompany'
  );
  const dueDiligenceActiveInsurancePol = watch(
    'dueDiligenceActiveInsurancePol'
  );
  const dueDiligenceSpecialtyCertifications = watch(
    'dueDiligenceSpecialtyCertifications'
  );
  const dueDiligenceCompanyPhoneNumberCountryCode = watch(
    'dueDiligenceCompanyPhoneNumberCountryCode'
  );
  const dueDiligenceCompanyPhoneNumber = watch(
    'dueDiligenceCompanyPhoneNumber'
  );
  const dueDiligenceCompanyAddressCountry: CountryType = watch(
    'dueDiligenceCompanyAddressCountry'
  );

  const isUS = dueDiligenceCompanyAddressCountry?.value === 'US';

  useEffect(() => {
    if (
      dueDiligenceCompanyPhoneNumberCountryCode &&
      !dueDiligenceCompanyPhoneNumber
    ) {
      setValue(
        'dueDiligenceCompanyPhoneNumberCountryCode',
        dueDiligenceCompanyAddressCountry
      );
    }
  }, [dueDiligenceCompanyAddressCountry]);

  useEffect(() => {
    if (dueDiligenceCompanyPhoneNumberCountryCode) {
      setCountryCode(dueDiligenceCompanyPhoneNumberCountryCode.value);
      setCountryPhoneCode(
        `+${getCountryCallingCode(
          dueDiligenceCompanyPhoneNumberCountryCode.value
        )}`
      );
    }
  }, [dueDiligenceCompanyPhoneNumberCountryCode]);

  const uploadFiles = (
    files: File[],
    setFiles: (data: File[]) => void,
    setError?: (error: boolean) => void
  ) => {
    if (files.length && setError) {
      setError(false);
    }

    setFiles(files);
  };

  const uploadBase64Files = (
    files: FileBase64Type[],
    setFiles: (data: FileBase64Type[]) => void
  ) => {
    setFiles(files);
  };

  const onCloseCongratsModal = () => {
    updateDueDiligenceCongratsModalOpen(false);
    onClose();
  };

  const onSubmit = (data: DueDiligenceFormProps) => {
    if (
      uploadedInsurancePolFilesError ||
      uploadedBusinessLicenseFilesError ||
      uploadedSpecialtyCertificationsFilesError
    ) {
      return;
    }

    const finalData: DueDiligenceQuestionnaireRequest = {
      ...data,
      userUuid: getCurrentUuid(),
      dueDiligenceAgencyActingBehalfCompany:
        data.dueDiligenceAgencyActingBehalfCompany === 'yes',
      dueDiligenceAgencyActingBehalfCompanyBase64:
        uploadedBase64AgencyActingBehalfCompanyFiles?.[0]
          ?.fileContentsBase64String || '',
      dueDiligenceAgencyActingBehalfCompanyBase64Filename:
        uploadedBase64AgencyActingBehalfCompanyFiles?.[0]?.filenameOriginal ||
        '',
      dueDiligenceActiveInsurancePol:
        data.dueDiligenceActiveInsurancePol === 'yes',
      dueDiligenceActiveInsurancePolBase64:
        uploadedBase64InsurancePolFiles?.[0]?.fileContentsBase64String || '',
      dueDiligenceActiveInsurancePolBase64Filename:
        uploadedBase64InsurancePolFiles?.[0]?.filenameOriginal || '',
      dueDiligenceBusinessLicenseBase64:
        uploadedBase64BusinessLicenseFiles[0].fileContentsBase64String,
      dueDiligenceBusinessLicenseBase64Filename:
        uploadedBase64BusinessLicenseFiles[0].filenameOriginal,
      dueDiligenceAttestTrueAndCorrect:
        data.dueDiligenceAttestTrueAndCorrect === 'yes',
      dueDiligenceCompanyAddressState: isUS
        ? data.dueDiligenceCompanyAddressState.value
        : '',
      dueDiligenceCompanyAddressCountry:
        data.dueDiligenceCompanyAddressCountry.value,
      dueDiligenceCompanyPhoneNumberCountryCode: countryPhoneCode,
      dueDiligenceSpecialtyCertifications:
        data.dueDiligenceSpecialtyCertifications === 'yes',
      dueDiligenceSpecialtyCertificationsBase64:
        uploadedBase64SpecialtyCertificationsFiles?.map(
          (item) => item.fileContentsBase64String
        ),
      dueDiligenceSpecialtyCertificationsFilenames:
        uploadedBase64SpecialtyCertificationsFiles?.map(
          (item) => item.filenameOriginal
        ),
    };

    sendDueDiligenceQuestionnaire(finalData);
  };

  const checkForm = async () => {
    let hasError = false;

    if (
      dueDiligenceActiveInsurancePol === 'yes' &&
      !uploadedBase64InsurancePolFiles.length
    ) {
      setUploadedInsurancePolFilesError(true);
      hasError = true;
    } else {
      setUploadedInsurancePolFilesError(false);
    }

    if (!uploadedBase64BusinessLicenseFiles.length) {
      setUploadedBusinessLicenseFilesError(true);
      hasError = true;
    } else {
      setUploadedBusinessLicenseFilesError(false);
    }

    if (
      dueDiligenceSpecialtyCertifications === 'yes' &&
      !uploadedBase64SpecialtyCertificationsFiles.length
    ) {
      setUploadedSpecialtyCertificationsFilesError(true);
      hasError = true;
    } else {
      setUploadedSpecialtyCertificationsFilesError(false);
    }

    if (hasError) {
      await trigger();
    } else {
      handleSubmit(onSubmit)();
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      {!isDueDiligenceCongratsModalOpen && (
        <Modal
          isOpen={isOpen && !isDueDiligenceCongratsModalOpen}
          title={t('due-diligence.title')}
          closeModal={handleClose}
        >
          {!isSubmitting ? (
            <>
              <div className="mt-10 mb-4 text-xl font-bold font-custom1 lg:text-3xl text-primary">
                {t('due-diligence.description')}
              </div>
              <div className="mt-10">
                <form
                  className="flex flex-col"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="my-8 mt-0">
                    <RadioButtonField
                      register={register}
                      name="dueDiligenceAgencyActingBehalfCompany"
                      label="due-diligence.agency-acting-behalf-company"
                      items={radioItems}
                    />
                  </div>
                  {dueDiligenceAgencyActingBehalfCompany === 'yes' && (
                    <div className="pl-4 ml-4 my-4 py-2 border-l-2 border-button">
                      <div className="mb-4">
                        <Input
                          type="text"
                          register={register}
                          label="due-diligence.agency-acting-behalf-company-name"
                          name="dueDiligenceAgencyActingBehalfCompanyName"
                          placeholder={t(
                            'due-diligence.placeholders.enter-the-name-of-the-company'
                          )}
                          required={true}
                          smaller={true}
                          errorText={t(
                            errors.dueDiligenceAgencyActingBehalfCompanyName
                              ?.message || ''
                          )}
                        />
                      </div>
                      <div>
                        <div className="mb-8 text-lg font-bold text-primary font-custom1 md:text-xl lg:text-2xl">
                          <HeaderSplitPrimaryButton label="due-diligence.agency-acting-behalf-company-agreement" />
                        </div>
                        <FileUploadField
                          uploadFiles={(files) =>
                            uploadFiles(
                              files,
                              setUploadedAgencyActingBehalfCompanyFiles
                            )
                          }
                          uploadBase64Files={(files) =>
                            uploadBase64Files(
                              files,
                              setUploadedBase64AgencyActingBehalfCompanyFiles
                            )
                          }
                          files={uploadedAgencyActingBehalfCompanyFiles}
                          isBase64
                          acceptedFileTypes={onlyDocuments}
                          allowMultiple={false}
                          smaller
                        />
                      </div>
                    </div>
                  )}
                  <div className="my-8">
                    <RadioButtonField
                      register={register}
                      name="dueDiligenceActiveInsurancePol"
                      label="due-diligence.active-insurance-policy"
                      items={radioItems}
                    />
                  </div>
                  {dueDiligenceActiveInsurancePol === 'no' && (
                    <div className="pl-4 ml-4 my-4 py-2 border-l-2 border-button">
                      <div className="mb-4">
                        <Input
                          type="text"
                          register={register}
                          label="due-diligence.active-insurance-policy-lack-coverage-details"
                          name="dueDiligenceActiveInsurancePolLackDetails"
                          placeholder={t(
                            'due-diligence.placeholders.enter-any-details'
                          )}
                          maxLength={500}
                          required={true}
                          smaller={true}
                          errorText={t(
                            errors.dueDiligenceActiveInsurancePolLackDetails
                              ?.message || ''
                          )}
                        />
                      </div>
                    </div>
                  )}
                  {dueDiligenceActiveInsurancePol === 'yes' && (
                    <div className="pl-4 ml-4 my-4 py-2 border-l-2 border-button">
                      <div>
                        <div className="mb-8 text-lg font-bold text-primary font-custom1 md:text-xl lg:text-2xl">
                          <HeaderSplitPrimaryButton label="due-diligence.active-insurance-policy-certificate" />
                        </div>
                        <FileUploadField
                          uploadFiles={(files) =>
                            uploadFiles(
                              files,
                              setUploadedInsurancePolFiles,
                              setUploadedInsurancePolFilesError
                            )
                          }
                          uploadBase64Files={(files) =>
                            uploadBase64Files(
                              files,
                              setUploadedBase64InsurancePolFiles
                            )
                          }
                          files={uploadedInsurancePolFiles}
                          isBase64
                          acceptedFileTypes={onlyDocuments}
                          allowMultiple={false}
                          smaller
                          errorText={
                            uploadedInsurancePolFilesError
                              ? t('errors:you-need-to-upload-at-least-one-file')
                              : ''
                          }
                        />
                      </div>
                    </div>
                  )}
                  <div className="mt-8 mb-6">
                    <Input
                      type="text"
                      register={register}
                      label="due-diligence.dbas"
                      name="dueDiligenceDbas"
                      placeholder={t(
                        'due-diligence.placeholders.enter-any-dbas'
                      )}
                      maxLength={500}
                      required={true}
                      smaller={true}
                      errorText={t(errors.dueDiligenceDbas?.message || '')}
                    />
                  </div>
                  <div className="mb-8">
                    <div className="mb-8 text-lg font-bold text-primary font-custom1 md:text-xl lg:text-2xl">
                      <HeaderSplitPrimaryButton label="due-diligence.business-license" />
                    </div>
                    <FileUploadField
                      uploadFiles={(files) =>
                        uploadFiles(
                          files,
                          setUploadedBusinessLicenseFiles,
                          setUploadedBusinessLicenseFilesError
                        )
                      }
                      uploadBase64Files={(files) =>
                        uploadBase64Files(
                          files,
                          setUploadedBase64BusinessLicenseFiles
                        )
                      }
                      files={uploadedBusinessLicenseFiles}
                      isBase64
                      acceptedFileTypes={onlyDocuments}
                      allowMultiple={false}
                      smaller
                      errorText={
                        uploadedBusinessLicenseFilesError
                          ? t('errors:you-need-to-upload-at-least-one-file')
                          : ''
                      }
                    />
                  </div>
                  <div className="my-8">
                    <RadioButtonField
                      register={register}
                      name="dueDiligenceSpecialtyCertifications"
                      label="due-diligence.specialty-certifications"
                      items={radioItems}
                    />
                  </div>
                  {dueDiligenceSpecialtyCertifications === 'yes' && (
                    <div className="pl-4 ml-4 my-4 py-2 border-l-2 border-button">
                      <div>
                        <div className="mb-8 text-lg font-bold text-primary font-custom1 md:text-xl lg:text-2xl">
                          <HeaderSplitPrimaryButton label="due-diligence.specialty-certifications-certificates" />
                        </div>
                        <FileUploadField
                          uploadFiles={(files) =>
                            uploadFiles(
                              files,
                              setUploadedSpecialtyCertificationsFiles,
                              setUploadedSpecialtyCertificationsFilesError
                            )
                          }
                          uploadBase64Files={(files) =>
                            uploadBase64Files(
                              files,
                              setUploadedBase64SpecialtyCertificationsFiles
                            )
                          }
                          files={uploadedSpecialtyCertificationsFiles}
                          isBase64
                          acceptedFileTypes={onlyDocuments}
                          allowMultiple={true}
                          numberOfFiles={10}
                          smaller
                          errorText={
                            uploadedSpecialtyCertificationsFilesError
                              ? t('errors:you-need-to-upload-at-least-one-file')
                              : ''
                          }
                        />
                      </div>
                    </div>
                  )}
                  <div className="my-8">
                    <RadioButtonField
                      register={register}
                      name="dueDiligenceAttestTrueAndCorrect"
                      label="due-diligence.attest-true-and-correct"
                      items={radioItems}
                      errorText={t(
                        errors.dueDiligenceAttestTrueAndCorrect?.message || ''
                      )}
                    />
                  </div>
                  <div className="mt-8 mb-4">
                    <Input
                      type="text"
                      register={register}
                      label="due-diligence.address"
                      name="dueDiligenceCompanyAddressLine_1"
                      placeholder={t(
                        'due-diligence.placeholders.address-line-1'
                      )}
                      maxLength={250}
                      required={true}
                      smaller={true}
                      errorText={t(
                        errors.dueDiligenceCompanyAddressLine_1?.message || ''
                      )}
                    />
                  </div>
                  <div className="mb-4">
                    <Input
                      type="text"
                      register={register}
                      name="dueDiligenceCompanyAddressLine_2"
                      placeholder={t(
                        'due-diligence.placeholders.address-line-2'
                      )}
                      maxLength={250}
                      required={true}
                      smaller={true}
                      errorText={t(
                        errors.dueDiligenceCompanyAddressLine_2?.message || ''
                      )}
                    />
                  </div>
                  <div className="mb-4 flex flex-col gap-4 md:flex-row">
                    <div className="w-full md:w-4/6">
                      <Input
                        type="text"
                        register={register}
                        name="dueDiligenceCompanyAddressCity"
                        placeholder={t('due-diligence.placeholders.city')}
                        required={true}
                        smaller={true}
                        errorText={t(
                          errors.dueDiligenceCompanyAddressCity?.message || ''
                        )}
                      />
                    </div>
                    <div className="w-full md:w-2/6">
                      <Input
                        type="text"
                        register={register}
                        name="dueDiligenceCompanyAddressZipCode"
                        placeholder={
                          isUS
                            ? t('due-diligence.placeholders.zip')
                            : t('due-diligence.placeholders.postal-code')
                        }
                        required={true}
                        smaller={true}
                        errorText={t(
                          errors.dueDiligenceCompanyAddressZipCode?.message ||
                            ''
                        )}
                      />
                    </div>
                    {isUS && (
                      <Dropdown
                        control={control}
                        className="w-full md:w-3/6"
                        name="dueDiligenceCompanyAddressState"
                        placeholder={t('due-diligence.placeholders.state')}
                        rules={{ required: true }}
                        items={states}
                        errorText={t(
                          errors.dueDiligenceCompanyAddressState?.message || ''
                        )}
                      />
                    )}
                    <Dropdown
                      control={control}
                      className="w-full md:w-3/6"
                      name="dueDiligenceCompanyAddressCountry"
                      placeholder={t('due-diligence.placeholders.country')}
                      rules={{ required: true }}
                      items={countries}
                      errorText={t(
                        errors.dueDiligenceCompanyAddressCountry?.message || ''
                      )}
                    />
                  </div>
                  <div className="my-4">
                    <div className="mb-8 text-lg font-bold text-primary font-custom1 md:text-xl lg:text-2xl">
                      <HeaderSplitPrimaryButton label="due-diligence.phone-number" />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                      <Dropdown
                        control={control}
                        className="w-full md:w-2/6"
                        name="dueDiligenceCompanyPhoneNumberCountryCode"
                        placeholder={t('due-diligence.placeholders.country')}
                        rules={{ required: true }}
                        items={countries}
                        errorText={t(
                          errors.dueDiligenceCompanyPhoneNumberCountryCode
                            ?.message || ''
                        )}
                      />
                      <div className="w-full md:w-4/6 flex gap-4">
                        <div className="mt-[2px] h-[37px] w-[70px] text-center text-lg md:text-2xl font-bold border-b-4 border-borderColor font-custom1">
                          {countryPhoneCode}
                        </div>
                        <div className="w-full">
                          <Input
                            type="text"
                            register={register}
                            name="dueDiligenceCompanyPhoneNumber"
                            placeholder={t(
                              'due-diligence.placeholders.phone-number'
                            )}
                            required={true}
                            smaller={true}
                            errorText={t(
                              errors.dueDiligenceCompanyPhoneNumber?.message ||
                                ''
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="flex flex-col">
                  <Button
                    disabled={isSubmitting}
                    className="self-center mt-10"
                    onClick={checkForm}
                  >
                    {t('submit')}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <CircleLoaderSpinner className="mt-10" size={250} />
          )}
        </Modal>
      )}
      {isDueDiligenceCongratsModalOpen && (
        <DueDiligenceCongratsModal
          isOpen={isDueDiligenceCongratsModalOpen}
          onClose={onCloseCongratsModal}
        />
      )}
    </>
  );
};

export default DueDiligenceModal;
