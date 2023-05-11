type itemType = 'Licensable Property' | 'Licensable Patent' | 'Patent Rights';

// @typescript-eslint/no-shadow
export enum DealTypeEnum {
  'Licensing',
  'Collaboration',
}

export enum ItemSortingEnum {
  NAME = 'name',
  VIEW_COUNT = 'view_count',
  CREATED_AT = 'created_at',
}
export enum MediaUriEnum {
  YOUTUBE = 'YouTube',
}

export type PostItemRequest = {
  uuid: string;
  user_uuid: string;
  name: string;
  description: string;
  item_type: itemType;
  permitted_deal_types?: Array<keyof typeof DealTypeEnum>;
  images?: string[];
  territories?: string[];
  distribution_channels?: string[];
  categories: CategoriesItem[];
  categories_brand?: string[];
  offer_deadline?: string;
  royalty_percent?: number;
  non_negotiable_terms?: string[];
  minimum_guarantee_percent?: number;
  minimum_guarantee_amount?: number;
  demographic_gender: string;
  demographic_age: string;
  demographic_region: string;
  demographic_target: string;
  media_uris?: MediaUri[];
};

export type CategoriesItem = {
  category_name: string;
  products: ProductItem[];
};

export type MediaUri = {
  media_uri_type: MediaUriEnum;
  media_uri: string;
};

export type ProductItem = {
  product_name: string;
};

export type PatchItemRequest = {
  uuid: string;
  user_uuid?: string;
  name?: string;
  description?: string;
  item_type?: itemType;
  permitted_deal_types?: Array<keyof typeof DealTypeEnum>;
  images?: string[];
  documents?: string[];
  territories?: string[];
  distribution_channels?: string[];
  categories?: CategoriesItem[];
  categories_brand?: string[];
  offer_deadline?: Date;
  royalty_percent?: number;
  non_negotiable_terms?: string[];
  minimum_guarantee_percent?: number;
  minimum_guarantee_amount?: number;
  demographic_gender?: string;
  demographic_age?: string;
  demographic_region?: string;
  demographic_target?: string;
  media_uris?: MediaUri[];
};

export type PatchItem = {
  uuid: string;
  name: string;
  description: string;
  item_type: itemType;
  territories: string[];
  distribution_channels: string[];
  categories: CategoriesItem[];
  categories_brand: string[];
  offer_deadline: string;
  royalty_percent: number;
  non_negotiable_terms: string[];
  minimum_guarantee_percent: number;
  minimum_guarantee_amount: number;
  demographic_gender: string;
  demographic_age: string;
  demographic_region: string;
  demographic_target: string;
};

export type ItemByUUIDResponse = {
  user: user;
  wordmark_verified: boolean;
  deal_making_permitted_by_verified_users_only: boolean;
  uuid: string;
  user_uuid: string;
  [ItemSortingEnum.NAME]: string;
  [ItemSortingEnum.CREATED_AT]: string;
  [ItemSortingEnum.VIEW_COUNT]: number;
  name_slug: string;
  description: string;
  item_type: itemType;
  image_banner: string;
  image_logo: string;
  permitted_deal_types: Array<keyof typeof DealTypeEnum>;
  images: string[];
  documents: string[];
  territories: string[];
  distribution_channels: string[];
  categories: CategoriesItem[];
  categories_brand: string[];
  offer_deadline: string;
  royalty_percent: number;
  non_negotiable_terms: string[];
  minimum_guarantee_percent: number;
  minimum_guarantee_amount: number;
  demographic_gender: string;
  demographic_age: string;
  demographic_region: string;
  demographic_target: string;
  media_uris: MediaUri[];
  categoriesNamesFilter?: string[];
};

export type user = {
  uuid: string;
  brands_represented: string[];
  company_logo: { uri: string };
  company_name: string;
  delegates: delegateUser[];
};

export type delegateUser = {
  delegate_type: number;
  delegate_uuid: string;
};

export type FindItemsRequest = {
  params: {
    user_uuid?: string;
    take?: number;
  };
};

export type ItemsPermittedRequest = {
  params: {
    user_uuid: string;
  };
};

export type ItemsPermittedResponse = {
  uuid: string;
  name: string;
  item_type: string;
};

export type AddItemPermittedRequest = {
  user_uuid: string;
  name: string;
  item_type: string;
};

export type AddItemPermittedResponse = {
  uuid: string;
  error_message: string;
};

export type ItemImagesByUuidResponse = {
  images: string[];
};

export type ItemDocumentsByUuidResponse = Array<ItemDocument>;

export type ItemDocument = {
  uri: string;
  filename_original: string;
  created_at: string;
};

export type PatchItemResponse = {
  uuid: string;
};
