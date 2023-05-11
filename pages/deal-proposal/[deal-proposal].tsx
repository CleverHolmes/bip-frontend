import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginFileMetadata from 'filepond-plugin-file-metadata';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import dayjs from 'dayjs';
import Head from 'next/head';
import Image from 'next/image';
import { NextRouter, useRouter } from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import Skeleton from 'react-loading-skeleton';
import TextareaAutosize from 'react-textarea-autosize';
import { toast } from 'react-toastify';
import type { NextPage, GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';

import { retrieveDeals } from 'api/deal/retrieveDeals';
import { GSSPBasic } from 'utils/gsspBasic';
import { FooterButtonsOnlyBack } from 'components/FooterButtonFolder/FooterButtonsOnlyBack';
import useStore from 'modules/Store';
import TextArea from 'components/TextArea';
import { FooterButtons } from 'components/FooterButtonFolder/FooterButtons';
import Button from 'components/Buttons/Button';
import {
  CustomType,
  DealResponse,
  DealAttachmentsResponse,
} from 'models/deals/deals';
import { findItemByUuid } from 'api/item/findItemByUuid';
import {
  CategoriesItem,
  ItemByUUIDResponse,
  ProductItem,
} from 'models/item/item';
import { findDealAttachmentsByUuid } from 'api/deal/findDealAttachmentsByUuid';
import { saveDraftRequest } from 'api/deal/saveDraftRequest';
import { sendDraftAsProposal } from 'api/deal/sendDraftAsProposal';
import { findUserByUuid } from 'api/user/findUserByUuid';
import { UserByUuidResponse } from 'models/user/user';
import Toast from 'components/Toast';
import { deleteFileAttachment } from 'api/deal/deleteFileAttachment';
import UploadedFileSmaller from 'components/UploadedFileSmaller';
import { convertedImageLogo } from 'public/helpers/convertedImageLogo';
import { uploadFileAttachment } from 'api/deal/uploadFileAttachment';
import InfoRow from 'components/InfoRow';
import FooterMain from 'components/FooterMain';
import { getCurrentUuid } from 'utils/getCurrentUuid';
import useAuth from 'hooks/useAuth';
import CircleLoaderSpinner from 'components/CircleLoaderSpinner';
import { throwError } from 'utils/error';
import useTokensOrCookies from 'contexts/TokensOrCookies';
import { getPrevRoute } from 'utils/getPrevRoute';
import routes from 'constants/routes';
import customImageLoader from 'utils/image-loader';

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileEncode,
  FilePondPluginFileMetadata
);

export const getServerSideProps: GetServerSideProps = GSSPBasic(async (ctx) => {
  return {
    props: {
      prevRoute: getPrevRoute(ctx),
    },
  };
});

interface Props {
  prevRoute?: string;
}

