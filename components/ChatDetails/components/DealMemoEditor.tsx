import { useTranslation } from 'next-i18next';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginFileMetadata from 'filepond-plugin-file-metadata';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { FilePond, registerPlugin } from 'react-filepond';
import dayjs from 'dayjs';
import React, { Fragment, useEffect, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { toast } from 'react-toastify';

import { FooterButtonsFour } from 'components/FooterButtonFolder/FooterButtonsFour';
import { createDraftFromProposal } from 'api/deal/createDraftFromProposal';
import useStore from 'modules/Store';
import Button from 'components/Buttons/Button';
import {
  CustomType,
  DealResponse,
  DealAttachmentsResponse,
} from 'models/deals/deals';
import { findItemByUuid } from 'api/item/findItemByUuid';
import { acceptProposal } from 'api/deal/acceptProposal';
import { rejectProposal } from 'api/deal/rejectProposal';
import { saveDraftRequest } from 'api/deal/saveDraftRequest';
import { sendDraftAsProposal } from 'api/deal/sendDraftAsProposal';
import TextArea from 'components/TextArea';
import Toast from 'components/Toast';
import { deleteFileAttachment } from 'api/deal/deleteFileAttachment';
import UploadedFileSmaller from 'components/UploadedFileSmaller';
import { convertedImageLogo } from 'public/helpers/convertedImageLogo';
import { uploadFileAttachment } from 'api/deal/uploadFileAttachment';
import DialogModal from 'components/DialogModal';
import CircleLoaderSpinner from 'components/CircleLoaderSpinner';
import { throwError } from 'utils/error';
import useTokensOrCookies from 'contexts/TokensOrCookies';
import { getCurrentUuid } from 'utils/getCurrentUuid';

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileEncode,
  FilePondPluginFileMetadata
);

type EditorProps = {
  dealID: string;
  refreshDeals: boolean;
  setRefreshDeals: (shouldRefresh: boolean) => void;
  setRefreshImages: (refresh: boolean) => void;
  files: DealAttachmentsResponse[];
  mostRecentDeal: DealResponse;
};

