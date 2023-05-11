import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { NextRouter, useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';
import SwiperClass from 'swiper/types/swiper-class';
import Lightbox, { ImagesListType } from 'react-spring-lightbox';
import { ImagesList } from 'react-spring-lightbox/dist/types/ImagesList';

import Cards from './components/Cards';
import Deal from './components/Deal';
import Gallery from './components/Gallery';
import About from './components/About';
import Social from './components/Social';
import Demographics from './components/Demographics';
import More from './components/More';
import NewCarousel from 'views/ExploreView/components/Carousel';
import useStore from 'modules/Store';
import useTokensOrCookies from 'contexts/TokensOrCookies';
import {
  CategoriesItem,
  ItemByUUIDResponse,
  ItemDocument,
  ItemDocumentsByUuidResponse,
  MediaUri,
  MediaUriEnum,
  ProductItem,
} from 'models/item/item';
import useCheckRole from 'hooks/useCheckRole';
import { getUserQueryKey } from 'api/user/getUserCall';
import { delegateQueryKey } from 'api/delegate/delegate';
import { findItemByUuid } from 'api/item/findItemByUuid';
import { findUserByUuid } from 'api/user/findUserByUuid';
import customImageLoader from 'utils/image-loader';
import { throwError } from 'utils/error';
import { findItems } from 'api/item/findItems';
import { findItemDocumentsByUuidCall } from 'api/item/findItemDocumentsByUuid';
import Breadcrumb from 'components/new/Breadcrumb';
import routes from 'constants/routes';
import Button from 'components/new/Button';
import CompanyHeader from 'views/CompanyView/components/CompanyHeader';

interface Product {
  categories: { category_name: string }[];
}

interface Categories {
  [key: string]: Product[];
}

const companies = [
  {
    image_logo: '/images/Brand/Default.svg',
    name: 'Missing Link',
    user: { company_name: 'By: Licensor Name' },
  },
  {
    image_logo: '/images/Brand/Default.svg',
    name: 'Missing Link',
    user: { company_name: 'By: Licensor Name' },
  },
  {
    image_logo: '/images/Brand/Default.svg',
    name: 'Missing Link',
    user: { company_name: 'By: Licensor Name' },
  },
  {
    image_logo: '/images/Brand/Default.svg',
    name: 'Missing Link',
    user: { company_name: 'By: Licensor Name' },
  },
  {
    image_logo: '/images/Brand/Default.svg',
    name: 'Missing Link',
    user: { company_name: 'By: Licensor Name' },
  },
  {
    image_logo: '/images/Brand/Default.svg',
    name: 'Missing Link',
    user: { company_name: 'By: Licensor Name' },
  },
  {
    image_logo: '/images/Brand/Default.svg',
    name: 'Missing Link',
    user: { company_name: 'By: Licensor Name' },
  },
  {
    image_logo: '/images/Brand/Default.svg',
    name: 'Missing Link',
    user: { company_name: 'By: Licensor Name' },
  },
  {
    image_logo: '/images/Brand/Default.svg',
    name: 'Missing Link',
    user: { company_name: 'By: Licensor Name' },
  },
];

const BrandView: React.FC = () => {
  const { t } = useTranslation();
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
  const queryClient = useQueryClient();
  const [categoryString, setCategoryString] = useState<string>('');
  const [currentImageIndex, setCurrentIndex] = useState(0);
  const [product, setProduct] = useState<ItemByUUIDResponse | null>();
  const [productImages, setProductImages] = useState<ImagesListType>([]);
  const [agentName, setAgentName] = useState<string>();
  const [agentId, setAgentId] = useState<string>();
  const [agentUri, setAgentUri] = useState<string>();
  const [companyProducts, setCompanyProducts] =
    useState<ItemByUUIDResponse[]>();

  const [documents, setDocuments] = useState<ItemDocumentsByUuidResponse>([]);
  const [isOwnProperty, setIsOwnProperty] = useState<boolean>();

  const [refreshProduct, setRefreshProduct] = useState<boolean>(true);
  const [refreshDocuments, setRefreshDocuments] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [swiper, setSwiper] = useState<SwiperClass>();
  const [isOpen, setIsOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const { isLicensee, isLicensor, isAgency } = useCheckRole();
  const youtubeMedia: MediaUri | undefined = product?.media_uris.find(
    (mediaUri) =>
      mediaUri.media_uri_type === MediaUriEnum.YOUTUBE && !!mediaUri.media_uri
  );
  const showLicensorSelector = (isLicensor && query.collaboration) || isAgency;
  const breadcrumbLinks = [
    {
      label: t('header.explore'),
      url: routes.explore,
    },
    {
      label: product?.name,
      url: null,
    },
  ];

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

  useEffect(() => {
    if (product && !accessToken) {
      useStore.setState({
        current_page: query.collaboration
          ? `product/${product?.name_slug}/${query.product}?collaboration=true`
          : `product/${product?.name_slug}/${query.product}`,
      });
      router.replace('/login');
    }
  }, [product, query.product, router, query.collaboration, accessToken]);

  const fetchProduct = async (productId: string) => {
    const res = await findItemByUuid(productId);
    setProduct(res);
    let productImageArray: ImagesList = [];

    res?.images.map((image) => {
      productImageArray.push({
        src: customImageLoader({ src: image }),
        loading: 'lazy',
        alt: image,
      });
    });
    productImageArray.length > 0 && setProductImages(productImageArray);

    let cs = '';
    res.categories.map((item: CategoriesItem) => {
      cs += `${item.category_name}: `;
      item.products.length === 0
        ? (cs += 'Open to all\n')
        : item.products.map((prod: ProductItem, index: number) => {
            cs +=
              prod.product_name +
              (index !== item.products.length - 1 ? ', ' : ' \n');
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
    if (product && !accessToken) {
      useStore.setState({
        current_page: query.collaboration
          ? `new/brand/${product?.name_slug}/${query.product}?collaboration=true`
          : `new/brand/${product?.name_slug}/${query.product}`,
      });
      router.replace('/login');
    }
  }, [product, query.product, router, query.collaboration, accessToken]);

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

  return (
    <>
      {product && (
        <div className="px-20 xl:px-0">
          <Breadcrumb links={breadcrumbLinks} />
          <CompanyHeader
            categoryName={product?.categories?.[0]?.category_name}
            logo={product.image_logo}
            heroImage={product.image_banner}
            companyName={product?.name}
            user={product?.user}
            bottomRightSlot={
              <div className="flex flex-row items-center md:items-start gap-8 sm:gap-16 lg:ml-auto w-full lg:w-max flex-wrap sm:flex-nowrap w-full">
                <Button
                  className="lg:w-auto w-full whitespace-nowrap"
                  size="lg"
                  variant="secondary"
                >
                  {t('meet-with-a-brand-specialist')}
                </Button>
                <Button
                  className="lg:w-auto w-full whitespace-nowrap"
                  size="lg"
                  variant="primary"
                >
                  {t('request-deal')}
                </Button>
              </div>
            }
          />
          {/*<Cards />*/}
          <Deal
            categories={product.categories_brand}
            territories={product.territories}
          />
          <Gallery images={product.images} media={product.media_uris} />
          <About />
          {/*<Social />*/}
          <Demographics />
          <div className="mb-48">
            <NewCarousel
              carouselName={t('brand-page.more-company-listings')}
              brandList={companies}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default BrandView;