const DealProposal: NextPage = ({ prevRoute }: Props) => {
  const userUUID = useStore((state) => state.userUUID);
  const { t } = useTranslation();
  const { accessToken, companyRepresented } = useTokensOrCookies();
  const router: NextRouter = useRouter();
  const { query } = router;

  const [userData, setUserData] = useState<UserByUuidResponse>();

  const [descriptionInput, setDescriptionInput] = useState<string>('');
  const [product, setProduct] = useState<ItemByUUIDResponse | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');

  const handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  const [refreshImages, setRefreshImages] = useState<boolean>(false);
  const [imagesDraft, setImagesDraft] = useState<DealAttachmentsResponse[]>();
  const [DealRevisionResponse, setDealRevisionResponse] =
    useState<DealResponse>();
  const { isLogged } = useAuth();

  const [numberOfExtraLines, setNumberOfExtraLines] = useState<number>(0);
  const [extraContentKeys, setExtraContentKeys] = useState<string[]>([]);
  const [extraContentValues, setExtraContentValues] = useState<string[]>([]);
  const [collaborationProperty, setCollaborationProperty] = useState<string>();

  const senderUuid = getCurrentUuid();

  const [categoryString, setCategoryString] = useState('');

  // lookup for the main user information
  useEffect(() => {
    if (companyRepresented || userUUID) {
      const user = companyRepresented ? companyRepresented : userUUID;
      findUserByUuid(user)
        .then((res) => {
          setUserData(res);
        })
        .catch((err) => throwError(err));
    }
  }, [companyRepresented, userUUID]);

  useEffect(() => {
    if (senderUuid) {
      setRefreshImages(true);
    }
  }, [senderUuid]);

  useEffect(() => {
    if (query.draft && query.revise !== 'true' && userUUID) {
      const draftQuery = Array.isArray(query.draft)
        ? query.draft[0]
        : query.draft;

      const body = {
        user_uuid: companyRepresented ? companyRepresented : userUUID,
        uuid: draftQuery,
      };
      retrieveDeals(body).then((dealResponse: DealResponse[]) => {
        const specificDeal = dealResponse[0];
        specificDeal.collaboration_item &&
          setCollaborationProperty(specificDeal.collaboration_item.name);
      });
    }
  }, [accessToken, companyRepresented, userUUID, query.draft, query.revise]);

  useEffect(() => {
    if (query.draft && query.revise === 'true' && userUUID) {
      const draftQuery = Array.isArray(query.draft)
        ? query.draft[0]
        : query.draft;

      const body = {
        user_uuid: companyRepresented ? companyRepresented : userUUID,
        uuid: draftQuery,
      };
      retrieveDeals(body)
        .then((dealResponse: DealResponse[]) => {
          const specificDeal = dealResponse[0];
          setDealRevisionResponse(specificDeal);
          setDescriptionInput(specificDeal.description);
          setCategoryString(specificDeal.categories);
          setTerritoriesDeal(specificDeal.territories);
          setRoyaltyDeal(specificDeal.royalty_rate);
          setAdvancePayementsDeal(`$${specificDeal.advance_payments}`);
          setPropertyDeal(specificDeal.property);
          setTermDeal(specificDeal.term);
          setChannelsOfDistributionDeal(specificDeal.distribution_channels);
          setDateOfDistributionDeal(specificDeal.date_of_distribution);

          setLicensorMarketingCommitmentDeal(
            specificDeal.licensor_marketing_commitment
          );
          setExclusiveDeal(specificDeal.exclusive);
          setMinimumDeal(specificDeal.guaranteed_minimum_royalty_payments);
          setAdvancePayementsDeal(specificDeal.advance_payments);
          setPaymentAndReportingDeal(specificDeal.payment_and_reporting);
          setSampleRequirementsDeal(specificDeal.sample_requirements);
          setSellOffPeriodDeal(specificDeal.sell_off_period);
          setAdditionalProvisionsDeal(specificDeal.additional_provisions);

          setExtraContentKeys(
            specificDeal.custom_fields.map(
              (value: CustomType) => value.fieldName
            )
          );
          setExtraContentValues(
            specificDeal.custom_fields.map(
              (value: CustomType) => value.fieldValue
            )
          );
          setNumberOfExtraLines(specificDeal.custom_fields.length);
        })
        .catch((err: any) => {
          throwError(err);
        });
    }
  }, [accessToken, companyRepresented, userUUID, query.draft, query.revise]);

  useEffect(() => {
    if (query.revise !== 'true' && query['deal-proposal']) {
      if (!router.isReady) return;
      const itemQuery = Array.isArray(query['deal-proposal'])
        ? query['deal-proposal'][0]
        : query['deal-proposal'];

      findItemByUuid(itemQuery)
        .then((res) => {
          const data = res;

          let cs = '';
          data.categories.map((item: CategoriesItem) => {
            cs += `${item.category_name}: `;
            item.products.map((prod: ProductItem, index: number) => {
              cs +=
                prod.product_name +
                (index !== item.products.length - 1 ? ', ' : ' \n');
            });
          });
          setCategoryString(cs);
          setProduct(data);
          if (!!data.territories) {
            setTerritoriesDeal(
              data.territories.toString().replaceAll(',', ', ')
            );
          }
          if (!!data.royalty_percent) {
            setRoyaltyDeal(data.royalty_percent.toString() + '%');
          }
          if (!!data.royalty_percent) {
            setMinimumDeal(`${data.royalty_percent}%`);
          }
          if (!!data.minimum_guarantee_amount) {
            setAdvancePayementsDeal(`$${data.minimum_guarantee_amount}`);
          }
          if (!!data.name) {
            setPropertyDeal(data.name);
          }
          if (!!data.offer_deadline) {
            setTermDeal(dayjs(data.offer_deadline).format('MMM DD, YYYY'));
          }
          if (!!data.distribution_channels) {
            setChannelsOfDistributionDeal(
              data.distribution_channels.join(', ')
            );
          }
        })
        .catch((err) => throwError(err));
    } else if (
      query.revise === 'true' &&
      !!DealRevisionResponse &&
      query['deal-proposal']
    ) {
      const itemQuery = Array.isArray(query['deal-proposal'])
        ? query['deal-proposal'][0]
        : query['deal-proposal'];

      findItemByUuid(itemQuery)
        .then((res) => {
          setProduct(res);
        })
        .catch((err) => throwError(err));
    }
  }, [accessToken, query, router.isReady, query.revise, DealRevisionResponse]);

  const saveDraft = () => {
    if (!!query.draft) {
      setIsSubmitting(true);

      const draftRequest = Array.isArray(query.draft)
        ? query.draft[0]
        : query.draft;

      const keys = extraContentKeys;
      const values = extraContentValues;
      const customFields = keys.map((key: string, i: number) => {
        return { fieldName: key, fieldValue: values[i] };
      });
      const data = {
        uuid: draftRequest,
        user_uuid: companyRepresented ? companyRepresented : userUUID,
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

      // @ts-ignore
      saveDraftRequest(data)
        .then(() => {
          setFile([]);
          router.push(routes.dealStatus);
          toast(<Toast message={t('deal.your-draft-has-been-saved')} />);
        })
        .catch((err) => {
          setFile([]);
          setIsSubmitting(false);
          setSubmitError(JSON.parse(err.request.response).message);
        });
    }
  };

  const requestDeal = async () => {
    if (!!query.draft) {
      setIsSubmitting(true);

      const draftRequest = Array.isArray(query.draft)
        ? query.draft[0]
        : query.draft;

      const keys = extraContentKeys;
      const values = extraContentValues;
      const customFields = keys.map((key: string, i: number) => {
        return { fieldName: key, fieldValue: values[i] };
      });

      const data = {
        uuid: draftRequest,
        user_uuid: companyRepresented ? companyRepresented : userUUID,
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

      try {
        // @ts-ignore
        const res = await saveDraftRequest(data);
        const draftUUID = res.uuid;

        const dataDraft = {
          uuid: draftUUID,
          user_uuid: companyRepresented ? companyRepresented : userUUID,
        };

        await sendDraftAsProposal(dataDraft);
        setFile([]);
        setSuccess(true);
        setIsSubmitting(false);
      } catch (err: any) {
        setIsSubmitting(false);
        setFile([]);
        setSubmitError(JSON.parse(err.request.response).message);
      }
    }
  };

  const DeleteFile = (item: string) => {
    const config = {
      data: {
        uris: [item],
        user_uuid: companyRepresented ? companyRepresented : userUUID,
      },
    };
    deleteFileAttachment(config)
      .then((res) => {
        setRefreshImages(true);
      })
      .catch((err: any) => throwError(err));
  };

  const onClickBack = () => {
    if (prevRoute) router.push(prevRoute);
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

  useEffect(() => {
    if (query.revise === 'true') {
      setRefreshImages(true);
    }
  }, [setRefreshImages, query.revise]);

  useEffect(() => {
    if (isLogged && refreshImages && query.draft && senderUuid) {
      const draftQuery = Array.isArray(query.draft)
        ? query.draft[0]
        : query.draft;

      const item = {
        user_uuid: senderUuid,
        deal_uuid: draftQuery,
      };

      findDealAttachmentsByUuid(item)
        .then((res) => {
          setImagesDraft(res);
          setRefreshImages(false);
        })
        .catch((err) => {
          throwError(err);
          setRefreshImages(false);
        });
    }
  }, [isLogged, refreshImages, query.draft, query.revise]);

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

  return (
    <>
      <Head>
        <title>Deal Proposal</title>
      </Head>
      <div className="relative flex flex-col h-full min-h-screen mx-5 mb-40 lg:mx-auto lg:container">
        <div className="fixed bottom-0 right-0 z-[-1] overflow-hidden pointer-events-none">
          <Image
            src="/images/BackgroundBlur.svg"
            alt="background-blur"
            width={1353}
            height={524}
            objectPosition="right bottom"
            layout="fixed"
          />
        </div>
        <div className="pt-10">
          <Image
            src="/images/LogoPrimary.svg"
            width={61}
            height={34}
            alt="BIP logo"
            onClick={() => router.push('/explore')}
            className="cursor-pointer"
          />
        </div>
        {isSubmitting ? (
          <CircleLoaderSpinner size={500} />
        ) : success ? (
          <div className="container relative flex flex-col items-center pt-10 pl-6 mx-auto">
            <div className="px-4 py-6 mt-20 mr-5 text-3xl font-bold text-primary lg:text-5xl font-custom1">
              {t('congratulations')}
            </div>
            <div className="px-4 py-2 mb-20 mr-5 text-lg text-center text-primary font-custom1">
              {t('deal.your-request-has-been-successfully-submitted')}
            </div>
            <button
              onClick={() => {
                router.push('/deal-status');
              }}
              className={
                'bg-button rounded-full text-white flex justify-center items-center cursor-pointer hover:bg-buttonHover2 hover:shadow-lg focus:bg-buttonHover2 focus:shadow-lg focus:outline-none focus:ring focus:ring-button/50 active:bg-buttonHover2 active:shadow-lg transition duration-150 ease-in-out py-3.5 w-72 font-bold font-custom1 text-xl mt-2'
              }
            >
              {t('deal.go-to-deals')}
            </button>
          </div>
        ) : (
          <div>
            <div className="mt-16 mb-12 text-3xl font-extrabold font-custom1 lg:text-5xl text-primary lg:mb-16">
              {t('deal.deal-proposal')}
            </div>
            <div className="grid grid-cols-1 gap-4 my-4 lg:grid-cols-10">
              <div className="lg:col-span-6">
                <div>
                  <div className="mb-6 text-xl font-bold font-custom1 lg:text-3xl text-primary lg:mb-8">
                    {t('deal.summarize-your-offer')}
                  </div>
                  <div className="flex flex-col px-5 py-5 mb-10 rounded-lg shadow-lg md:px-10 md:py-10 lg:px-10 lg:pt-16 lg:pb-10 hover:shadow-inner hover:shadow-button/50 lg:mb-16">
                    <TextArea
                      name="deal_description"
                      placeholder={t('deal.tell-us-in-a-few-words')}
                      value={descriptionInput}
                      onChange={handleChangeDescription}
                      max={500}
                      smaller
                    />
                    <div className="text-xs text-right font-custom1 font-inputGray">
                      ({t('deal.max-500-characters')})
                    </div>
                  </div>
                </div>
                <div className="mt-10 mb-6 text-xl font-bold font-custom1 lg:text-3xl text-primary lg:mb-8">
                  {t('deal.deal-specifics')}
                </div>
                {product && userData && (
                  <div className="mt-6 bg-white border-4 lg:grid lg:grid-cols-9 border-button text-blueText">
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
                        {DealRevisionResponse
                          ? DealRevisionResponse.user.company_name
                          : product.user.company_name}
                      </div>
                    </div>
                    <div className="p-2 border-2 lg:col-span-3 border-button">
                      {t('deal.party')} 2:
                    </div>
                    <div className="border-2 lg:col-span-6 border-button bg-backgroundInput">
                      <div className="p-2">
                        {DealRevisionResponse
                          ? DealRevisionResponse.counterparty.company_name
                          : userData.company_name}
                      </div>
                    </div>

                    {((DealRevisionResponse &&
                      DealRevisionResponse.deal_type === 'Collaboration') ||
                      collaborationProperty) && (
                      <>
                        <div className="p-2 border-2 lg:col-span-3 border-button">
                          {t('deal.collaboration-brand')}:
                        </div>
                        <div className="border-2 lg:col-span-6 border-button bg-backgroundInput">
                          <div className="p-2">
                            {DealRevisionResponse
                              ? DealRevisionResponse.collaboration_item.name
                              : collaborationProperty}
                          </div>
                        </div>
                      </>
                    )}

                    <div className="p-2 border-2 border-r-2 lg:col-span-3 border-button">
                      1. {t('listing')}:
                    </div>
                    <div className="border-2 lg:col-span-6 border-button bg-backgroundInput">
                      <div className="p-2">{propertyDeal || '-'}</div>
                    </div>
                    <div className="p-2 border-2 lg:col-span-3 border-button">
                      2. {t('deal.exclusive')}:
                    </div>
                    <div className="border-2 lg:col-span-6 border-button">
                      <div className="p-2">
                        <TextareaAutosize
                          className="w-full p-2 cursor-pointer"
                          placeholder={t(
                            'deal.yes-exclusive-or-no-not-exclusive'
                          )}
                          value={exclusiveDeal}
                          onChange={(e) => setExclusiveDeal(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="p-2 border-2 lg:col-span-3 border-button">
                      3. {t('product-categories')}:
                    </div>
                    <div
                      className={
                        'border-2 lg:col-span-6 border-button' +
                        (product.non_negotiable_terms.includes('categories')
                          ? ' bg-backgroundInput'
                          : '')
                      }
                    >
                      <div className="p-2">
                        {product.non_negotiable_terms.includes('categories') ? (
                          `${categoryString || '-'}`
                        ) : (
                          <TextareaAutosize
                            className="w-full h-full p-2 whitespace-pre-line cursor-pointer"
                            placeholder={t('deal.what-product-categories')}
                            value={`${categoryString}`}
                            onChange={(e) => setCategoryString(e.target.value)}
                          />
                        )}
                      </div>
                    </div>
                    <div className="p-2 border-2 lg:col-span-3 border-button">
                      4. {t('deal.territory')}:
                    </div>
                    <div
                      className={
                        'border-2 lg:col-span-6 border-button' +
                        (product.non_negotiable_terms.includes('territories')
                          ? ' bg-backgroundInput'
                          : '')
                      }
                    >
                      <div className="p-2">
                        {product.non_negotiable_terms.includes(
                          'territories'
                        ) ? (
                          `${territoriesDeal || '-'}`
                        ) : (
                          <TextareaAutosize
                            className="w-full p-2 cursor-pointer"
                            placeholder={t(
                              'deal.worldwide-or-separate-territories'
                            )}
                            value={territoriesDeal}
                            onChange={(e) => setTerritoriesDeal(e.target.value)}
                          />
                        )}
                      </div>
                    </div>
                    <div className="p-2 border-2 lg:col-span-3 border-button">
                      5. {t('deal.term')}:
                    </div>
                    <div className="border-2 lg:col-span-6 border-button">
                      <div className="p-2">
                        <TextareaAutosize
                          className="w-full p-2 cursor-pointer"
                          placeholder={t('deal.upon-signature-through') + '...'}
                          value={termDeal}
                          onChange={(e) => setTermDeal(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="p-2 border-2 lg:col-span-3 border-button">
                      6. {t('deal.channels-of-distribution')}:
                    </div>
                    <div
                      className={
                        'border-2 lg:col-span-6 border-button' +
                        (product.non_negotiable_terms.includes(
                          'distribution_channels'
                        )
                          ? ' bg-backgroundInput'
                          : '')
                      }
                    >
                      <div className="p-2">
                        {product.non_negotiable_terms.includes(
                          'distribution_channels'
                        ) ? (
                          `${channelsOfDistributionDeal || '-'}`
                        ) : (
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
                        )}
                      </div>
                    </div>
                    <div className="p-2 border-2 lg:col-span-3 border-button">
                      7. {t('deal.date-of-distribution')}:
                    </div>
                    <div className="border-2 lg:col-span-6 border-button">
                      <div className="p-2">
                        <TextareaAutosize
                          className="w-full p-2 cursor-pointer"
                          placeholder="Date of distribution"
                          value={dateOfDistributionDeal}
                          onChange={(e) =>
                            setDateOfDistributionDeal(e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="p-2 border-2 lg:col-span-3 border-button">
                      8. {t('deal.licensor-marketing-commitments')}:
                    </div>
                    <div className="border-2 lg:col-span-6 border-button">
                      <div className="p-2">
                        <TextareaAutosize
                          className="w-full p-2 cursor-pointer"
                          placeholder=""
                          value={licensorMarketingCommitment}
                          onChange={(e) =>
                            setLicensorMarketingCommitmentDeal(e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="p-2 border-2 lg:col-span-3 border-button">
                      9. {t('deal.royalty-rate')}:
                    </div>

                    <div
                      className={
                        'border-2 lg:col-span-6 border-button' +
                        (product.non_negotiable_terms.includes(
                          'royalty_percent'
                        )
                          ? ' bg-backgroundInput'
                          : '')
                      }
                    >
                      <div className="p-2">
                        {product.non_negotiable_terms.includes(
                          'royalty_percent'
                        ) ? (
                          `${royaltyDeal || '-'}`
                        ) : (
                          <TextareaAutosize
                            className="w-full p-2 cursor-pointer"
                            placeholder=""
                            value={royaltyDeal}
                            onChange={(e) => setRoyaltyDeal(e.target.value)}
                          />
                        )}
                      </div>
                    </div>

                    <div className="p-2 border-2 lg:col-span-3 border-button">
                      10. {t('deal.guaranteed-minimum-royalty-payment')}:
                    </div>
                    <div
                      className={
                        'border-2 lg:col-span-6 border-button' +
                        (product.non_negotiable_terms.includes(
                          'minimum_guarantee'
                        )
                          ? ' bg-backgroundInput'
                          : '')
                      }
                    >
                      <div className="p-2">
                        {product.non_negotiable_terms.includes(
                          'minimum_guarantee'
                        ) ? (
                          `${minimumDeal || '-'}`
                        ) : (
                          <TextareaAutosize
                            className="w-full p-2 cursor-pointer"
                            placeholder=""
                            value={minimumDeal}
                            onChange={(e) => setMinimumDeal(e.target.value)}
                          />
                        )}
                      </div>
                    </div>
                    <div className="p-2 border-2 lg:col-span-3 border-button">
                      11. {t('deal.advance-payments')}:
                    </div>
                    <div
                      className={
                        'border-2 lg:col-span-6 border-button' +
                        (product.non_negotiable_terms.includes(
                          'minimum_guarantee'
                        )
                          ? ' bg-backgroundInput'
                          : '')
                      }
                    >
                      <div className="p-2">
                        {product.non_negotiable_terms.includes(
                          'minimum_guarantee'
                        ) ? (
                          `${advancePayementsDeal || '-'}`
                        ) : (
                          <TextareaAutosize
                            className="w-full p-2 cursor-pointer"
                            placeholder=""
                            value={advancePayementsDeal}
                            onChange={(e) =>
                              setAdvancePayementsDeal(e.target.value)
                            }
                          />
                        )}
                      </div>
                    </div>
                    <div className="p-2 border-2 lg:col-span-3 border-button">
                      12. {t('deal.payment-and-reporting')}:
                    </div>
                    <div className="border-2 lg:col-span-6 border-button">
                      <div className="p-2">
                        <TextareaAutosize
                          className="w-full p-2 cursor-pointer"
                          placeholder=""
                          value={paymentAndReportingDeal}
                          onChange={(e) =>
                            setPaymentAndReportingDeal(e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="p-2 border-2 lg:col-span-3 border-button">
                      13. {t('deal.sample-requirements')}:
                    </div>
                    <div className="border-2 lg:col-span-6 border-button">
                      <div className="p-2">
                        <TextareaAutosize
                          className="w-full p-2 cursor-pointer"
                          placeholder=""
                          value={sampleRequirementsDeal}
                          onChange={(e) =>
                            setSampleRequirementsDeal(e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="p-2 border-2 lg:col-span-3 border-button">
                      14. {t('deal.sell-off-period')}:
                    </div>
                    <div className="border-2 lg:col-span-6 border-button">
                      <div className="p-2">
                        <TextareaAutosize
                          className="w-full p-2 cursor-pointer"
                          placeholder=""
                          value={sellOfPeriodDeal}
                          onChange={(e) => setSellOffPeriodDeal(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="p-2 border-2 lg:col-span-3 border-button">
                      15. {t('deal.additional-provisions')}:
                    </div>
                    <div className="border-2 lg:col-span-6 border-button">
                      <div className="p-2">
                        <TextareaAutosize
                          className="w-full p-2 cursor-pointer"
                          placeholder=""
                          value={additionalProvisionsDeal}
                          onChange={(e) =>
                            setAdditionalProvisionsDeal(e.target.value)
                          }
                        />
                      </div>
                    </div>
                    {[...Array(numberOfExtraLines)].map(
                      (_: string, index: number) => {
                        return (
                          <Fragment key={index}>
                            <div className="flex p-2 border-2 lg:col-span-3 border-button">
                              {index + 16}.
                              <TextareaAutosize
                                className="w-full p-2 ml-2 cursor-pointer"
                                name={`ExtraKey-${index}`}
                                placeholder=""
                                value={extraContentKeys[index] || ''}
                                onChange={(e) =>
                                  setKeyExtraField(e.target.value, index)
                                }
                              />
                            </div>
                            <div className="border-2 lg:col-span-5 border-button">
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
                            <div className="border-2 lg:col-span-1 border-button">
                              <div
                                className="flex items-center justify-center h-10 m-2 text-white transition duration-150 ease-in-out rounded-full cursor-pointer lg:w-10/12 bg-button hover:bg-buttonHover2 hover:shadow-lg focus:bg-buttonHover2 focus:shadow-lg focus:outline-none focus:ring focus:ring-button/50 active:bg-buttonHover2 active:shadow-lg"
                                onClick={() => RemoveItem(index)}
                              >
                                X
                              </div>
                            </div>
                          </Fragment>
                        );
                      }
                    )}
                    <div className="m-2 mx-auto lg:col-span-9">
                      <Button smaller onClick={() => addALine()}>
                        {t('deal.add-a-line')}
                      </Button>
                    </div>
                  </div>
                )}
                <div>
                  <div className="mt-10 mb-6 text-xl font-bold font-custom1 lg:text-3xl text-primary lg:mb-8">
                    {t('deal.additional-proposal-documentation')}
                  </div>

                  <div className="flex flex-col px-10 pt-10 pb-2 mt-10 border-2 rounded-lg shadow-lg hover:shadow-inner hover:shadow-button/50 lg:px-20 lg:py-20 border-backgroundInput">
                    {!!query.draft && (
                      <FilePond
                        allowFileMetadata={true}
                        files={file && file}
                        dropOnPage={true}
                        fileMetadataObject={{
                          user_uuid: companyRepresented
                            ? companyRepresented
                            : userUUID,
                          deal_uuid: query.draft,
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
                    )}
                  </div>
                  <div className="mt-10 mb-6 text-xl font-bold font-custom1 lg:text-3xl text-primary lg:mb-8">
                    {t('deal.uploaded-images')}
                  </div>
                  <div className="flex flex-wrap mt-10 border-2 rounded-lg shadow-lg lg:px-10 lg:py-10 border-backgroundInput">
                    {!imagesDraft || imagesDraft?.length === 0 ? (
                      <div className="mx-auto mt-10 mb-10 text-xl text-center font-custom1 text-inputGray">
                        {t('no-uploaded-files')}...
                      </div>
                    ) : (
                      <div className="flex flex-wrap mt-5">
                        {imagesDraft &&
                          imagesDraft.map((item: DealAttachmentsResponse) => {
                            let image = convertedImageLogo(item.uri);
                            return (
                              <UploadedFileSmaller
                                image={image}
                                key={item.uri}
                                uri={item.uri}
                                title={item.filename_original}
                                deleteFile={DeleteFile}
                                deleteCapable={true}
                              />
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className="flex items-center max-w-2xl px-4 py-3 mx-auto my-20 text-sm font-bold text-white rounded-lg bg-button font-custom2"
                  role="alert"
                >
                  <svg
                    className="w-4 h-4 mr-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
                  </svg>
                  <p>
                    {t('deal.non-negotiable-fields-can-not-be-edited')}
                    <br />
                    {t(
                      'deal.the-more-thorough-your-proposal-the-more-likely-it-will-be-accepted'
                    )}
                  </p>
                </div>
              </div>
              <div className="relative flex flex-col lg:col-span-4">
                <div className="mb-6 text-xl font-bold sm:ml-8 font-custom1 lg:text-3xl text-primary lg:mb-8">
                  {t('deal.listing-details')}
                </div>
                {product !== null ? (
                  <div className="relative flex flex-col justify-center pb-12 transition-all duration-300 border-2 rounded-lg shadow-lg border-borderColor hover:-translate-y-2 sm:mx-5">
                    {product.image_logo && (
                      <div className="relative w-full text-center">
                        <Image
                          loader={customImageLoader}
                          src={product.image_logo}
                          alt={product.name}
                          width={160}
                          height={160}
                          className="rounded-xl"
                        />
                      </div>
                    )}
                    <div className="flex flex-col mx-4 mt-8 sm:mx-6">
                      <div className="mb-10 text-xl font-bold font-custom1 text-primary">
                        {product.name}
                      </div>

                      {product.categories?.length > 0 &&
                        product.categories.map((category: CategoriesItem) => {
                          const productArr = category.products.map(
                            (obj: ProductItem) => {
                              return obj.product_name;
                            }
                          );

                          return (
                            <InfoRow
                              key={category.category_name}
                              description={`${productArr.join(', ')}`}
                              title={`${category.category_name}`}
                            />
                          );
                        })}
                      {product.distribution_channels?.length > 0 && (
                        <InfoRow
                          description={`${product.distribution_channels.join(
                            ', '
                          )}`}
                          title={t('deal.distribution-channels')}
                          locked={product.non_negotiable_terms.includes(
                            'distribution_channels'
                          )}
                        />
                      )}
                      {product.territories?.length > 0 && (
                        <InfoRow
                          description={`${product.territories.join(', ')}`}
                          title={t('deal.territories')}
                          locked={product.non_negotiable_terms.includes(
                            'territories'
                          )}
                        />
                      )}
                      {!!product.minimum_guarantee_percent && (
                        <InfoRow
                          description={`${product.minimum_guarantee_percent}%`}
                          title={t('deal.min-guarantee-percent')}
                          locked={product.non_negotiable_terms.includes(
                            'minimum_guarantee'
                          )}
                        />
                      )}
                      {!!product.minimum_guarantee_amount && (
                        <InfoRow
                          description={`$${product.minimum_guarantee_amount.toLocaleString(
                            'en-US',
                            { style: 'decimal', minimumFractionDigits: 0 }
                          )}`}
                          title={t('deal.min-guarantee-dollar')}
                          locked={product.non_negotiable_terms.includes(
                            'minimum_guarantee'
                          )}
                        />
                      )}
                      {!!product.royalty_percent && (
                        <InfoRow
                          description={`${product.royalty_percent}%`}
                          title={t('deal.royalty-percent')}
                          locked={product.non_negotiable_terms.includes(
                            'royalty_percent'
                          )}
                        />
                      )}
                      {product.offer_deadline && (
                        <InfoRow
                          description={`${dayjs(product.offer_deadline).format(
                            'MMM DD, YYYY'
                          )}`}
                          title={t('deal.offer-deadline')}
                          locked={product.non_negotiable_terms.includes(
                            'offer_deadline'
                          )}
                        />
                      )}
                      {!!product.description && (
                        <InfoRow
                          description={product.description}
                          title="description"
                          locked={product.non_negotiable_terms.includes(
                            'description'
                          )}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="relative flex flex-col items-center justify-start pb-2 mx-4 border-2 rounded-lg shadow-lg border-borderColor h-104">
                    <div className="relative w-full h-48 px-6 py-2">
                      <Skeleton width="100%" height={192} />
                    </div>
                    <div className="relative w-full h-12 p-6 mt-4">
                      <Skeleton
                        width="100%"
                        height={20}
                        className="px-6 py-2"
                      />
                      <Skeleton
                        width="100%"
                        height={20}
                        className="px-6 py-2"
                      />
                      <Skeleton
                        width="100%"
                        height={20}
                        className="px-6 py-2"
                      />
                      <Skeleton
                        width="100%"
                        height={20}
                        className="px-6 py-2"
                      />
                      <Skeleton
                        width="100%"
                        height={20}
                        className="px-6 py-2"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <FooterMain aboveBottomButtons={true} />
      {product !== null && !isSubmitting && !success ? (
        <FooterButtons
          error={submitError}
          onClickBack={onClickBack}
          onClickButton2={saveDraft}
          onClickButton={requestDeal}
          buttonText2={t('save-draft')}
          buttonText={t('deal.request-deal')}
          disabled={isSubmitting}
        />
      ) : (
        <FooterButtonsOnlyBack onClickBack={onClickBack} />
      )}
    </>
  );
};

export default DealProposal;
