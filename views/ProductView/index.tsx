import { useTranslation } from "next-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Controller, Navigation, Pagination, Thumbs } from "swiper";
import SwiperClass from "swiper/types/swiper-class";
import "swiper/swiper-bundle.css";
import { ImagesList } from "react-spring-lightbox/dist/types/ImagesList";
import Lightbox, { ImagesListType } from "react-spring-lightbox";
import dayjs from "dayjs";
import Image from "next/image";
import { NextRouter, useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
// import GoogleTrends from 'components/new/GoogleTrends';
import { useQueryClient } from "@tanstack/react-query";

import { Modal, ModalContents, ModalOpenButton } from "components/ModalWindow";
import UploadBrand from "components/Modals/UploadBrand";
import { FooterButtons } from "components/FooterButtonFolder/FooterButtons";
import { FooterButtonsOnlyBack } from "components/FooterButtonFolder/FooterButtonsOnlyBack";
import Icon from "components/Icon";
import OwnImage from "components/Image";
import Pils from "components/Pils";
import useStore from "modules/Store";
import { findItems } from "api/item/findItems";
import {
  CategoriesItem,
  ItemByUUIDResponse,
  ItemDocument,
  ItemDocumentsByUuidResponse,
  MediaUri,
  MediaUriEnum,
  ProductItem,
} from "models/item/item";
import { createDraft } from "api/deal/createDraft";
import { findItemByUuid } from "api/item/findItemByUuid";
import { findUserByUuid } from "api/user/findUserByUuid";
import { DraftRequest } from "models/deals/deals";
import UploadedFile from "components/UploadedFile";
import { convertedImageLogo } from "public/helpers/convertedImageLogo";
import { findItemDocumentsByUuidCall } from "api/item/findItemDocumentsByUuid";
import { throwError } from "utils/error";
import customImageLoader from "utils/image-loader";
import AccordionText from "components/Accordions/AccordionText";
import PropertyCategories from "components/Modals/PropertyCategories";
import PropertyTerritories from "components/Modals/PropertyTerritories";
import Description from "components/Modals/Description";
import MinimumGuarantee from "components/Modals/MinimumGuarantee";
import OfferDeadline from "components/Modals/OfferDeadline";
import Royalty from "components/Modals/Royalty";
import { deleteImage } from "api/item/deleteImage";
import { deleteDocumentCall } from "api/item/deleteDocument";
import ModalNew from "components/new/Modal";
import SmartCropImage from "components/SmartCropImage";
import PermittedDealTypes from "components/Modals/PermittedDealTypes";
import BrandCategories from "components/Modals/BrandCategories";
import useTokensOrCookies from "contexts/TokensOrCookies";
import { getCurrentUuid } from "utils/getCurrentUuid";
import { AccountFlags } from "models/user/user";
import { checkAccountFlag } from "utils/checkAccountFlag";
import ProductDetail from "./components/ProductDetail";
import ProductEditButton from "./components/ProductEditButton";
import ProductAddButton from "./components/ProductAddButton";
import DemographicsCard from "./components/DemographicsCard";
import ProductSkeleton from "./components/ProductSkeleton";
import ChooseBrandModal from "./components/ChooseBrandModal";
import YouTubeMedia from "components/Modals/YouTubeMedia";
import { getUserQueryKey } from "api/user/getUserCall";
import { delegateQueryKey } from "api/delegate/delegate";
import useCheckRole from "hooks/useCheckRole";
import routes from "constants/routes";

SwiperCore.use([Navigation, Pagination, Controller, Thumbs]);

const ProductView: React.FC = () => {
  const verifiedUser = useStore((state) => state.verified_user);
  const updateDueDiligenceModalOpen = useStore(
    (state) => state.updateDueDiligenceModalOpen
  );
  const updateDueDiligenceCongratsModalOpen = useStore(
    (state) => state.updateDueDiligenceCongratsModalOpen
  );

  const { accessToken, companyRepresented } = useTokensOrCookies();

  const router: NextRouter = useRouter();
  const { query } = router;
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [categoryString, setCategoryString] = useState<string>("");
  const [currentImageIndex, setCurrentIndex] = useState(0);
  const [product, setProduct] = useState<ItemByUUIDResponse | null>();
  const [productImages, setProductImages] = useState<ImagesListType>([]);
  const [agentName, setAgentName] = useState<string>();
  const [agentId, setAgentId] = useState<string>();
  const [agentUri, setAgentUri] = useState<string>();
  const [companyProducts, setCompanyProducts] =
    useState<ItemByUUIDResponse[]>();

  const [modal, setModal] = useState<string>("");

  function openModal(name: string) {
    setModal(name);
  }

  function closeModal() {
    setModal("");
  }

  function closeModalFooter() {
    setIsOpen(false);
  }

  function openModalFooter() {
    setIsOpen(true);
  }
  const [refreshProduct, setRefreshProduct] = useState<boolean>(true);
  const [refreshDocuments, setRefreshDocuments] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [swiper, setSwiper] = useState<SwiperClass>();
  const [isOpen, setIsOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  useState(false);

  const { isLicensee, isLicensor, isAgency } = useCheckRole();
  const youtubeMedia: MediaUri | undefined = product?.media_uris.find(
    (mediaUri) =>
      mediaUri.media_uri_type === MediaUriEnum.YOUTUBE && !!mediaUri.media_uri
  );
  const showLicensorSelector = (isLicensor && query.collaboration) || isAgency;

  const handleRefreshProduct = () => {
    setRefreshProduct(true);
    queryClient.invalidateQueries({
      queryKey: [getUserQueryKey, delegateQueryKey],
    });
    useStore.setState({ refreshUserAppWrapper: true });
  };

  const handleRefreshDocument = () => {
    setRefreshDocuments(true);
  };

  const onClickBack = () => {
    router.push("/explore");
  };

  const onClickButton = (selectedProperty?: ItemByUUIDResponse) => {
    const dealMakingPermitted = checkAccountFlag(
      AccountFlags.DEAL_MAKING_PERMITTED,
      true
    );
    const dueDiligenceQuestionnaireSubmitted = checkAccountFlag(
      AccountFlags.DUE_DILIGENCE_QUESTIONNAIRE_SUBMITTED,
      true
    );
    const dealMakingPermittedByVerifiedUsersOnly =
      product?.deal_making_permitted_by_verified_users_only;
    if (
      isLicensee &&
      dueDiligenceQuestionnaireSubmitted &&
      dealMakingPermittedByVerifiedUsersOnly &&
      (!verifiedUser || !dealMakingPermitted)
    ) {
      updateDueDiligenceCongratsModalOpen(true);
      updateDueDiligenceModalOpen(true);
      return;
    }
    if (
      isLicensee &&
      !dealMakingPermitted &&
      dealMakingPermittedByVerifiedUsersOnly
    ) {
      updateDueDiligenceModalOpen(true);
      return;
    }
    if (product) {
      const item: DraftRequest = {
        item_uuid: product.uuid,
        counterparty_user_uuid: product.user_uuid,
        user_uuid: getCurrentUuid(),
        deal_type: query.collaboration ? "Collaboration" : "Licensing",
      };
      if (query.collaboration && selectedProperty) {
        item.collaboration_item_uuid = selectedProperty.uuid;
      }

      setSubmitting(true);

      // @ts-ignore
      return createDraft(item)
        .then((res) => {
          const draftUUID = res.uuid;
          router.push(
            `/deal-proposal/${router.query.product}?draft=${draftUUID}`
          );
        })
        .catch((err) => {
          setError(JSON.parse(err.request.response).message);
          setSubmitting(false);
          throwError(err);
        });
    }
  };

  const gotoPrevious = () =>
    currentImageIndex > 0 && setCurrentIndex(currentImageIndex - 1);

  const gotoNext = () => {
    if (!product?.images) return;
    currentImageIndex + 1 < product?.images.length &&
      setCurrentIndex(currentImageIndex + 1);
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
      handleRefreshProduct();
    } catch (err: any) {
      throwError(JSON.parse(err.request.response).message);
    }
  };

  const DeleteDocument = async (uri: string) => {
    if (!product) return;
    const document = {
      data: {
        item_uuid: product.uuid,
        uri,
      },
    };

    try {
      await deleteDocumentCall(document);
      handleRefreshDocument();
    } catch (err: any) {
      throwError(JSON.parse(err.request.response).message);
    }
  };

  useEffect(() => {
    if (product && !accessToken) {
      useStore.setState({
        current_page: query.collaboration
          ? `product/${product?.name_slug}/${query.product}?collaboration=true`
          : `product/${product?.name_slug}/${query.product}`,
      });
      router.push(routes.home);
    }
  }, [product, query.product, router, query.collaboration, accessToken]);

  const fetchProduct = async (productId: string) => {
    const res = await findItemByUuid(productId);
    setProduct(res);
    let productImageArray: ImagesList = [];

    res?.images.map((image) => {
      productImageArray.push({
        src: customImageLoader({ src: image }),
        loading: "lazy",
        alt: image,
      });
    });
    productImageArray.length > 0 && setProductImages(productImageArray);

    let cs = "";
    res.categories.map((item: CategoriesItem) => {
      cs += `${item.category_name}: `;
      item.products.length === 0
        ? (cs += "Open to all\n")
        : item.products.map((prod: ProductItem, index: number) => {
            cs +=
              prod.product_name +
              (index !== item.products.length - 1 ? ", " : " \n");
          });
    });
    setCategoryString(cs);

    if (res.user.delegates.length > 0) {
      const agent = res.user.delegates.filter(
        (delegate) => delegate.delegate_type === 1
      )[0].delegate_uuid;
      const agentInfo = await findUserByUuid(agent);
      setAgentName(agentInfo.company_name);
      setAgentUri(agentInfo.company_logo.uri);
      setAgentId(agentInfo.uuid);
    }
    setRefreshProduct(false);
  };

  useEffect(() => {
    if (!router.isReady || !query.product || !refreshProduct) return;
    const productRequest = Array.isArray(query.product)
      ? query.product[0]
      : query.product;
    fetchProduct(productRequest).catch((err) => throwError(err));
  }, [query, router.isReady, refreshProduct]);

  useEffect(() => {
    // refresh everytime the product changes
    if (!product) return;
    const params = {
      params: {
        user_uuid: product.user_uuid,
        take: 5,
      },
    };

    findItems(params)
      .then((res) => {
        setCompanyProducts(
          res.filter(
            (item: ItemByUUIDResponse) =>
              item.uuid !== product.uuid && item.permitted_deal_types.length > 0
          )
        );
      })
      .catch((err) => throwError(err));
  }, [product]);

  const [documents, setDocuments] = useState<ItemDocumentsByUuidResponse>([]);
  const [isOwnProperty, setIsOwnProperty] = useState<boolean>();

  useEffect(() => {
    if (!query.product || !refreshDocuments) return;
    findItemDocumentsByUuidCall(query.product.toString())
      .then((res) => {
        setDocuments(res);
      })
      .catch((err) => {
        throwError(err);
      });
    setRefreshDocuments(false);
  }, [query.product, refreshDocuments]);

  useEffect(() => {
    if (!product || !query.product || product.uuid === query.product) return;
    setRefreshDocuments(true);
    setRefreshProduct(true);
  }, [product, query]);

  useEffect(() => {
    if (!product) return;
    if (
      useStore.getState().userUUID === product.user_uuid ||
      companyRepresented === product.user_uuid
    ) {
      setIsOwnProperty(true);
    } else {
      setIsOwnProperty(false);
    }
  }, [product, companyRepresented]);

  const GoToBrandSpecialist = () => {
    router.push("/brand-specialist");
  };
  return (
    <div>
      <div className="md:mx-6">
        {!product && <ProductSkeleton />}
        {product && product.images && product.images.length > 0 && (
          <div className="flex flex-col max-w-[1200px] m-auto">
            <div className="relative w-full rounded-xl text-center">
              <>
                <img
                  src={
                    product.image_banner
                      ? product.image_banner
                      : "/images/default-banner.svg"
                  }
                  alt={"product-" + product.images[0]}
                  className="min-w-[310px] min-h-[100px] m-auto max-h-[250px]"
                  style={{
                    borderRadius: 18,
                  }}
                />
                {isOwnProperty && (
                  <div className="absolute z-10 top-2 right-2 md:top-4 md:right-4">
                    <ProductEditButton
                      onClick={() => openModal("uploadCoverImage")}
                      background
                    />
                  </div>
                )}
              </>
              <div className="relative w-28 h-28 bg-white border-4 border-white rounded-xl md:w-36 lg:w-40 md:h-36 lg:h-40 md:border-8 lg:border-14 ml-2 lg:ml-20 -mt-[7%]">
                <Image
                  loader={customImageLoader}
                  src={
                    product.image_logo ? product.image_logo : product.images[0]
                  }
                  alt={"product-" + product.user.company_name}
                  layout={"fill"}
                  objectFit={"contain"}
                  className="rounded-xl"
                  quality={100}
                />
                {isOwnProperty && (
                  <div className="absolute z-10 -top-4 -right-4 md:-top-8 md:-right-8">
                    <ProductEditButton
                      onClick={() => openModal("companyLogo")}
                      background
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {product && (
          <>
            <div className="flex flex-col lg:pl-64 mt-6 lg:-mt-[50px] w-[1200px] m-auto">
              <div className="flex flex-col md:flex-row md:justify-between">
                <div className="flex flex-col">
                  <div className="text-3xl font-bold md:text-4xl lg:text-3xl font-custom1 text-primary">
                    {product.name}
                  </div>
                  <div
                    className="text-xl cursor-pointer md:mt-2 md:text-2xl lg:text-xl font-custom1 text-inputGray hover:text-button"
                    onClick={() => router.push(`/company/${product.user.uuid}`)}
                  >
                    {product.user.company_name}
                  </div>
                </div>
                {agentName && agentUri && (
                  <div className="relative min-w-[200px] mt-5 md:mt-0 md:ml-10 h-full px-10 py-1 border rounded-md cursor-pointer border-inputGray/30">
                    <div
                      className="flex items-center justify-center py-2"
                      onClick={() =>
                        router.push(`/company/${agentId}?agent=true`)
                      }
                    >
                      <div className="relative flex items-center justify-center w-12 h-12 uppercase bg-white border-2 cursor-pointer rounded-xl max-h-12 max-w-12 border-backgroundInput">
                        <Image
                          loader={customImageLoader}
                          src={agentUri}
                          alt="Agent Logo"
                          layout={"fill"}
                          objectFit={"contain"}
                          width={48}
                          className="mx-auto rounded-xl"
                        />
                      </div>
                      <div className="ml-2 text-xl font-custom1 text-primary hover:text-button">
                        {agentName}
                      </div>
                    </div>
                    <h2 className="absolute top-0 flex transform -translate-x-1/2 -translate-y-1/2 left-1/3">
                      <span className="px-2 text-sm bg-white font-custom1 text-inputGray">
                        {t("product.represented-by")}
                      </span>
                    </h2>
                  </div>
                )}
              </div>
            </div>
            {/* <hr className="w-full my-6 md:my-6 border-1 border-primary/5" /> */}
            <div className="w-full my-6 md:my-6" />
          </>
        )}

        {(isOwnProperty || (product && !!categoryString)) && (
          <>
            <div className="px-5 py-6 my-10 border-2 border-backgroundInput bg-backgroundInput2 rounded-xl">
              <div className="mb-8 text-xl font-bold md:text-3xl font-custom1 text-primary">
                {t("deal-details")}
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:mt-10 lg:mt-0">
                {!!categoryString && product ? (
                  <div className="grid grid-cols-1">
                    <div className="flex items-center">
                      <Pils icon="foursquare.png" />

                      <AccordionText
                        textTopShortForm={product.categories.length.toString()}
                        textTop={categoryString}
                        textBottom={t("desired-product-categories")}
                      />
                      {isOwnProperty && (
                        <Modal>
                          <ModalOpenButton>
                            <div className="mr-4">
                              <ProductEditButton />
                            </div>
                          </ModalOpenButton>
                          <ModalContents pencil>
                            <PropertyCategories
                              defaultValue={product.categories}
                              refreshProperties={handleRefreshProduct}
                              uuid={product.uuid}
                              defaultValueToggle={product.non_negotiable_terms}
                            />
                          </ModalContents>
                        </Modal>
                      )}
                    </div>
                  </div>
                ) : isOwnProperty && product ? (
                  <div className="grid grid-cols-1">
                    <div className="flex items-center">
                      <Pils icon="foursquare.png" />

                      <AccordionText
                        textTop={categoryString}
                        textTopShortForm={product.categories.length.toString()}
                        textBottom={t("desired-product-categories")}
                      />
                      <Modal>
                        <ModalOpenButton>
                          <div className="mr-4">
                            <ProductEditButton />
                          </div>
                        </ModalOpenButton>
                        <ModalContents pencil>
                          <PropertyCategories
                            defaultValue={product.categories}
                            refreshProperties={handleRefreshProduct}
                            uuid={product.uuid}
                            defaultValueToggle={product.non_negotiable_terms}
                          />
                        </ModalContents>
                      </Modal>
                    </div>
                  </div>
                ) : null}
                {product && product.territories.length > 0 ? (
                  <div className="grid grid-cols-1">
                    <div className="flex items-center">
                      <Pils icon="globe.png" />

                      <AccordionText
                        textTop={product.territories
                          .map((territory: string) => `${territory}`)
                          .join(", ")}
                        textTopShortForm={product.territories.length.toString()}
                        textBottom={t("available-territories")}
                        lock={
                          Array.isArray(product.non_negotiable_terms) &&
                          product.non_negotiable_terms.includes("territories")
                        }
                      />
                      {isOwnProperty && (
                        <Modal>
                          <ModalOpenButton>
                            <div className="mr-4">
                              <ProductEditButton />
                            </div>
                          </ModalOpenButton>
                          <ModalContents pencil>
                            <PropertyTerritories
                              defaultValue={product.territories}
                              defaultValueToggle={product.non_negotiable_terms}
                              refreshProperties={handleRefreshProduct}
                              uuid={product.uuid}
                            />
                          </ModalContents>
                        </Modal>
                      )}
                    </div>
                  </div>
                ) : isOwnProperty && product ? (
                  <div className="grid grid-cols-1">
                    <div className="flex items-center">
                      <Pils icon="globe.png" />

                      <AccordionText
                        textTopShortForm={product.territories.length.toString()}
                        textTop={product.territories
                          .map((territory: string) => `${territory}`)
                          .join(", ")}
                        textBottom={t("available-territories")}
                        lock={
                          Array.isArray(product.non_negotiable_terms) &&
                          product.non_negotiable_terms.includes("territories")
                        }
                      />
                      <Modal>
                        <ModalOpenButton>
                          <ProductEditButton />
                        </ModalOpenButton>
                        <ModalContents pencil>
                          <PropertyTerritories
                            defaultValue={product.territories}
                            defaultValueToggle={product.non_negotiable_terms}
                            refreshProperties={handleRefreshProduct}
                            uuid={product.uuid}
                          />
                        </ModalContents>
                      </Modal>
                    </div>
                  </div>
                ) : null}
                {product && (product.offer_deadline || isOwnProperty) && (
                  <div className="grid grid-cols-1">
                    <div className="flex items-center">
                      {!!product.offer_deadline ? (
                        <ProductDetail
                          iconName="clock.png"
                          text={dayjs(product.offer_deadline).format(
                            "MMM DD, YYYY"
                          )}
                          description={t("offer-deadline")}
                          locked={
                            product.non_negotiable_terms &&
                            product.non_negotiable_terms.includes(
                              "offer_deadline"
                            )
                          }
                        />
                      ) : isOwnProperty ? (
                        <ProductDetail
                          iconName="clock.png"
                          text={t("not-displayed-product-text")}
                          description={t("offer-deadline")}
                          locked={false}
                        />
                      ) : null}
                      {isOwnProperty && (
                        <Modal>
                          <ModalOpenButton>
                            <ProductEditButton />
                          </ModalOpenButton>
                          <ModalContents pencil>
                            <OfferDeadline
                              defaultValue={
                                product.offer_deadline
                                  ? new Date(product.offer_deadline)
                                  : new Date()
                              }
                              defaultValueToggle={product.non_negotiable_terms}
                              refreshProperties={handleRefreshProduct}
                              uuid={product.uuid}
                            />
                          </ModalContents>
                        </Modal>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {product && product.images?.length === 1 && (
          <div className="flex flex-col mt-16">
            <div className="flex justify-end">
              {isOwnProperty && (
                <ProductAddButton onClick={() => openModal("uploadImages")} />
              )}
            </div>
            <div className="flex flex-wrap">
              {product.images.map((image: string, index: number) => (
                <div
                  // className="relative h-[300px] w-[300px] md:h-[250px] md:w-[250px] xl:w-[300px] xl:h-[300px]"
                  className="shadow-lg rounded-xl relative w-[300px] h-[200px]"
                  key={image}
                >
                  {/* <Image
                      loader={customImageLoader}
                      src={image}
                      alt={'product-' + image + '-' + index}
                      layout={'fill'}
                      objectFit={'contain'}
                      className="border-rounded"
                      onClick={() => {
                        setCurrentIndex(index);
                        setIsLightboxOpen(true);
                      }}
                    /> */}
                  <SmartCropImage
                    image={image}
                    params={{ width: 300, height: 200, minScale: 1 }}
                    onClick={() => {
                      setCurrentIndex(index);
                      setIsLightboxOpen(true);
                    }}
                    alt={"image-" + index}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {product && product.images.length > 1 && (
          <div className="flex flex-col w-full">
            <div className="flex justify-end">
              {isOwnProperty && product.images.length < 6 && (
                <ProductAddButton onClick={() => openModal("uploadImages")} />
              )}
            </div>
            <React.Fragment>
              <Swiper
                id="main"
                // thumbs={{
                //   swiper:
                //     thumbsSwiper && !thumbsSwiper.destroyed
                //       ? thumbsSwiper
                //       : null,
                // }}
                tag="section"
                wrapperTag="ul"
                spaceBetween={5}
                breakpoints={{
                  300: {
                    slidesPerView: 1,
                    width: 300,
                  },
                  640: {
                    slidesPerView: 1,
                    width: 420,
                  },
                  880: {
                    slidesPerView: 2,
                    width: 840,
                  },
                  1320: {
                    slidesPerView: 3,
                    width: 1000,
                  },
                }}
                navigation
                pagination
                onSwiper={setSwiper}
                // onSlideChange={() => {
                //   swiper?.activeIndex
                //     ? setSwipeIndex(swiper.activeIndex)
                //     : setSwipeIndex(0);
                // }}
                // style={{ paddingTop: '20px', paddingBottom: '20px' }}
              >
                {product.images.map((image: string, index: number) => (
                  <SwiperSlide key={`slide-${index}`} tag="li">
                    <div className="shadow-lg rounded-xl relative w-[300px] h-[200px]">
                      <SmartCropImage
                        image={image}
                        params={{ width: 300, height: 200, minScale: 1 }}
                        onClick={() => {
                          setCurrentIndex(index);
                          setIsLightboxOpen(true);
                        }}
                        alt={"image-" + index}
                      />
                      {isOwnProperty && (
                        <div
                          className="absolute z-40 p-2 cursor-pointer hover:scale-110 bg-grayButtonBG rounded-xl top-4 right-4"
                          onClick={() => DeletePhoto(product.uuid, image)}
                        >
                          <Icon
                            name="TrashCan"
                            className="stroke-primary fill-transparent"
                            viewBox="0 0 15 16"
                            size="14"
                          />
                        </div>
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* <Swiper
                  id="thumbs"
                  spaceBetween={5}
                  slidesPerView={6}
                  onSwiper={setThumbsSwiper}
                  watchSlidesProgress
                  style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: '20px',
                    width: '300px',
                  }}
                >
                  {product.images.map((image: string, index: number) => (
                    <SwiperSlide
                      key={`thumb-${index}`}
                      tag="li"
                      style={{ listStyle: 'none' }}
                      onClick={() => slideTo(index)}
                    >
                      <div
                        className={`mx-auto relative h-10 w-10 p-1 ${
                          swipeIndex === index &&
                          'border-1 rounded-xl border-button'
                        }`}
                      >
                        <Image
                          loader={customImageLoader}
                          src={image}
                          alt={'thumbnail-' + image + '-' + index}
                          layout={'fill'}
                          objectFit={'contain'}
                          className="rounded-xl"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper> */}
            </React.Fragment>
          </div>
        )}
        {(isOwnProperty || youtubeMedia) && (
          <div className="flex flex-col mt-10 mb-6 ">
            <div className="flex items-center mb-8 text-xl font-bold md:text-3xl font-custom1 text-primary">
              <div className="w-1/3">{t("youtube-media")}</div>
              {product && isOwnProperty && (
                <Modal>
                  <ModalOpenButton>
                    <div className="ml-6 w-2/3 flex justify-end">
                      <ProductAddButton />
                    </div>
                  </ModalOpenButton>
                  <ModalContents pencil>
                    <YouTubeMedia
                      defaultValue={youtubeMedia?.media_uri || ""}
                      refreshProperties={handleRefreshProduct}
                      mediaUris={product.media_uris}
                      uuid={product.uuid}
                    />
                  </ModalContents>
                </Modal>
              )}
            </div>
            {youtubeMedia && (
              <div className="w-full lg:w-[70%] mx-auto flex justify-center relative pb-[56.25%] lg:pb-[37.3%] pt-[25px] h-0">
                <iframe
                  className="w-full h-full absolute top-0 left-0 m-auto"
                  src={youtubeMedia.media_uri}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        )}

        {(product || isOwnProperty) && (
          <>
            <div className="px-5 py-6 my-10 border-2 border-backgroundInput bg-backgroundInput2 rounded-xl">
              {product && !!product.description && (
                <div className="flex flex-col">
                  <div className="flex items-center mb-8 text-xl font-bold md:text-3xl font-custom1 text-primary">
                    {t("brand-information")}
                    {isOwnProperty && (
                      <Modal>
                        <ModalOpenButton>
                          <div className="mt-1">
                            <ProductEditButton />
                          </div>
                        </ModalOpenButton>
                        <ModalContents pencil>
                          <Description
                            defaultValue={product.description}
                            refreshProperties={handleRefreshProduct}
                            uuid={product.uuid}
                          />
                        </ModalContents>
                      </Modal>
                    )}
                  </div>
                  <div className="mb-8 text-lg font-custom2 text-primary">
                    {product.description}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:mt-10 lg:mt-0">
                {product &&
                  (!!product.minimum_guarantee_amount ||
                    !!product.minimum_guarantee_percent ||
                    isOwnProperty) && (
                    <div className="grid grid-cols-1">
                      <div className="flex items-center">
                        {!!product.minimum_guarantee_amount ||
                        !!product.minimum_guarantee_percent ? (
                          <ProductDetail
                            iconName="shield.png"
                            text={
                              product.minimum_guarantee_amount &&
                              product.minimum_guarantee_percent
                                ? `$${product.minimum_guarantee_amount} 
                        ${product.minimum_guarantee_percent}%`
                                : product.minimum_guarantee_amount
                                ? `$${product.minimum_guarantee_amount}`
                                : `${product.minimum_guarantee_percent}%`
                            }
                            description={t("average-min-guarantee")}
                            locked={product.non_negotiable_terms.includes(
                              "minimum_guarantee"
                            )}
                          />
                        ) : isOwnProperty ? (
                          <ProductDetail
                            iconName="shield.png"
                            text={t("not-displayed-product-text")}
                            description={t("average-min-guarantee")}
                            locked={false}
                          />
                        ) : null}
                        {isOwnProperty && (
                          <Modal>
                            <ModalOpenButton>
                              <ProductEditButton />
                            </ModalOpenButton>
                            <ModalContents pencil>
                              <MinimumGuarantee
                                defaultValue1={product.minimum_guarantee_amount}
                                defaultValue2={
                                  product.minimum_guarantee_percent
                                }
                                defaultValueToggle={
                                  product.non_negotiable_terms
                                }
                                refreshProperties={handleRefreshProduct}
                                uuid={product.uuid}
                                displayToggle={product.categories.length < 2}
                              />
                            </ModalContents>
                          </Modal>
                        )}
                      </div>
                    </div>
                  )}
                {product && (isOwnProperty || !!product.royalty_percent) && (
                  <div className="grid grid-cols-1">
                    <div className="flex items-center">
                      {!!product.royalty_percent ? (
                        <ProductDetail
                          iconName="ribbon.png"
                          text={`${product.royalty_percent}%`}
                          description={t("average-royalty")}
                          locked={
                            product.non_negotiable_terms &&
                            product.non_negotiable_terms.includes(
                              "royalty_percent"
                            )
                          }
                        />
                      ) : isOwnProperty ? (
                        <ProductDetail
                          iconName="ribbon.png"
                          text={t("not-displayed-product-text")}
                          description={t("average-royalty")}
                          locked={false}
                        />
                      ) : null}
                      {isOwnProperty && (
                        <Modal>
                          <ModalOpenButton>
                            <div>
                              <ProductEditButton />
                            </div>
                          </ModalOpenButton>
                          <ModalContents pencil>
                            <Royalty
                              defaultValue={
                                product.royalty_percent
                                  ? product.royalty_percent
                                  : t("please-enter-information")
                              }
                              defaultValueToggle={product.non_negotiable_terms}
                              refreshProperties={handleRefreshProduct}
                              uuid={product.uuid}
                              displayToggle={product.categories.length < 2}
                            />
                          </ModalContents>
                        </Modal>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {product &&
          isOwnProperty !== undefined &&
          (!!product.demographic_gender ||
            !!product.demographic_age ||
            !!product.demographic_region ||
            isOwnProperty) && (
            <div className="px-5 mb-10">
              <div className="flex items-center mb-8 text-xl font-bold md:text-3xl font-custom1 text-primary">
                {t("demographics")}
              </div>
              <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2 lg:grid-cols-4">
                {(!!product.demographic_gender || isOwnProperty) && (
                  <DemographicsCard
                    title={t("target-genders")}
                    text={
                      product.demographic_gender
                        ? product.demographic_gender
                        : t("not-displayed-product-text")
                    }
                    isOwnProperty={isOwnProperty}
                    product={product}
                    handleRefreshProduct={handleRefreshProduct}
                    inputName="demographic_gender"
                    defaultVault={product.demographic_gender}
                    inputPlaceholder={t("product.input-genders")}
                    label={t("product.gender-question")}
                  />
                )}
                {(!!product.demographic_age || isOwnProperty) && (
                  <DemographicsCard
                    title={t("target-age")}
                    text={
                      product.demographic_age
                        ? product.demographic_age
                        : t("not-displayed-product-text")
                    }
                    isOwnProperty={isOwnProperty}
                    product={product}
                    handleRefreshProduct={handleRefreshProduct}
                    inputName="demographic_age"
                    defaultVault={product.demographic_age}
                    inputPlaceholder={t("product.input-age")}
                    label={t("product.age-question")}
                  />
                )}
                {(!!product.demographic_region || isOwnProperty) && (
                  <DemographicsCard
                    title={t("target-regions")}
                    text={
                      product.demographic_region
                        ? product.demographic_region
                        : t("not-displayed-product-text")
                    }
                    isOwnProperty={isOwnProperty}
                    product={product}
                    handleRefreshProduct={handleRefreshProduct}
                    inputName="demographic_region"
                    defaultVault={product.demographic_region}
                    inputPlaceholder={t("product.input-region")}
                    label={t("product.region-question")}
                  />
                )}
              </div>
            </div>
          )}

        {(documents?.length > 0 || isOwnProperty) && (
          <>
            <div className="px-5 mb-10">
              <div className="flex justify-between">
                <div className="mb-8 text-xl font-bold md:text-3xl font-custom1 text-primary">
                  {t("additional-brand-information")}
                </div>
                {isOwnProperty && (
                  <ProductAddButton
                    onClick={() => openModal("uploadDocuments")}
                  />
                )}
              </div>

              <div className="flex flex-wrap mb-8 text-lg font-custom2 text-primary">
                {documents.map((doc: ItemDocument, index: number) => {
                  let documentImage = convertedImageLogo(doc.uri);
                  return (
                    <UploadedFile
                      image={documentImage}
                      download={doc.uri}
                      deleteCapable={isOwnProperty ? true : false}
                      key={`${doc}-${index}`}
                      title={doc.filename_original}
                      uri={doc.uri}
                      deleteFile={DeleteDocument}
                    />
                  );
                })}
              </div>
            </div>
            <div className="w-full my-6 md:my-6" />
          </>
        )}
        {product && isOwnProperty && (
          <div className="px-5 mb-10">
            <div className="p-4 border-2 bg-backgroundInput2 rounded-xl border-backgroundInput">
              <div className="flex flex-col">
                <div className="flex items-center mb-8">
                  <div className="text-xl font-bold md:text-3xl font-custom1 text-primary">
                    {t("deal-type")}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:mt-10 lg:mt-0">
                  <div className="flex items-center mb-8 text-lg font-custom2 text-primary">
                    <ProductDetail
                      iconName="star.png"
                      text={
                        product.permitted_deal_types.length > 0
                          ? product.permitted_deal_types.join(", ").toString()
                          : t("unlisted-property-text")
                      }
                      description={t("deal-type")}
                      locked={false}
                    />
                    {isOwnProperty && (
                      <Modal>
                        <ModalOpenButton>
                          <div className="mt-1">
                            <ProductEditButton />
                          </div>
                        </ModalOpenButton>
                        <ModalContents pencil>
                          <PermittedDealTypes
                            defaultValue={product.permitted_deal_types}
                            refreshProperties={handleRefreshProduct}
                            uuid={product.uuid}
                          />
                        </ModalContents>
                      </Modal>
                    )}
                  </div>
                  <div className="flex items-center mb-8 text-lg font-custom2 text-primary">
                    <ProductDetail
                      iconName="note.png"
                      text={
                        product.categories_brand.length > 0
                          ? product.categories_brand.join(", ").toString()
                          : t("please-enter-information")
                      }
                      description={t("brand-categories")}
                      locked={false}
                    />
                    {isOwnProperty && (
                      <Modal>
                        <ModalOpenButton>
                          <div className="mt-1">
                            <ProductEditButton />
                          </div>
                        </ModalOpenButton>
                        <ModalContents pencil>
                          <BrandCategories
                            defaultValue={product.categories_brand}
                            refreshProperties={handleRefreshProduct}
                            uuid={product.uuid}
                          />
                        </ModalContents>
                      </Modal>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full my-6 md:my-6" />
          </div>
        )}

        {!!companyProducts && companyProducts.length > 0 && (
          <div className="px-5 mb-10">
            <div className="mb-8 text-xl font-bold md:text-3xl font-custom1 text-primary">
              {t("more-company-listings")}
            </div>
            <div className="grid grid-cols-1 gap-4 mb-10 md:grid-cols-2 lg:grid-cols-4">
              {companyProducts.map((item: ItemByUUIDResponse) => {
                return (
                  !!item.image_logo && (
                    <div
                      className="relative flex flex-col items-start justify-start flex-1 p-2 mx-4 overflow-hidden transition-all duration-300 rounded-lg shadow-lg cursor-pointer hover:-translate-y-2 xs:mx-0"
                      onClick={() =>
                        router.push(`/product/${item.name_slug}/${item.uuid}`)
                      }
                      key={item.uuid}
                    >
                      <div className="relative w-full overflow-hidden rounded-lg aspect-square">
                        <Image
                          loader={customImageLoader}
                          src={item.image_logo}
                          layout="fill"
                          objectFit="contain"
                          alt={item.name}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="flex flex-row items-center justify-between w-full mx-4 mt-4 mb-4 ">
                        <div className="flex flex-col">
                          <div className="text-base uppercase font-custom1 text-inputGray">
                            {item.user.company_name}
                          </div>
                          <div className="text-xl font-bold font-custom1 text-primary">
                            {item.name}
                          </div>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 mr-10 bg-white border-2 cursor-pointer rounded-xl border-inputGray/30 bg-inputGray/30">
                          {item.user.company_logo.uri && (
                            <OwnImage
                              src={item.user.company_logo.uri}
                              alt="Company Logo"
                              layout="fill"
                              width={48}
                              className="mx-auto"
                              classNameImage=" rounded-xl"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )
                );
              })}
            </div>
          </div>
        )}
        {/*<div className="px-5 mb-10">
            <div className="mb-8 text-xl font-bold md:text-3xl font-custom1 text-primary">
              {t('google-trends')}
            </div>
            {product?.name && (
              <GoogleTrends
                type="TIMESERIES"
                keyword={product.name}
                defaultGeo="US"
                id="brand-trends"
              />
            )}
          </div>*/}
        {/* need to check current user type */}
        {product && showLicensorSelector ? (
          <FooterButtons
            isUser={isOwnProperty}
            onClickBack={onClickBack}
            onClickButton={openModalFooter}
            error={error}
            buttonText={t("request-deal")}
            extraText={t("meet-with-a-brand-specialist")}
            onClickExtra={GoToBrandSpecialist}
            disabled={submitting}
          />
        ) : product ? (
          <FooterButtons
            isUser={isOwnProperty}
            onClickBack={onClickBack}
            onClickButton={onClickButton}
            error={error}
            buttonText={t("request-deal")}
            extraText={t("meet-with-a-brand-specialist")}
            onClickExtra={GoToBrandSpecialist}
            disabled={submitting}
          />
        ) : (
          <FooterButtonsOnlyBack onClickBack={onClickBack} />
        )}
      </div>
      {product && (
        <ModalNew
          isOpen={modal === "companyLogo"}
          title={t("upload-brand-image")}
          subTitle={t("minimum-brand-image-text")}
          closeModal={closeModal}
        >
          <UploadBrand
            closeModal={closeModal}
            itemUuid={product.uuid}
            refresh={handleRefreshProduct}
            postType="logo"
          />
        </ModalNew>
      )}
      {product && (
        <ModalNew
          isOpen={modal === "uploadImages"}
          title={t("upload-brand-images")}
          closeModal={closeModal}
        >
          <UploadBrand
            itemUuid={product.uuid}
            max={6 - product.images.length}
            refresh={handleRefreshProduct}
            postType="image"
            closeModal={closeModal}
          />
        </ModalNew>
      )}
      {product && (
        <ModalNew
          isOpen={modal === "uploadCoverImage"}
          title={t("upload-cover-image")}
          subTitle={t("minimum-cover-image-text")}
          closeModal={closeModal}
        >
          <UploadBrand
            itemUuid={product.uuid}
            max={1}
            refresh={handleRefreshProduct}
            postType="coverImage"
            closeModal={closeModal}
          />
        </ModalNew>
      )}
      {product && (
        <ModalNew
          isOpen={modal === "uploadDocuments"}
          title={t("upload-brand-documents")}
          closeModal={closeModal}
        >
          <UploadBrand
            itemUuid={product.uuid}
            max={100}
            refresh={handleRefreshDocument}
            postType="document"
            closeModal={closeModal}
          />
        </ModalNew>
      )}

      <ChooseBrandModal
        isOpen={isOpen}
        submitting={submitting}
        onSubmit={onClickButton}
        onClose={closeModalFooter}
      />

      {productImages.length > 0 && (
        <Lightbox
          isOpen={isLightboxOpen}
          onPrev={gotoPrevious}
          onNext={gotoNext}
          images={productImages}
          currentIndex={currentImageIndex}
          className="bg-black bg-opacity-75"
          pageTransitionConfig={{
            from: { transform: "scale(0.75)", opacity: 0 },
            enter: { transform: "scale(1)", opacity: 1 },
            leave: { transform: "scale(0.75)", opacity: 0 },
            config: { mass: 1, tension: 320, friction: 32 },
          }}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductView;
