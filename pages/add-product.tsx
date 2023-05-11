import 'react-datepicker/dist/react-datepicker.css';
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { NextRouter, useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import Slider from 'rc-slider';
import AvatarEditor from 'react-avatar-editor';
import { FilePondFile } from 'filepond';
import { useQueryClient } from '@tanstack/react-query';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { onlyImages } from 'constants/acceptedFiles';
import { GSSPBasic } from 'utils/gsspBasic';
import BubbleList from 'components/BubbleLists/BubbleList';
import BubbleListAndInput from 'components/BubbleLists/BubbleListAndInput';
import CategoriesProducts from 'components/CategoriesProducts';
import CheckBoxes from 'components/CheckBoxes';
import { FooterButtonsNoBack } from 'components/FooterButtonFolder/FooterButtonsNoBack';
import Icon from 'components/Icon';
import OwnImage from 'components/Image';
import InputDate from 'components/InputDate';
import InputDoubleNoRegister from 'components/InputDoubleNoRegister';
import MultipleFileUploadField from 'components/MultipleFileUploadField';
import SliderInput from 'components/SliderInput';
import TextArea from 'components/TextArea';
import Paper from 'components/Paper';
import {
  channelsOfDist,
  channelsOfDistValue,
  listOfBrandCategories,
  listOfTerritories,
  step20marks,
  typeOfDeal,
  typesOfTerritories,
} from 'public/helpers/data';
import useStore from 'modules/Store';
import routes from 'constants/routes';
import { createUuid } from 'api/item/createUuid';
import { findItemImagesByUuid } from 'api/item/findItemImagesByUuid';
import { postItem } from 'api/item/postItem';
import {
  DealTypeEnum,
  ItemDocumentsByUuidResponse,
  MediaUriEnum,
  PostItemRequest,
} from 'models/item/item';
import { deleteImage } from 'api/item/deleteImage';
import InfoBox from 'components/InfoBox';
import { findItemDocumentsByUuidCall } from 'api/item/findItemDocumentsByUuid';
import { convertedImageLogo } from 'public/helpers/convertedImageLogo';
import { deleteDocumentCall } from 'api/item/deleteDocument';
import FooterMain from 'components/FooterMain';
import CircleLoaderSpinner from 'components/CircleLoaderSpinner';
import { throwError } from 'utils/error';
import InputNoRegister from 'components/InputNoRegister';
import CheckboxNoRegister from 'components/CheckboxNoRegister';
import DialogModal from 'components/DialogModal';
import Input from 'components/Input';
import FileUploadField, { FileBase64Type } from 'components/FileUploadField';
import { postItemLogoImageBase64Call } from 'api/item/postItemLogoImageBase64Call';
import useTokensOrCookies from 'contexts/TokensOrCookies';
import { findItemsQueryKey } from 'api/item/findItems';
import { delegateQueryKey } from 'api/delegate/delegate';
import validations from 'utils/validations';

export const getServerSideProps: GetServerSideProps = GSSPBasic();

const AddProduct: NextPage = () => {
  let editor: any;
  const userUUID = useStore((state) => state.userUUID);
  const { companyRepresented } = useTokensOrCookies();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const router: NextRouter = useRouter();

  const [brandCategories, setBrandCategories] = useState<{
    selections: string[];
  }>({
    selections: [],
  });
  const [territories, setTerritories] = useState<{ selections: string[] }>({
    selections: [],
  });
  const [channelsOfDistribution, setChannelsOfDistribution] = useState<{
    selections: string[];
  }>({
    selections: [],
  });
  const [nonNegotionableTerms, setNonNegotionableTerms] = useState<string[]>(
    []
  );

  const handleToggle = (item: string) => {
    if (nonNegotionableTerms.includes(item)) {
      setNonNegotionableTerms(nonNegotionableTerms.filter((i) => item !== i));
    } else {
      setNonNegotionableTerms([...nonNegotionableTerms, item]);
    }
  };

  const [stateCheckBox, setStateCheckBox] = useState<{
    selections: Array<keyof typeof DealTypeEnum>;
  }>({
    selections: [] as Array<keyof typeof DealTypeEnum>,
  });

  function handleCheckboxChange(key: keyof typeof DealTypeEnum) {
    let sel = stateCheckBox.selections;
    let find = sel.indexOf(key);
    if (find > -1) {
      sel.splice(find, 1);
    } else {
      sel.push(key);
    }

    setStateCheckBox({
      selections: sel,
    });
  }

  const [images, setImages] = useState<FilePondFile[]>([]);
  const [documents, setDocuments] = useState<FilePondFile[]>([]);
  const [imagesDraft, setImagesDraft] = useState<string[]>([]);
  const [documentsDraft, setDocumentsDraft] =
    useState<ItemDocumentsByUuidResponse>([]);
  const [imagesError, setImagesError] = useState<string>();
  const [propertyName, setPropertyName] = useState<string>('');
  const [propertyNameError, setPropertyNameError] = useState('');
  const [minimumGuaranteeAmount, setMinimumGuaranteeAmount] =
    useState<string>();
  const [minimumGuaranteePercent, setMinimumGuaranteePercent] =
    useState<string>();
  const [royalty, setRoyalty] = useState<number>(0);
  const [offerDeadline, setOfferDeadline] = useState<Date>();
  const [propertyDescription, setPropertyDescription] = useState<string>('');
  const [categoriesProducts, setCategoriesProducts] = useState<any>([]);
  const [submitError, setSubmitError] = useState<string>('');
  const [propertyDescriptionError, setPropertyDescriptionError] =
    useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [refreshImages, setRefreshImages] = useState<boolean>(false);
  const [refreshDocuments, setRefreshDocuments] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedBase64Files, setUploadedBase64Files] = useState<
    FileBase64Type[]
  >([]);
  const [uploadedFilesError, setUploadedFilesError] = useState(false);

  const [itemUUID, setItemUUID] = useState<string>('');
  const [zoom, setZoom] = useState(1);

  const setEditorRef = (ed: any) => {
    editor = ed;
  };

  useEffect(() => {
    if (itemUUID === '' && (userUUID || companyRepresented)) {
      const user = {
        user_uuid: companyRepresented ? companyRepresented : userUUID,
      };

      createUuid(user)
        .then((res) => {
          setItemUUID(res.uuid);
        })
        .catch((err) => throwError(err));
    }
  }, [itemUUID, userUUID, companyRepresented]);

  const handleChange = (e: any) => {
    setPropertyName(e.target.value);
  };

  const [stateCheckBoxDisclosure, setStateCheckBoxDisclosure] =
    useState<boolean>(false);

  const [checkBoxDisclosureError, setCheckBoxDisclosureError] =
    useState<string>('');

  const handleCheckboxChangeDisclosure = () => {
    setStateCheckBoxDisclosure(!stateCheckBoxDisclosure);
  };

  useEffect(() => {
    if (refreshImages) {
      findItemImagesByUuid(itemUUID)
        .then((res) => {
          setImagesDraft(res.images);
          setRefreshImages(false);
        })
        .catch((err) => {
          throwError(err);
          setRefreshImages(false);
        });
    }
  }, [itemUUID, refreshImages]);

  useEffect(() => {
    if (refreshDocuments) {
      findItemDocumentsByUuidCall(itemUUID)
        .then((res) => {
          setDocumentsDraft(res);
          setRefreshDocuments(false);
        })
        .catch((err) => {
          throwError(err);
          setRefreshDocuments(false);
        });
    }
  }, [itemUUID, refreshDocuments]);

  const validationSchema = Yup.object().shape({
    youtubeMedia: validations.youtubeMedia,
  });
  const {
    register,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  const youtubeMedia = watch('youtubeMedia');

  let [isOpenTermsModal, setIsOpenTermsModal] = useState<boolean>(false);

  function closeTermsModal() {
    setIsOpenTermsModal(false);
  }
  function openTermsModal() {
    setIsOpenTermsModal(true);
  }

  const uploadFiles = (files: File[]) => {
    setUploadedFiles(files);
  };

  const uploadBase64Files = (files: FileBase64Type[]) => {
    setUploadedBase64Files(files);
  };

  const submit = () => {
    let item = getValues('distribution_channels');
    let demographicTarget = getValues('demographic_target');
    let demographicGender = getValues('demographic_gender');
    let demographicAge = getValues('demographic_age');
    let demographicRegion = getValues('demographic_region');
    let distSel = channelsOfDistribution.selections;
    if (!distSel.includes(item) && item) {
      distSel.push(item);
    }
    if (propertyName === '') {
      setPropertyNameError('*Please create a property name');
      setSubmitError('*Please fix all errors above');
    } else if (propertyName.length < 4) {
      setPropertyNameError('*Please enter a name with more than 4 characters');
      setSubmitError('*Please fix all errors above');
    } else {
      setPropertyNameError('');
    }

    if (uploadedBase64Files.length === 0) {
      setUploadedFilesError(true);
    } else {
      setUploadedFilesError(false);
    }

    if (propertyDescription.length < 4) {
      setPropertyDescriptionError(
        '*Please enter a description with more than 3 characters'
      );
      setSubmitError('*Please fix all errors above');
    } else {
      setPropertyDescriptionError('');
    }

    if (!stateCheckBoxDisclosure) {
      setCheckBoxDisclosureError('*' + t('add-product.terms-error'));
    } else {
      setCheckBoxDisclosureError('');
    }

    if (errors.youtubeMedia?.message) {
      setSubmitError('*Please fix all errors above');
    }

    if (images.length === 0) {
      setImagesError('*Please upload at least one image');
      setSubmitError('*Please fix all errors above');
    } else {
      setImagesError('');
    }
    // allowed to not have a deal type
    // if (stateCheckBox.selections.length === 0) {
    //   setExplorePageError('*Please choose a deal type');
    //   setSubmitError('*Please fix all errors above');
    // } else {
    //   setExplorePageError('');
    // }

    if (
      propertyName.length >= 4 &&
      images.length !== 0 &&
      // stateCheckBox.selections.length > 0 &&
      userUUID &&
      propertyDescription.length > 4 &&
      stateCheckBoxDisclosure &&
      uploadedBase64Files.length > 0 &&
      !errors.youtubeMedia?.message
    ) {
      setIsSubmitting(true);
      setSubmitError('');

      const canvasScaled = editor.getImageScaledToCanvas();
      const croppedImg = canvasScaled.toDataURL();
      const item = {
        fileContentsBase64String: croppedImg,
        filename_original: uploadedBase64Files[0].filenameOriginal,
        item_uuid: itemUUID,
      };

      const property: PostItemRequest = {
        uuid: itemUUID,
        // required
        name: propertyName,
        description: propertyDescription,
        item_type: 'Licensable Property',
        territories: territories.selections
          ? territories.selections
          : undefined,
        categories: categoriesProducts ? categoriesProducts : undefined,
        categories_brand: brandCategories.selections
          ? brandCategories.selections
          : undefined,
        offer_deadline: offerDeadline ? offerDeadline.toISOString() : undefined,
        royalty_percent: royalty ? royalty : undefined,
        non_negotiable_terms: nonNegotionableTerms
          ? categoriesProducts?.length < 2
            ? nonNegotionableTerms
            : nonNegotionableTerms.filter(
                (item) =>
                  item !== 'royalty_percent' && item !== 'minimum_guarantee'
              )
          : undefined,
        minimum_guarantee_percent: minimumGuaranteePercent
          ? parseFloat(minimumGuaranteePercent.replace(/,/g, ''))
          : undefined,
        distribution_channels: channelsOfDistribution.selections
          ? channelsOfDistribution.selections
          : undefined,
        minimum_guarantee_amount: minimumGuaranteeAmount
          ? parseFloat(minimumGuaranteeAmount.replace(/,/g, ''))
          : undefined,
        user_uuid: companyRepresented ? companyRepresented : userUUID,
        permitted_deal_types: stateCheckBox.selections,
        demographic_target: demographicTarget ? demographicTarget : undefined,
        demographic_gender: demographicGender ? demographicGender : undefined,
        demographic_age: demographicAge ? demographicAge : undefined,
        demographic_region: demographicRegion ? demographicRegion : undefined,
        media_uris: [
          {
            media_uri: youtubeMedia,
            media_uri_type: MediaUriEnum.YOUTUBE,
          },
        ],
      };
      postItem(property)
        .then(() => {
          postItemLogoImageBase64Call(item);
          queryClient.invalidateQueries({
            queryKey: [findItemsQueryKey],
          });
          queryClient.invalidateQueries({
            queryKey: [delegateQueryKey],
          });
        })
        .then(() => {
          // router.push(routes.brandAdded);
          router.push(routes.congrats);
        })
        .catch((err) => {
          setIsSubmitting(false);
          setSubmitError(JSON.parse(err.request.response).message);
        });
    }
  };

  const handlePropertyDescription = (e: React.FormEvent<HTMLInputElement>) => {
    setPropertyDescription(e.currentTarget.value);
  };

  const DeletePhoto = async (item_uuid: string, uri: string) => {
    const image = {
      data: {
        item_uuid,
        uri,
      },
    };

    try {
      await deleteImage(image);
      setRefreshImages(true);
    } catch (err: any) {
      throwError(JSON.parse(err.request.response).message);
    }
  };

  const DeleteDocument = async (item_uuid: string, uri: string) => {
    const image = {
      data: {
        item_uuid,
        uri,
      },
    };

    try {
      await deleteDocumentCall(image);
      setRefreshDocuments(true);
    } catch (err: any) {
      throwError(JSON.parse(err.request.response).message);
    }
  };

  return (
    <>
      {!isSubmitting ? (
        <div className="relative">
          <Head>
            <title>List a Brand</title>
          </Head>
          <div className="absolute bottom-[-100px] right-0 overflow-hidden pointer-events-none">
            <Image
              src="/images/BackgroundBlur.svg"
              alt="background-blur"
              width={1353}
              height={524}
              objectPosition="right bottom"
              layout="fixed"
            />
          </div>
          <div className="container flex items-center pt-10 pl-6 mx-auto mb-4 lg:pl-0">
            <Image
              src="/images/LogoPrimary.svg"
              width={61}
              height={34}
              alt="BIP logo"
              onClick={() => router.push('/explore')}
              className="cursor-pointer"
            />
          </div>
          <div className="relative flex flex-col min-h-screen mx-6 mb-40 lg:container lg:mx-auto lg:px-40">
            <div className="mt-6 mb-6 text-xl font-bold md:mt-8 text-primary font-custom1 md:text-3xl lg:text-4xl">
              {t('add-product.list-a-brand')}
            </div>
            <>
              <div className="lg:grid lg:grid-cols-4 lg:gap-10">
                <div className="lg:col-span-4">
                  <div className="mb-4 text-xl font-bold text-primary font-custom1 md:text-xl lg:text-2xl">
                    {t('brand-information')}
                  </div>
                  <Paper>
                    <div className="mb-6 lg:mb-10">
                      <div className="w-full">
                        <InputNoRegister
                          name="name"
                          label="whats-your-brand-name"
                          placeholder={t('enter-brand-name')}
                          type="text"
                          value={propertyName}
                          onChange={handleChange}
                          smaller
                        />
                        <div className="mt-10">
                          <CheckboxNoRegister
                            label={t('add-product.i-agree-to')}
                            onClick={openTermsModal}
                            onClickText={t(
                              'add-product.brand-terms-and-conditions'
                            )}
                            name="acceptTerms"
                            onChange={handleCheckboxChangeDisclosure}
                            selections={
                              stateCheckBoxDisclosure ? ['acceptTerms'] : []
                            }
                          />
                        </div>

                        <div className="h-4 mt-2 mb-2 ml-4 text-sm text-red-400 font-custom2">
                          {propertyNameError && propertyNameError}
                        </div>
                        <div className="h-4 mt-2 mb-2 ml-4 text-sm text-red-400 font-custom2">
                          {checkBoxDisclosureError && checkBoxDisclosureError}
                        </div>
                      </div>
                    </div>
                    <div className="mb-6 lg:mb-10">
                      <BubbleList
                        checkList={listOfBrandCategories}
                        label="add-product.what-categories-best-represent-your-brand"
                        bubbleName="categories_brand"
                        state={brandCategories}
                        setState={setBrandCategories}
                        defaultValue={[]}
                        selectAll={true}
                        smaller
                        extraText="Optional"
                      />
                    </div>
                    <div className="mb-6 lg:mb-10">
                      <CategoriesProducts
                        categoriesProducts={categoriesProducts}
                        setCategoriesProducts={setCategoriesProducts}
                        bubbleName="property_categories"
                        defaultValue={[]}
                        register={register}
                        getValues={getValues}
                        setValue={setValue}
                        selectAll={true}
                        productItem={true}
                        extraText="Optional"
                      />
                    </div>
                  </Paper>
                </div>

                <div className="mt-14 lg:col-span-4 lg:mt-0">
                  <div className="flex">
                    <div className="text-xl font-bold text-primary font-custom1 md:text-xl lg:text-3xl">
                      {t('brand-logo')}
                    </div>
                    <div className="ml-2 text-xl font-normal text-inputGray font-custom1 md:text-xl lg:text-3xl">
                      {`(${t('one-image')})`}
                    </div>
                  </div>
                  <div className="mb-4 ">
                    <div className="mt-1 text-sm font-normal text-inputGray font-custom1 md:text-base lg:text-xl">
                      {`${t('shown-on-explore-page')}`}
                    </div>
                  </div>

                  <FileUploadField
                    uploadFiles={uploadFiles}
                    uploadBase64Files={uploadBase64Files}
                    files={uploadedFiles}
                    isBase64={true}
                    acceptedFileTypes={onlyImages}
                    allowMultiple={false}
                    numberOfFiles={1}
                    errorFileTypeText={t('errors:only-images-accepted')}
                    errorText={
                      uploadedFilesError
                        ? t('errors:you-need-to-upload-at-least-one-file')
                        : ''
                    }
                    // photoMinWidth={400}
                    // photoMinHeight={400}
                  />
                  {uploadedFiles.length > 0 && (
                    <div className="flex flex-col items-center justify-center mb-20">
                      <AvatarEditor
                        ref={setEditorRef}
                        image={uploadedFiles[0]}
                        width={800}
                        height={800}
                        border={50}
                        color={[255, 255, 255, 0.6]} // RGBA
                        scale={zoom}
                        rotate={0}
                        className={'logoAvatar'}
                      />
                      <Slider
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(value: any) => {
                          setZoom(value);
                        }}
                        className="mt-5"
                        value={zoom}
                        railStyle={{
                          backgroundColor: 'rgba(10, 2, 39, 0.04)',
                          height: 17,
                        }}
                        trackStyle={{
                          backgroundColor: 'rgba(74,167,202,1)',
                          height: 17,
                        }}
                        handleStyle={{
                          background: '#FFFFFF',
                          boxShadow: '0px 7px 25px rgba(157, 164, 184, 0.1)',
                          height: 28,
                          width: 28,
                          marginLeft: 0,
                          marginTop: -5,
                          backgroundColor: 'white',
                          opacity: 100,
                        }}
                        dotStyle={{
                          width: 10,
                          height: 10,
                          background: '#FFFFFF',
                          position: 'absolute',
                          top: 3,
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="mt-14 lg:col-span-4 lg:mt-0">
                  <div className="flex">
                    <div className="text-xl font-bold text-primary font-custom1 md:text-xl lg:text-3xl">
                      {t('brand-images')}
                    </div>
                    <div className="ml-2 text-xl font-normal text-inputGray font-custom1 md:text-xl lg:text-3xl">
                      {`(${t('max')} 6)`}
                    </div>
                  </div>
                  <div className="mt-1 mb-4 text-sm font-normal text-inputGray font-custom1 md:text-base lg:text-xl">
                    {`${t('min-width-product-photos')}`}
                  </div>
                  <div className="h-4 my-4 ml-4 text-sm text-red-400 font-custom2">
                    {imagesError && imagesError}
                  </div>
                  {itemUUID && (
                    <MultipleFileUploadField
                      setFiles={setImages}
                      files={images}
                      itemUUID={itemUUID}
                      refresh={() => setRefreshImages(true)}
                      numberOfFiles={6}
                      postType="image"
                      // photoMinWidth={300}
                      // photoMinHeight={200}
                    />
                  )}
                  <div className="flex flex-wrap px-4 py-4 mt-10 border-2 rounded-lg shadow-lg lg:px-10 lg:py-10 border-backgroundInput">
                    {!imagesDraft || imagesDraft?.length === 0 ? (
                      <div className="mx-auto mt-10 mb-10 text-xl text-center font-custom1 text-inputGray">
                        {t('no-uploaded-files')}...
                      </div>
                    ) : (
                      imagesDraft.length > 0 &&
                      imagesDraft.map((pic: string, index: number) => (
                        <div key={`${pic}-${index}`}>
                          {pic && (
                            <div className="relative w-64 mb-5 mr-5">
                              <OwnImage
                                src={pic}
                                layout="fill"
                                width={280}
                                maxWidth={280}
                                alt={'image-' + pic}
                                classNameImage={
                                  ' rounded-lg shadow-lg' +
                                  (index === 0
                                    ? ' !border-4  !border-solid	!border-button'
                                    : '')
                                }
                              />
                              <div className="absolute flex items-center justify-center w-12 h-12 bg-white rounded-lg right-5 top-5 hover:bg-button">
                                <div className="relative inline-block w-full h-full group">
                                  <Icon
                                    name="ThreeDots"
                                    className="h-full mx-auto my-auto cursor-pointer fill-primary hover:fill-white"
                                    viewBox="0 0 20 4"
                                    size="18"
                                  />
                                  <div className="absolute z-20 hidden text-base rounded-lg shadow-lg top-10 right-4 sm:left-4 sm:right-auto w-30 font-custom1 text-primary group-hover:block group-hover:bg-white">
                                    <div
                                      className="flex w-full px-8 py-3 rounded-b-lg cursor-pointer hover:bg-backgroundInput"
                                      onClick={() => {
                                        DeletePhoto(itemUUID, pic);
                                      }}
                                    >
                                      {t('delete')}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <Paper className="lg:col-span-4">
                  <Input
                    type="text"
                    label={'add-product.youtube-media'}
                    register={register}
                    name="youtubeMedia"
                    placeholder={t('add-product.youtube-media-placeholder')}
                    required={false}
                    smaller
                    // @ts-ignore
                    errorText={t(errors.youtubeMedia?.message || '')}
                  />
                  {youtubeMedia && !errors.youtubeMedia?.message && (
                    <div className="w-full lg:w-[70%] mx-auto flex justify-center relative pb-[56.25%] lg:pb-[37.3%] pt-[25px] h-0">
                      <iframe
                        className="w-full h-full absolute top-0 left-0 m-auto"
                        src={youtubeMedia}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                </Paper>
              </div>
              <div className="lg:grid lg:grid-cols-4 lg:gap-10">
                <div className="lg:col-span-4">
                  <div className="mb-4 text-xl font-bold mt-14 text-primary font-custom1 md:text-5xl lg:text-5xl">
                    {t('deal-details')}
                  </div>
                  <Paper>
                    <div className="relative mb-8 lg:mb-16">
                      <BubbleList
                        checkList={listOfTerritories}
                        types={typesOfTerritories}
                        label="add-product.what-territories-do-you-want-to-operate-in"
                        bubbleName="territories"
                        state={territories}
                        setState={setTerritories}
                        defaultValue={[]}
                        selectAll={true}
                        smaller
                      />
                      <Toggle
                        onChange={() => handleToggle('territories')}
                        toggleValue="territories"
                        toggleID="territories"
                      />
                    </div>
                    <div className="relative mb-8 lg:mb-16">
                      <BubbleListAndInput
                        checkList={channelsOfDist}
                        checkList2={channelsOfDistValue}
                        label="onboarding.choose-channels-of-distribution"
                        bubbleName="distribution_channels"
                        state={channelsOfDistribution}
                        setState={setChannelsOfDistribution}
                        defaultValue={[]}
                        smaller
                        register={register}
                        getValues={getValues}
                        setValue={setValue}
                      />
                      <Toggle
                        onChange={() => handleToggle('distribution_channels')}
                        toggleValue="distribution_channels"
                        toggleID="distribution_channels"
                      />
                    </div>
                    <div className="relative mb-16">
                      <InputDate
                        label="add-product.expiration-date"
                        name="offerDeadline"
                        startDate={offerDeadline}
                        setStartDate={setOfferDeadline}
                        extraText="Optional"
                      />
                      <Toggle
                        onChange={() => handleToggle('offer_deadline')}
                        toggleValue="offer_deadline"
                        toggleID="offer_deadline"
                      />
                      <InfoBox
                        text={t(
                          'add-product.this-is-the-date-that-the-listing-will-be-pulled-from-the-explore-pages'
                        )}
                        smaller
                      />
                    </div>
                    <div className="relative mb-16">
                      <SliderInput
                        marks={step20marks}
                        label="add-product.set-royalty-percent"
                        sliderValue={royalty}
                        setSliderValue={setRoyalty}
                        storeProperty="property_royalty"
                        smaller
                        extraText="Optional"
                      />
                      {categoriesProducts?.length < 2 && (
                        <Toggle
                          onChange={() => handleToggle('royalty_percent')}
                          toggleValue="royalty_percent"
                          toggleID="royalty"
                        />
                      )}
                    </div>
                    <div className="relative mb-16">
                      <InputDoubleNoRegister
                        name="property_minimum_guarantee"
                        onChange1={(event: any) =>
                          setMinimumGuaranteePercent(event.target.value)
                        }
                        onChange2={(event: any) =>
                          setMinimumGuaranteeAmount(event.target.value)
                        }
                        placeholder={t('set-average-minimum')}
                        label="add-product.average-minimum-guarantee"
                        label1="%"
                        label2="$"
                        type="number"
                        smaller
                        extraText="Optional"
                      />
                      {categoriesProducts?.length < 2 && (
                        <Toggle
                          onChange={() => handleToggle('minimum_guarantee')}
                          toggleValue="minimum_guarantee"
                          toggleID="minimum-guarantee"
                        />
                      )}
                    </div>
                    <div className="relative mb-16">
                      <TextArea
                        name="propertyDescription"
                        label="add-product.property-description"
                        value={propertyDescription}
                        onChange={handlePropertyDescription}
                        placeholder="Describe your property"
                        max={10000}
                        smaller
                      />
                      <div className="h-4 mt-2 ml-4 text-sm text-red-400 font-custom2">
                        {propertyDescriptionError && propertyDescriptionError}
                      </div>
                    </div>
                    <div className="relative mb-6 lg:mb-10">
                      <CheckBoxes
                        selections={stateCheckBox.selections}
                        checkList={typeOfDeal}
                        label="onboarding.listed-for-a-licensing-deal-in-the-normal-explore-page-or-on-the-collaborations-explore-page"
                        onChange={handleCheckboxChange}
                        smaller={true}
                      />
                    </div>
                  </Paper>
                </div>
              </div>
              <div className="mt-14">
                <div className="mb-4 text-xl font-bold text-primary font-custom1 md:text-xl lg:text-3xl">
                  {t('add-product.brand-demographics')}
                </div>
              </div>
              <Paper>
                <div className="relative mb-8 lg:mb-16">
                  <div className="mb-6 lg:mb-10">
                    <Input
                      type="text"
                      label={t('product.gender-question')}
                      register={register}
                      name="demographic_gender"
                      placeholder={t('product.input-genders')}
                      required={false}
                      smaller
                    />
                  </div>
                  <div className="mb-6 lg:mb-10">
                    <Input
                      type="text"
                      label={t('product.age-question')}
                      register={register}
                      name="demographic_age"
                      placeholder={t('product.input-age')}
                      required={false}
                      smaller
                    />
                  </div>
                  <Input
                    type="text"
                    label={t('product.region-question')}
                    register={register}
                    name="demographic_region"
                    placeholder={t('product.input-region')}
                    required={false}
                    smaller
                  />
                </div>
              </Paper>
              <div className="mt-14">
                <div className="mb-4 text-xl font-bold text-primary font-custom1 md:text-xl lg:text-3xl">
                  {t('add-product.additional-brand-information')}
                </div>
                {itemUUID && (
                  <MultipleFileUploadField
                    setFiles={setDocuments}
                    files={documents}
                    itemUUID={itemUUID}
                    refresh={() => setRefreshDocuments(true)}
                    numberOfFiles={100}
                    postType="document"
                  />
                )}
              </div>
              <div className="flex flex-wrap mt-10 border-2 rounded-lg shadow-lg lg:px-10 lg:py-10 border-backgroundInput">
                {!documentsDraft || documentsDraft?.length === 0 ? (
                  <div className="mx-auto mt-10 mb-10 text-xl text-center font-custom1 text-inputGray">
                    {t('no-uploaded-files')}...
                  </div>
                ) : (
                  documentsDraft.length > 0 &&
                  documentsDraft.map((doc, index: number) => {
                    let documentImage = convertedImageLogo(doc.uri);
                    return (
                      <div key={`${doc}-${index}`}>
                        {doc && (
                          <div className="relative w-48 mb-5 mr-5">
                            <OwnImage
                              src={documentImage}
                              layout="fill"
                              width={200}
                              maxWidth={200}
                              alt={'image-' + doc}
                              classNameImage={
                                ' rounded-lg shadow-lg' +
                                (index === 0
                                  ? ' !border-4  !border-solid	!border-button'
                                  : '')
                              }
                            />
                            <div className="absolute flex items-center justify-center w-12 h-12 bg-white rounded-lg right-5 top-5 hover:bg-button">
                              <div className="relative inline-block w-full h-full group">
                                <Icon
                                  name="ThreeDots"
                                  className="h-full mx-auto my-auto cursor-pointer fill-primary hover:fill-white"
                                  viewBox="0 0 20 4"
                                  size="18"
                                />
                                <div className="absolute z-20 hidden text-base rounded-lg shadow-lg top-10 right-4 sm:left-4 sm:right-auto w-30 font-custom1 text-primary group-hover:block group-hover:bg-white">
                                  <div
                                    className="flex w-full px-8 py-3 rounded-b-lg cursor-pointer hover:bg-backgroundInput"
                                    onClick={() => {
                                      DeleteDocument(itemUUID, doc.uri);
                                    }}
                                  >
                                    {t('delete')}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </>
          </div>
          <FooterMain aboveBottomButtons={true} />
          <FooterButtonsNoBack
            onClickButton={submit}
            buttonText={t('add-product.confirm-and-send')}
            error={submitError}
          />
          <DialogModal
            closeModal={closeTermsModal}
            isOpen={isOpenTermsModal}
            dialogTitle={t('add-product.terms-and-conditions')}
          >
            <div className="py-10 text-base font-custom1 font-primary">
              By accepting these terms, you, in your individual capacity or as
              an authorized representative of Company (“you”), represent and
              warrant to BIP Market LLC that you are the sole and exclusive
              owner of or an authorized agent of the Company and that you are
              free to grant all rights and to make all agreements hereunder in
              connection with the Company’s brand, content, materials, and all
              intellectual property and other rights granted, uploaded, shared,
              displayed or otherwise used (the “Materials”) by Company in
              connection with its use and enjoyment of the BIP Market LLC and in
              transactions through BIP Market LLC. You further represent and
              warrant that Company has not made, nor will make, any grant or
              assignment in any Materials which will conflict with or impair the
              complete and quiet enjoyment of the rights granted and agreements
              made hereunder to [platform] or any third-party, that Company is
              not subject to any conflicting obligations or any disability which
              will prevent or interfere with Company’s engagement or the
              performance of Company’s services or grant of rights hereunder to
              BIP Market LLC or any third-party; the materials provided by
              Company in connection with its use of the platform and any
              agreements in connection therewith, is or will be original with
              Company; the materials have not been copied in whole or in part
              from, or based on, any other work; the Material does not and will
              not violate or infringe upon the copyright, trademark, or any
              other intellectual property right of any person or entity; the
              Material does not and will not constitute a libel or slander of
              any person or entity or infringe upon or violate the right of
              privacy or any other right of any person or entity; and Company
              shall exercise its rights and perform its obligations hereunder in
              accordance with all applicable rules, regulations, laws and
              treaties.
            </div>
          </DialogModal>
        </div>
      ) : (
        <CircleLoaderSpinner size={500} />
      )}
    </>
  );
};

export default AddProduct;

const Toggle = ({ onChange, toggleValue, toggleID }: any) => {
  const { t } = useTranslation();
  return (
    <label className="inline-flex items-center mt-5 mr-5 cursor-pointer md:mt-0 md:mr-0 md:absolute md:top-0 md:right-0">
      <span className="mr-3 text-xs font-medium uppercase text-inputGray font-custom2 dark:text-gray-300">
        {t('add-product.non-negotiable-terms')}
      </span>
      <div className="relative">
        <input
          type="checkbox"
          value={toggleValue}
          id={toggleID}
          className="cursor-pointer sr-only peer"
          onChange={onChange}
        />
        <div className="w-9 h-5 bg-inputGray rounded-full peer peer-focus:ring-4 peer-focus:ring-button dark:peer-focus:ring-button dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-button"></div>
      </div>
    </label>
  );
};