const DealMemoEditor: React.FC<EditorProps> = ({
  dealID,
  refreshDeals,
  setRefreshDeals,
  setRefreshImages,
  files,
  mostRecentDeal,
}) => {
  const userUUID = useStore((state) => state.userUUID);
  const { t } = useTranslation();
  const { companyRepresented } = useTokensOrCookies();

  const [descriptionInput, setDescriptionInput] = useState<string>('');

  const [isActingUser, setIsActingUser] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');

  const handleChangeDescription = (e: any) => {
    setDescriptionInput(e.target.value);
  };

  const [territoriesDeal, setTerritoriesDeal] = useState<string>('');
  const [royaltyDeal, setRoyaltyDeal] = useState<string>('');
  const [propertyDeal, setPropertyDeal] = useState<string>('');
  const [termDeal, setTermDeal] = useState<string>('');
  const [channelsOfDistributionDeal, setChannelsOfDistributionDeal] =
    useState<string>('');
  const [dateOfDistributionDeal, setDateOfDistributionDeal] =
    useState<string>('');
  const [licensorMarketingCommitment, setLicensorMarketingCommitmentDeal] =
    useState<string>('');
  const [exclusiveDeal, setExclusiveDeal] = useState<string>('');
  const [minimumDeal, setMinimumDeal] = useState<string>('');
  const [advancePayementsDeal, setAdvancePayementsDeal] = useState<string>('');
  const [paymentAndReportingDeal, setPaymentAndReportingDeal] =
    useState<string>('');
  const [sampleRequirementsDeal, setSampleRequirementsDeal] =
    useState<string>('');
  const [sellOfPeriodDeal, setSellOffPeriodDeal] = useState<string>('');
  const [additionalProvisionsDeal, setAdditionalProvisionsDeal] =
    useState<string>('');
  const [file, setFile] = useState<any>([]);
  const [nonNegotiableTerms, setnonNegotiableTerms] = useState<any>([]);

  const [numberOfExtraLines, setNumberOfExtraLines] = useState(0);
  const [extraContentKeys, setExtraContentKeys] = useState<any>([]);
  const [extraContentValues, setExtraContentValues] = useState<any>([]);

  const [categoryString, setCategoryString] = useState('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (mostRecentDeal) {
      setDescriptionInput(mostRecentDeal.description);
      setCategoryString(mostRecentDeal.categories);
      setTerritoriesDeal(mostRecentDeal.territories);
      setRoyaltyDeal(mostRecentDeal.royalty_rate);
      setMinimumDeal(`${mostRecentDeal.guaranteed_minimum_royalty_payments}%`);
      setAdvancePayementsDeal(`$${mostRecentDeal.advance_payments}`);
      setPropertyDeal(mostRecentDeal.property);
      setTermDeal(mostRecentDeal.term);
      setChannelsOfDistributionDeal(mostRecentDeal.distribution_channels);
      setDateOfDistributionDeal(mostRecentDeal.date_of_distribution);

      setLicensorMarketingCommitmentDeal(
        mostRecentDeal.licensor_marketing_commitment
      );
      setExclusiveDeal(mostRecentDeal.exclusive);
      setMinimumDeal(mostRecentDeal.guaranteed_minimum_royalty_payments);
      setAdvancePayementsDeal(mostRecentDeal.advance_payments);
      setPaymentAndReportingDeal(mostRecentDeal.payment_and_reporting);
      setSampleRequirementsDeal(mostRecentDeal.sample_requirements);
      setSellOffPeriodDeal(mostRecentDeal.sell_off_period);
      setAdditionalProvisionsDeal(mostRecentDeal.additional_provisions);

      setExtraContentKeys(
        mostRecentDeal.custom_fields.map((value: CustomType) => value.fieldName)
      );
      setExtraContentValues(
        mostRecentDeal.custom_fields.map(
          (value: CustomType) => value.fieldValue
        )
      );
      setNumberOfExtraLines(mostRecentDeal.custom_fields.length);
      setRefreshDeals(false);
    }
  }, [refreshDeals, mostRecentDeal, setRefreshDeals]);

  useEffect(() => {
    if (mostRecentDeal && refreshDeals) {
      findItemByUuid(mostRecentDeal.item.uuid)
        .then((res) => {
          setnonNegotiableTerms(res.non_negotiable_terms);
        })
        .catch((err) => throwError(err));
    }
  }, [mostRecentDeal, refreshDeals]);

  const reviseProposal = () => {
    setIsDisabled(true);
    const body = {
      user_uuid: getCurrentUuid(),
      uuid: dealID,
    };
    createDraftFromProposal(body)
      .then(() => {
        submitDraft('draft');
      })
      .catch((err) => {
        setIsDisabled(false);
        throwError(err);
      });
  };

  const reviseProposalAndSumbit = () => {
    setIsDisabled(true);
    const body = {
      user_uuid: getCurrentUuid(),
      uuid: dealID,
    };
    createDraftFromProposal(body)
      .then(() => {
        submitDraft('proposal');
      })
      .catch((err) => {
        setIsDisabled(false);
        throwError(err);
      });
  };

  const rejectDeal = () => {
    setIsDisabled(true);
    const body = {
      user_uuid: getCurrentUuid(),
      uuid: dealID,
    };

    return rejectProposal(body)
      .then((res) => {
        setIsDisabled(false);
        toast(<Toast message={t('deal.you-have-rejected-the-deal')} />);
        setRefreshDeals(true);
      })
      .catch((err) => {
        setIsDisabled(false);
        throwError(err);
      });
  };

  const acceptDeal = () => {
    setIsDisabled(true);
    const body = {
      user_uuid: getCurrentUuid(),
      uuid: dealID,
    };

    return acceptProposal(body)
      .then((res) => {
        setIsDisabled(false);
        toast(<Toast message={t('deal.you-have-accepted-the-deal')} />);
        setRefreshDeals(true);
      })
      .catch((err) => {
        setIsDisabled(false);
        throwError(err);
      });
  };

  const submitDeal = async () => {
    if (mostRecentDeal?.status === 'Proposed') {
      await reviseProposalAndSumbit();
    } else {
      await submitDraft('proposal');
    }
    setRefreshDeals(true);
  };

  const saveDeal = async () => {
    if (mostRecentDeal?.status === 'Draft') {
      await submitDraft('draft');
    } else {
      await reviseProposal();
    }

    setRefreshDeals(true);
  };

  const submitDraft = async (submissionType: string) => {
    setIsDisabled(true);
    setIsSubmitting(false);
    const keys = extraContentKeys;
    const values = extraContentValues;
    const customFields = keys.map((key: string, i: number) => {
      return { fieldName: key, fieldValue: values[i] };
    });
    const data = {
      uuid: dealID,
      user_uuid: getCurrentUuid(),
      description: !!descriptionInput ? descriptionInput : undefined,
      property: !!propertyDeal ? propertyDeal : undefined,
      exclusive: !!exclusiveDeal ? exclusiveDeal : undefined,
      categories: !!categoryString ? categoryString : undefined,
      territories: !!territoriesDeal ? territoriesDeal : undefined,
      term: !!termDeal ? termDeal : undefined,
      distribution_channels: !!channelsOfDistributionDeal
        ? channelsOfDistributionDeal
        : undefined,
      date_of_distribution: !!dateOfDistributionDeal
        ? dateOfDistributionDeal
        : undefined,
      licensor_marketing_commitment: !!licensorMarketingCommitment
        ? licensorMarketingCommitment
        : undefined,
      royalty_rate: !!royaltyDeal ? royaltyDeal : undefined,
      guaranteed_minimum_royalty_payments: !!minimumDeal
        ? minimumDeal
        : undefined,
      advance_payments: !!advancePayementsDeal
        ? advancePayementsDeal
        : undefined,
      payment_and_reporting: !!paymentAndReportingDeal
        ? paymentAndReportingDeal
        : undefined,
      sample_requirements: !!sampleRequirementsDeal
        ? sampleRequirementsDeal
        : undefined,
      sell_off_period: !!sellOfPeriodDeal ? sellOfPeriodDeal : undefined,
      additional_provisions: !!additionalProvisionsDeal
        ? additionalProvisionsDeal
        : undefined,
      custom_fields: customFields ? customFields : undefined,
    };

    if (submissionType === 'draft') {
      // @ts-ignore
      saveDraftRequest(data)
        .then(() => {
          setFile([]);
          setIsSubmitting(false);
          setRefreshDeals(true);
          setIsDisabled(false);
          toast(<Toast message={t('deal.your-draft-has-been-saved')} />);
        })
        .catch((err) => {
          setFile([]);
          setIsSubmitting(false);
          setIsDisabled(false);
          setSubmitError(JSON.parse(err.request.response).message);
        });
    } else if (submissionType === 'proposal') {
      try {
        // @ts-ignore
        const res = await saveDraftRequest(data);
        const draftUUID = res.uuid;

        const dataDraft = {
          uuid: draftUUID,
          user_uuid: getCurrentUuid(),
        };
        setFile([]);
        await sendDraftAsProposal(dataDraft);
        setIsSubmitting(false);
        setIsDisabled(false);
        setRefreshDeals(true);
        toast(<Toast message={t('deal.your-proposal-has-been-submitted')} />);
      } catch (err: any) {
        setFile([]);
        setIsSubmitting(false);
        setIsDisabled(false);
        setSubmitError(JSON.parse(err.request.response).message);
      }
    }
  };

  const handlePondFile = (error: any, filePondFile: any) => {
    if (error) {
      throwError(error);
      return;
    }
  };

  const addFile = async (error: any, filePondFile: any) => {
    const item = {
      user_uuid: companyRepresented
        ? companyRepresented
        : filePondFile.getMetadata().user_uuid,
      filename_original: filePondFile.filename,
      deal_uuid: filePondFile.getMetadata().deal_uuid,
      fileContentsBase64String: filePondFile.getFileEncodeBase64String(),
    };
    try {
      await uploadFileAttachment(item);
      setRefreshImages(true);
    } catch (err) {
      throwError(err);
    }
  };

  const addALine = () => {
    setNumberOfExtraLines(numberOfExtraLines + 1);
  };

  const setKeyExtraField = (e: string, i: number) => {
    const newArr = [...extraContentKeys];
    newArr[i] = e;
    setExtraContentKeys(newArr);
  };

  const setValueExtraField = (e: string, i: number) => {
    const newArr = [...extraContentValues];
    newArr[i] = e;
    setExtraContentValues(newArr);
  };

  const RemoveItem = (index: number) => {
    setExtraContentKeys(
      extraContentKeys.filter((_: string, i: number) => i !== index)
    );
    setExtraContentValues(
      extraContentValues.filter((_: string, i: number) => i !== index)
    );
    setNumberOfExtraLines(numberOfExtraLines - 1);
  };

  useEffect(() => {
    if (
      (mostRecentDeal?.current_user_uuid === userUUID ||
        mostRecentDeal?.current_user_uuid === companyRepresented) &&
      mostRecentDeal?.status !== 'Accepted' &&
      mostRecentDeal?.status !== 'Rejected'
    ) {
      setIsActingUser(true);
    } else {
      setIsActingUser(false);
    }
  }, [companyRepresented, userUUID, mostRecentDeal]);

  const DeleteFile = (uri: string) => {
    const config = {
      data: {
        uris: [uri],
        user_uuid: getCurrentUuid(),
      },
    };

    deleteFileAttachment(config)
      .then((res: any) => {
        setRefreshImages(true);
      })
      .catch((err: any) => {
        throwError(err);
      });
  };

  const [customFields, setCustomFields] = useState<any>();

  useEffect(() => {
    const keys = extraContentKeys;
    const values = extraContentValues;
    const customFieldsAggregate = keys.map((key: string, i: number) => {
      return { fieldName: key, fieldValue: values[i] };
    });
    setCustomFields(customFieldsAggregate);
  }, [extraContentKeys, extraContentValues]);

  const objectsEqual: any = (o1: any, o2: any) =>
    typeof o1 === 'object' && Object.keys(o1).length > 0
      ? Object.keys(o1).length === Object.keys(o2).length &&
        Object.keys(o1).every((p) => objectsEqual(o1[p], o2[p]))
      : o1 === o2;

  const arraysEqual = (a1: any[], a2: any[]) =>
    a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));

  const [isOpenAccept, setIsOpenAccept] = useState(false);

  function closeModalAccept() {
    setIsOpenAccept(false);
  }

  function openModalAccept() {
    setIsOpenAccept(true);
  }

  const [isOpenReject, setIsOpenReject] = useState(false);

  function closeModalReject() {
    setIsOpenReject(false);
  }

  function openModalReject() {
    setIsOpenReject(true);
  }

  const [isOpenSubmit, setIsOpenSubmit] = useState(false);

  function closeModalSubmit() {
    setIsOpenSubmit(false);
  }

  function openModalSubmit() {
    setIsOpenSubmit(true);
  }

  return (
    <>
      <>
        {!isSubmitting && mostRecentDeal && userUUID ? (
          <>
            <div>
              {mostRecentDeal && mostRecentDeal.description && (
                <>
                  <div className="mt-10 mb-4 text-xl font-bold font-custom1 lg:text-3xl text-primary">
                    {t('onboarding.description')}:
                  </div>
                  {isActingUser ? (
                    <TextArea
                      name="deal_description"
                      placeholder={t('deal.tell-us-in-a-few-words')}
                      value={descriptionInput}
                      onChange={handleChangeDescription}
                      max={500}
                      smaller
                    />
                  ) : (
                    <div className="mb-6 text-base font-custom1 text-blueText">
                      {descriptionInput}
                    </div>
                  )}
                </>
              )}
            </div>
            {isActingUser && (
              <div className="flex flex-col px-10 pt-10 pb-2 mt-10 border-2 rounded-lg shadow-lg hover:shadow-inner hover:shadow-button/50 lg:px-20 lg:py-20 border-backgroundInput">
                <FilePond
                  allowFileMetadata={true}
                  files={file && file}
                  dropOnPage={true}
                  fileMetadataObject={{
                    user_uuid: companyRepresented
                      ? companyRepresented
                      : userUUID,
                    deal_uuid: dealID,
                  }}
                  onaddfile={addFile}
                  onupdatefiles={setFile}
                  instantUpload={false}
                  allowMultiple={true}
                  maxFiles={100}
                  acceptedFileTypes={['application/*']}
                  onprocessfile={handlePondFile}
                  name="file"
                  labelIdle={`Drag & Drop your file or <span class="filepond--label-action">Browse</span> to add to folder<br/>
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
              </div>
            )}
            {files && files.length > 0 && (
              <>
                <div className="mt-10 mb-4 text-xl font-bold font-custom1 lg:text-3xl text-primary">
                  {t('onboarding.files')}:
                </div>
                <div className="mb-6 text-base font-custom1 text-blueText">
                  <div className="flex flex-wrap">
                    {files.map((item) => {
                      let image = convertedImageLogo(item.uri);
                      return (
                        <UploadedFileSmaller
                          image={image}
                          title={item.filename_original}
                          uri={item.uri}
                          key={item.uri}
                          deleteCapable={
                            item.user_uuid === userUUID ||
                            item.user_uuid === companyRepresented
                          }
                          deleteFile={DeleteFile}
                        />
                      );
                    })}
                  </div>
                </div>
              </>
            )}
            <div className="max-w-3xl mt-10 mb-6 text-xl font-bold font-custom1 lg:text-3xl text-primary lg:mb-8">
              {t('deal.deal-specifics')}
            </div>
            {mostRecentDeal && (
              <div className="max-w-4xl mb-40">
                <div className="hidden mt-6 lg:grid lg:grid-cols-9">
                  <div className="ml-3 font-bold lg:col-span-3 font-custom1 text-inputGray">
                    {t('deal-details')}
                  </div>
                  <div className="ml-2 font-bold font-custom1 text-inputGray lg:col-span-6 ">
                    {t('deal-memo-editor.updated-info')}
                  </div>
                </div>
                <div className="mt-2 mb-20 bg-white border-4 lg:grid lg:grid-cols-9 border-button text-blueText">
                  <div className="p-2 border-2 lg:col-span-3 border-button">
                    {t('date')}:
                  </div>
                  <div className="border-2 lg:col-span-6 border-button bg-backgroundInput">
                    <div className="p-2">
                      {dayjs(new Date()).format('MMM DD, YYYY')}
                    </div>
                  </div>
                  <div className="p-2 border-2 lg:col-span-3 border-button">
                    {t('deal.party')} 1:
                  </div>
                  <div className="border-2 lg:col-span-6 border-button bg-backgroundInput">
                    <div className="p-2">
                      {mostRecentDeal.user.company_name}
                    </div>
                  </div>
                  <div className="p-2 border-2 lg:col-span-3 border-button">
                    {t('deal.party')} 2:
                  </div>
                  <div className="border-2 lg:col-span-6 border-button bg-backgroundInput">
                    <div className="p-2">
                      {mostRecentDeal.counterparty.company_name}
                    </div>
                  </div>
                  {mostRecentDeal.deal_type === 'Collaboration' && (
                    <>
                      <div className="p-2 border-2 lg:col-span-3 border-button">
                        {t('deal.collaboration-brand')}:
                      </div>
                      <div className="border-2 lg:col-span-6 border-button bg-backgroundInput">
                        <div className="p-2">
                          {mostRecentDeal.collaboration_item?.name}
                        </div>
                      </div>
                    </>
                  )}
                  <div className="p-2 border-2 border-r-2 lg:col-span-3 border-button">
                    1. {t('listing')}:
                  </div>
                  <div className="border-2 lg:col-span-6 border-button bg-backgroundInput">
                    <div className="p-2">{mostRecentDeal.property}</div>
                  </div>
                  <div className="p-2 border-2 lg:col-span-3 border-button">
                    2. {t('deal.exclusive')}:
                  </div>
                  <div
                    className={`border-2 lg:col-span-6 border-button
                                ${!isActingUser && ' bg-backgroundInput'}`}
                  >
                    {isActingUser ? (
                      <div className="p-2">
                        <TextareaAutosize
                          className="w-full p-2 cursor-pointer"
                          placeholder="YES EXCLUSIVE or NO, NOT EXCLUSIVE"
                          value={exclusiveDeal}
                          onChange={(e) => setExclusiveDeal(e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className="p-2">{mostRecentDeal.exclusive}</div>
                    )}
                  </div>
                  <div className="p-2 border-2 lg:col-span-3 border-button">
                    3. {t('product-categories')}:
                  </div>
                  <div
                    className={
                      'border-2 lg:col-span-6 border-button' +
                      (nonNegotiableTerms.includes('categories') ||
                      !isActingUser
                        ? ' bg-backgroundInput'
                        : '')
                    }
                  >
                    <div className="p-2">
                      {nonNegotiableTerms.includes('categories') ||
                      !isActingUser ? (
                        `${categoryString}`
                      ) : (
                        <>
                          <TextareaAutosize
                            className="w-full h-full p-2 whitespace-pre-line cursor-pointer"
                            placeholder={t('deal.what-product-categories')}
                            value={`${categoryString}`}
                            onChange={(e) => setCategoryString(e.target.value)}
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-2 border-2 lg:col-span-3 border-button">
                    4. {t('deal.territory')}:
                  </div>
                  <div
                    className={
                      'border-2 lg:col-span-6 border-button' +
                      (nonNegotiableTerms.includes('territories') ||
                      !isActingUser
                        ? ' bg-backgroundInput'
                        : '')
                    }
                  >
                    <div className="p-2">
                      {nonNegotiableTerms.includes('territories') ||
                      !isActingUser ? (
                        `${territoriesDeal}`
                      ) : (
                        <>
                          <TextareaAutosize
                            className="w-full p-2 cursor-pointer"
                            placeholder={t(
                              'deal.worldwide-or-separate-territories'
                            )}
                            value={territoriesDeal}
                            onChange={(e) => setTerritoriesDeal(e.target.value)}
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-2 border-2 lg:col-span-3 border-button">
                    5. {t('deal.term')}:
                  </div>
                  <div
                    className={
                      'border-2 lg:col-span-6 border-button' +
                      (nonNegotiableTerms.includes('offer_deadline') ||
                      !isActingUser
                        ? ' bg-backgroundInput'
                        : '')
                    }
                  >
                    <div className="p-2">
                      {nonNegotiableTerms.includes('offer_deadline') ||
                      !isActingUser ? (
                        `${termDeal}`
                      ) : (
                        <>
                          <TextareaAutosize
                            className="w-full p-2 cursor-pointer"
                            placeholder={
                              t('deal.upon-signature-through') + '...'
                            }
                            value={termDeal}
                            onChange={(e) => setTermDeal(e.target.value)}
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-2 border-2 lg:col-span-3 border-button">
                    6. {t('deal.channels-of-distribution')}:
                  </div>
                  <div
                    className={
                      'border-2 lg:col-span-6 border-button' +
                      (nonNegotiableTerms.includes('distribution_channels') ||
                      !isActingUser
                        ? ' bg-backgroundInput'
                        : '')
                    }
                  >
                    <div className="p-2">
                      {nonNegotiableTerms.includes('distribution_channels') ||
                      !isActingUser ? (
                        `${channelsOfDistributionDeal}`
                      ) : (
                        <>
                          <TextareaAutosize
                            className="w-full p-2 cursor-pointer"
                            placeholder={t(
                              'deal.all-any-channels-or-specific-channels'
                            )}
                            value={channelsOfDistributionDeal}
                            onChange={(e) =>
                              setChannelsOfDistributionDeal(e.target.value)
                            }
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-2 border-2 lg:col-span-3 border-button">
                    7. {t('deal.date-of-distribution')}:
                  </div>

                  <div
                    className={`border-2 lg:col-span-6 border-button
                                ${!isActingUser && ' bg-backgroundInput'}`}
                  >
                    <div className="p-2">
                      {!isActingUser ? (
                        `${dateOfDistributionDeal || '-'}`
                      ) : (
                        <>
                          <TextareaAutosize
                            className="w-full p-2 cursor-pointer"
                            placeholder="Date of distribution"
                            value={dateOfDistributionDeal}
                            onChange={(e) =>
                              setDateOfDistributionDeal(e.target.value)
                            }
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-2 border-2 lg:col-span-3 border-button">
                    8. {t('deal.licensor-marketing-commitments')}:
                  </div>
                  <div
                    className={`border-2 lg:col-span-6 border-button
                                ${!isActingUser && ' bg-backgroundInput'}`}
                  >
                    <div className="p-2">
                      {!isActingUser ? (
                        `${licensorMarketingCommitment || '-'}`
                      ) : (
                        <>
                          <TextareaAutosize
                            className="w-full p-2 cursor-pointer"
                            placeholder=""
                            value={licensorMarketingCommitment}
                            onChange={(e) =>
                              setLicensorMarketingCommitmentDeal(e.target.value)
                            }
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-2 border-2 lg:col-span-3 border-button">
                    9. {t('deal.royalty-rate')}:
                  </div>
                  <div
                    className={
                      'border-2 lg:col-span-6 border-button' +
                      (nonNegotiableTerms.includes('royalty_percent') ||
                      !isActingUser
                        ? ' bg-backgroundInput'
                        : '')
                    }
                  >
                    <div className="p-2">
                      {nonNegotiableTerms.includes('royalty_percent') ||
                      !isActingUser ? (
                        `${royaltyDeal || '-'}`
                      ) : (
                        <>
                          <TextareaAutosize
                            className="w-full p-2 cursor-pointer"
                            placeholder=""
                            value={royaltyDeal}
                            onChange={(e) => setRoyaltyDeal(e.target.value)}
                          />
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-2 border-2 lg:col-span-3 border-button">
                    10. {t('deal.guaranteed-minimum-royalty-payment')}:
                  </div>

                  <div
                    className={
                      'border-2 lg:col-span-6 border-button' +
                      (nonNegotiableTerms.includes('minimum_guarantee') ||
                      !isActingUser
                        ? ' bg-backgroundInput'
                        : '')
                    }
                  >
                    <div className="p-2">
                      {nonNegotiableTerms.includes('minimum_guarantee') ||
                      !isActingUser ? (
                        `${minimumDeal || '-'}`
                      ) : (
                        <>
                          <TextareaAutosize
                            className="w-full p-2 cursor-pointer"
                            placeholder=""
                            value={minimumDeal}
                            onChange={(e) => setMinimumDeal(e.target.value)}
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-2 border-2 lg:col-span-3 border-button">
                    11. {t('deal.advance-payments')}:
                  </div>
                  <div
                    className={
                      'border-2 lg:col-span-6 border-button' +
                      (nonNegotiableTerms.includes('minimum_guarantee') ||
                      !isActingUser
                        ? ' bg-backgroundInput'
                        : '')
                    }
                  >
                    <div className="p-2">
                      {nonNegotiableTerms.includes('minimum_guarantee') ||
                      !isActingUser ? (
                        `${advancePayementsDeal || '-'}`
                      ) : (
                        <>
                          <TextareaAutosize
                            className="w-full p-2 cursor-pointer"
                            placeholder=""
                            value={advancePayementsDeal}
                            onChange={(e) =>
                              setAdvancePayementsDeal(e.target.value)
                            }
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-2 border-2 lg:col-span-3 border-button">
                    12. {t('deal.payment-and-reporting')}:
                  </div>

                  <div
                    className={`border-2 lg:col-span-6 border-button
                                ${!isActingUser && ' bg-backgroundInput'}`}
                  >
                    <div className="p-2">
                      {!isActingUser ? (
                        `${paymentAndReportingDeal || '-'}`
                      ) : (
                        <>
                          <TextareaAutosize
                            className="w-full p-2 cursor-pointer"
                            placeholder=""
                            value={paymentAndReportingDeal}
                            onChange={(e) =>
                              setPaymentAndReportingDeal(e.target.value)
                            }
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-2 border-2 lg:col-span-3 border-button">
                    13. {t('deal.sample-requirements')}:
                  </div>

                  <div
                    className={`border-2 lg:col-span-6 border-button
                                ${!isActingUser && ' bg-backgroundInput'}`}
                  >
                    <div className="p-2">
                      {!isActingUser ? (
                        `${sampleRequirementsDeal || '-'}`
                      ) : (
                        <>
                          <TextareaAutosize
                            className="w-full p-2 cursor-pointer"
                            placeholder=""
                            value={sampleRequirementsDeal}
                            onChange={(e) =>
                              setSampleRequirementsDeal(e.target.value)
                            }
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-2 border-2 lg:col-span-3 border-button">
                    14. {t('deal.sell-off-period')}:
                  </div>

                  <div
                    className={`border-2 lg:col-span-6 border-button
                                ${!isActingUser && ' bg-backgroundInput'}`}
                  >
                    <div className="p-2">
                      {!isActingUser ? (
                        `${sellOfPeriodDeal || '-'}`
                      ) : (
                        <>
                          <TextareaAutosize
                            className="w-full p-2 cursor-pointer"
                            placeholder=""
                            value={sellOfPeriodDeal}
                            onChange={(e) =>
                              setSellOffPeriodDeal(e.target.value)
                            }
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-2 border-2 lg:col-span-3 border-button">
                    15. {t('deal.additional-provisions')}:
                  </div>

                  <div
                    className={`border-2 lg:col-span-6 border-button
                                ${!isActingUser && ' bg-backgroundInput'}`}
                  >
                    <div className="p-2">
                      {!isActingUser ? (
                        `${additionalProvisionsDeal || '-'}`
                      ) : (
                        <>
                          <TextareaAutosize
                            className="w-full p-2 cursor-pointer"
                            placeholder=""
                            value={additionalProvisionsDeal}
                            onChange={(e) =>
                              setAdditionalProvisionsDeal(e.target.value)
                            }
                          />
                        </>
                      )}
                    </div>
                  </div>
                  {[...Array(numberOfExtraLines)].map(
                    (_: string, index: number) => {
                      return (
                        <Fragment key={index}>
                          <div className="flex p-2 border-2 lg:col-span-3 border-button">
                            <span className="pt-2">{index + 16}.</span>
                            {isActingUser ? (
                              <TextareaAutosize
                                className="w-full p-2 ml-2 cursor-pointer"
                                name={`ExtraKey-${index}`}
                                placeholder=""
                                value={extraContentKeys[index] || ''}
                                onChange={(e) =>
                                  setKeyExtraField(e.target.value, index)
                                }
                              />
                            ) : (
                              <span className="p-2">
                                {extraContentKeys[index]}
                              </span>
                            )}
                          </div>
                          {isActingUser ? (
                            <div
                              className={`border-2 lg:col-span-5 border-button`}
                            >
                              <div className="p-2">
                                <TextareaAutosize
                                  className="w-full p-2 cursor-pointer"
                                  name={`ExtraValue-${index}`}
                                  placeholder=""
                                  value={extraContentValues[index] || ''}
                                  onChange={(e) =>
                                    setValueExtraField(e.target.value, index)
                                  }
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="border-2 lg:col-span-6 border-button bg-backgroundInput">
                              <div className="p-4">
                                {extraContentValues[index]}
                              </div>
                            </div>
                          )}

                          {isActingUser && (
                            <div className="border-2 lg:col-span-1 border-button">
                              <div
                                className="flex items-center justify-center h-10 m-2 text-white transition duration-150 ease-in-out rounded-full cursor-pointer lg:w-10/12 bg-button hover:bg-buttonHover2 hover:shadow-lg focus:bg-buttonHover2 focus:shadow-lg focus:outline-none focus:ring focus:ring-button/50 active:bg-buttonHover2 active:shadow-lg"
                                onClick={() => RemoveItem(index)}
                              >
                                X
                              </div>
                            </div>
                          )}
                        </Fragment>
                      );
                    }
                  )}
                  {isActingUser && (
                    <div className="m-2 mx-auto lg:col-span-9">
                      <Button smaller onClick={() => addALine()}>
                        {t('deal.add-a-line')}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
            {mostRecentDeal && mostRecentDeal ? (
              mostRecentDeal?.status === 'Accepted' ? (
                <div className="!z-50 sm:fixed sm:left-0 sm:bottom-0 w-full  !bg-white !border-t-2 border-borderColor rounded-t-xl drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]">
                  <div className="flex items-center justify-center px-4 pt-5 pb-5 text-lg sm:px-10 lg:container lg:mx-auto font-custom1 text-inputGray">
                    {t('deal-memo-editor.deal-has-been-accepted')}
                  </div>
                </div>
              ) : mostRecentDeal?.status === 'Rejected' ? (
                <div className="!z-50 sm:fixed sm:left-0 sm:bottom-0 w-full  !bg-white !border-t-2 border-borderColor rounded-t-xl drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]">
                  <div className="flex items-center justify-center px-4 pt-5 pb-5 text-lg sm:px-10 lg:container lg:mx-auto font-custom1 text-inputGray">
                    {t('deal-memo-editor.deal-has-been-rejected')}
                  </div>
                </div>
              ) : isActingUser &&
                mostRecentDeal?.status === 'Proposed' &&
                (mostRecentDeal?.description === descriptionInput ||
                  (mostRecentDeal?.description === undefined &&
                    descriptionInput === '')) &&
                (mostRecentDeal?.property === propertyDeal ||
                  (mostRecentDeal?.property === undefined &&
                    propertyDeal === '')) &&
                (mostRecentDeal?.exclusive === exclusiveDeal ||
                  (mostRecentDeal?.exclusive === undefined &&
                    exclusiveDeal === '')) &&
                (mostRecentDeal?.categories === categoryString ||
                  (mostRecentDeal?.categories === undefined &&
                    categoryString === '')) &&
                (mostRecentDeal?.territories === territoriesDeal ||
                  (mostRecentDeal?.territories === undefined &&
                    territoriesDeal === '')) &&
                (mostRecentDeal?.term === termDeal ||
                  (mostRecentDeal?.term === undefined && termDeal === '')) &&
                (mostRecentDeal?.distribution_channels ===
                  channelsOfDistributionDeal ||
                  (mostRecentDeal?.distribution_channels === undefined &&
                    channelsOfDistributionDeal === '')) &&
                (mostRecentDeal?.date_of_distribution ===
                  dateOfDistributionDeal ||
                  (mostRecentDeal?.date_of_distribution === undefined &&
                    dateOfDistributionDeal === '')) &&
                (mostRecentDeal?.licensor_marketing_commitment ===
                  licensorMarketingCommitment ||
                  (mostRecentDeal?.licensor_marketing_commitment ===
                    undefined &&
                    licensorMarketingCommitment === '')) &&
                (mostRecentDeal?.royalty_rate === royaltyDeal ||
                  (mostRecentDeal?.royalty_rate === undefined &&
                    royaltyDeal === '')) &&
                (mostRecentDeal?.guaranteed_minimum_royalty_payments ===
                  minimumDeal ||
                  (mostRecentDeal?.guaranteed_minimum_royalty_payments ===
                    undefined &&
                    minimumDeal === '')) &&
                (mostRecentDeal?.advance_payments === advancePayementsDeal ||
                  (mostRecentDeal?.advance_payments === undefined &&
                    advancePayementsDeal === '')) &&
                (mostRecentDeal?.payment_and_reporting ===
                  paymentAndReportingDeal ||
                  (mostRecentDeal?.payment_and_reporting === undefined &&
                    paymentAndReportingDeal === '')) &&
                (mostRecentDeal?.sample_requirements ===
                  sampleRequirementsDeal ||
                  (mostRecentDeal?.sample_requirements === undefined &&
                    sampleRequirementsDeal === '')) &&
                (mostRecentDeal?.sell_off_period === sellOfPeriodDeal ||
                  (mostRecentDeal?.sell_off_period === undefined &&
                    sellOfPeriodDeal === '')) &&
                (mostRecentDeal?.additional_provisions ===
                  additionalProvisionsDeal ||
                  (mostRecentDeal?.additional_provisions === undefined &&
                    additionalProvisionsDeal === '')) &&
                arraysEqual(mostRecentDeal?.custom_fields, customFields) ? (
                <FooterButtonsFour
                  onClickButton={openModalSubmit}
                  onClickButton2={saveDeal}
                  onClickButton3={openModalReject}
                  onClickButton4={openModalAccept}
                  buttonText4={t('deal-memo-editor.accept-proposal')}
                  buttonText3={t('deal-memo-editor.reject-proposal')}
                  buttonText2={t('save-draft')}
                  buttonText={t('deal-memo-editor.submit-proposal')}
                  error={submitError}
                  disabled={isDisabled}
                />
              ) : isActingUser &&
                (mostRecentDeal?.status === 'Draft' ||
                  mostRecentDeal?.status === 'Proposed') ? (
                <FooterButtonsFour
                  onClickButton={openModalSubmit}
                  onClickButton2={saveDeal}
                  onClickButton3={openModalReject}
                  buttonText3={t('deal-memo-editor.reject-proposal')}
                  buttonText2={t('save-draft')}
                  buttonText={t('deal-memo-editor.submit-proposal')}
                  error={submitError}
                  disabled={isDisabled}
                />
              ) : (
                <div className="!z-50 sm:fixed sm:left-0 sm:bottom-0 w-full  !bg-white !border-t-2 border-borderColor rounded-t-xl drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]">
                  <div className="flex items-center justify-center px-4 pt-5 pb-5 text-lg sm:px-10 lg:container lg:mx-auto font-custom1 text-inputGray">
                    {t(
                      'deal-memo-editor.waiting-on-other-party-to-take-action-on-deal'
                    )}
                  </div>
                </div>
              )
            ) : null}
          </>
        ) : (
          <CircleLoaderSpinner size={500} />
        )}
      </>
      <SelectionConfirmModal
        closeModal={closeModalAccept}
        onClick={() => {
          acceptDeal();
          closeModalAccept();
        }}
        isOpen={isOpenAccept}
        title={t('deal-memo-editor.accept-proposal')}
        text={t('deal-memo-editor.accept-modal-text')}
        buttonText={t('deal-memo-editor.accept-proposal')}
      />
      <SelectionConfirmModal
        closeModal={closeModalReject}
        onClick={() => {
          rejectDeal();
          closeModalReject();
        }}
        isOpen={isOpenReject}
        title={t('deal-memo-editor.reject-proposal')}
        text={t('deal-memo-editor.reject-modal-text')}
        buttonText={t('deal-memo-editor.reject-proposal')}
      />
      <SelectionConfirmModal
        closeModal={closeModalSubmit}
        onClick={() => {
          submitDeal();
          closeModalSubmit();
        }}
        isOpen={isOpenSubmit}
        title={t('deal-memo-editor.submit-proposal')}
        text={t('deal-memo-editor.submit-modal-text')}
        buttonText={t('deal-memo-editor.submit-proposal')}
      />
    </>
  );
};

export default DealMemoEditor;

type SelectionConfirmModalProps = {
  closeModal: () => void;
  onClick: () => void;
  isOpen: boolean;
  title: string;
  text: string;
  buttonText: string;
};

const SelectionConfirmModal: React.FC<SelectionConfirmModalProps> = ({
  closeModal,
  isOpen,
  title,
  text,
  buttonText,
  onClick,
}) => {
  return (
    <DialogModal closeModal={closeModal} isOpen={isOpen} dialogTitle={title}>
      <div className="py-10 mx-auto text-lg font-custom1 font-primary">
        {text}
      </div>
      <Button onClick={onClick}>{buttonText}</Button>
    </DialogModal>
  );
};
