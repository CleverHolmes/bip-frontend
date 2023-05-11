import { ItemSortingEnum } from 'models/item/item';

export const listOfTerritories = [
  {
    name: 'territories',
    type: 'North America',
    value: 'United States',
    id: 1,
  },
  {
    name: 'territories',
    type: 'North America',
    value: 'Canada',
    id: 2,
  },
  { name: 'territories', type: 'EMEA', value: 'France', id: 3 },
  { name: 'territories', type: 'EMEA', value: 'Germany', id: 4 },
  { name: 'territories', type: 'EMEA', value: 'Italy', id: 5 },
  {
    name: 'territories',
    type: 'EMEA',
    value: 'Middle East',
    id: 6,
  },
  { name: 'territories', type: 'EMEA', value: 'Nordics', id: 7 },
  { name: 'territories', type: 'EMEA', value: 'Spain', id: 8 },
  { name: 'territories', type: 'EMEA', value: 'UK', id: 9 },
  { name: 'territories', type: 'LATAM', value: 'Brazil', id: 10 },
  {
    name: 'territories',
    type: 'LATAM',
    value: 'CSA (Central and South America)',
    id: 11,
  },
  { name: 'territories', type: 'LATAM', value: 'Mexico', id: 12 },
  {
    name: 'territories',
    type: 'APAC',
    value: 'Australia & New Zealand',
    id: 13,
  },
  { name: 'territories', type: 'APAC', value: 'China', id: 14 },
  {
    name: 'territories',
    type: 'APAC',
    value: 'Hong Kong',
    id: 15,
  },
  { name: 'territories', type: 'APAC', value: 'Japan', id: 16 },
  {
    name: 'territories',
    type: 'APAC',
    value: 'Southeast Asia',
    id: 17,
  },
  {
    name: 'territories',
    type: 'APAC',
    value: 'South Korea',
    id: 18,
  },
  { name: 'territories', type: 'APAC', value: 'Taiwan', id: 19 },
];

export const typesOfTerritories = ['North America', 'EMEA', 'LATAM', 'APAC'];
export const listOfSorting = [
  { name: 'sorting-trending', value: ItemSortingEnum.VIEW_COUNT },
  { name: 'sorting-alphabetical', value: ItemSortingEnum.NAME },
  { name: 'sorting-newest', value: ItemSortingEnum.CREATED_AT },
];

export const listOfCategories = [
  { name: 'listOfCategories', value: 'Accessories', id: 1 },
  { name: 'listOfCategories', value: 'Apparel', id: 2 },
  { name: 'listOfCategories', value: 'Domestics', id: 3 },
  { name: 'listOfCategories', value: 'Electronics & Accessories', id: 4 },
  { name: 'listOfCategories', value: 'Food/ Beverages', id: 5 },
  { name: 'listOfCategories', value: 'Footwear', id: 6 },
  { name: 'listOfCategories', value: 'Furniture/ Home Furnishings', id: 7 },
  { name: 'listOfCategories', value: 'Gifts/ Novelties', id: 8 },
  { name: 'listOfCategories', value: 'Health/ Beauty', id: 9 },
  { name: 'listOfCategories', value: 'Housewares', id: 10 },
  { name: 'listOfCategories', value: 'Infant Products', id: 11 },
  { name: 'listOfCategories', value: 'Publishing', id: 12 },
  { name: 'listOfCategories', value: 'Sporting Goods', id: 13 },
  { name: 'listOfCategories', value: 'Stationery/ Paper', id: 14 },
  { name: 'listOfCategories', value: 'Toys/ Games', id: 15 },
  {
    name: 'listOfCategories',
    value: 'Video Games/ Software/ Interactive',
    id: 16,
  },
  { name: 'listOfCategories', value: 'Other', id: 17 },
];

export const listOfCategoriesValue = [
  'Accessories',
  'Apparel',
  'Domestics',
  'Electronics & Accessories',
  'Food/ Beverages',
  'Footwear',
  'Furniture/ Home Furnishings',
  'Gifts/ Novelties',
  'Health/ Beauty',
  'Housewares',
  'Infant Products',
  'Publishing',
  'Sporting Goods',
  'Stationery/ Paper',
  'Toys/ Games',
  'Video Games/ Software/ Interactive',
  'Other',
];

export const channelsChoices = ['Online', 'Offline'];

export const step20marks = {
  0: {
    label: <div className="mt-3 text-xs text-inputGray font-custom2">0%</div>,
  },
  20: {
    label: <div className="mt-3 text-xs text-inputGray font-custom2">20%</div>,
  },
  40: {
    label: <div className="mt-3 text-xs text-inputGray font-custom2">40%</div>,
  },
  60: {
    label: <div className="mt-3 text-xs text-inputGray font-custom2">60%</div>,
  },
  80: {
    label: <div className="mt-3 text-xs text-inputGray font-custom2">80%</div>,
  },
  100: {
    label: <div className="mt-3 text-xs text-inputGray font-custom2">100%</div>,
  },
};

export const listIndustries = [
  { name: 'listIndustries', value: 'Auto', id: 1 },
  { name: 'listIndustries', value: 'Apparel', id: 2 },
  { name: 'listIndustries', value: 'Toys', id: 3 },
  { name: 'listIndustries', value: 'Movies', id: 4 },
  { name: 'listIndustries', value: 'Games', id: 5 },
];

export const wholesaleVolumeChoices = [
  {
    name: 'wholesale_volume',
    value: '0 - 25 MM',
    min: 0,
    max: 25000000,
    id: 1,
  },
  {
    name: 'wholesale_volume',
    value: '25 - 50 MM',
    min: 25000000,
    max: 50000000,
    id: 2,
  },
  {
    name: 'wholesale_volume',
    value: '50 - 100 MM',
    min: 50000000,
    max: 100000000,
    id: 3,
  },
  {
    name: 'wholesale_volume',
    value: '100 MM +',
    min: 100000000,
    max: undefined,
    id: 4,
  },
];

export const activeLicenseesChoices = [
  {
    name: 'active_licensees',
    value: '0 - 25',
    min: 0,
    max: 25,
    id: 1,
  },
  {
    name: 'active_licensees',
    value: '26 - 100',
    min: 26,
    max: 100,
    id: 2,
  },
  {
    name: 'active_licensees',
    value: '101 +',
    min: 101,
    max: undefined,
    id: 3,
  },
];

export const typeOfUser = ['licensee', 'licensor', 'agency'];

export const channelsOfDist = [
  {
    name: 'channelsOfDistribution',
    value: 'Mass market stores (Target)',
    id: 1,
  },
  { name: 'channelsOfDistribution', value: 'Department Stores (Macys)', id: 2 },
  {
    name: 'channelsOfDistribution',
    value: 'Mid-Tier Department Stores',
    id: 3,
  },
  { name: 'channelsOfDistribution', value: 'Big Lots', id: 4 },
  { name: 'channelsOfDistribution', value: 'Online retailers', id: 5 },
  { name: 'channelsOfDistribution', value: 'DTC', id: 6 },
  { name: 'channelsOfDistribution', value: 'Off- Price stores', id: 7 },
  { name: 'channelsOfDistribution', value: 'Grocery', id: 8 },
  { name: 'channelsOfDistribution', value: 'Specialty', id: 9 },
];

export const channelsOfDistValue = [
  'Mass market stores (Target)',
  'Department Stores (Macys)',
  'Mid-Tier Department Stores',
  'Big Lots',
  'Online retailers',
  'DTC',
  'Off- Price stores',
  'Grocery',
  'Specialty',
  'Other',
];

export const typeOfDeal = [
  'Licensing',
  'Collaboration',
  // {
  //   name: 'type_of_deal',
  //   value: 'Explore Page',
  //   id: 1,
  // },
  // {
  //   name: 'type_of_deal',
  //   value: 'Collaborations Page',
  //   id: 2,
  // },
];

export const paymentNotificationsFrequency = [1, 5, 15, 30];

export const frequency = [
  {
    name: 'paymentScheduleDateFrequency',
    value: 'Monthly',
    id: 1,
  },
  {
    name: 'paymentScheduleDateFrequency',
    value: 'Quarterly',
    id: 2,
  },
  {
    name: 'paymentScheduleDateFrequency',
    value: 'Annually',
    id: 2,
  },
];

export const paymentTypes = [
  {
    name: 'paymentType',
    value: 'Advance Due',
    id: 1,
  },
  {
    name: 'paymentType',
    value: 'Minimum Guarantee Due',
    id: 2,
  },
  {
    name: 'paymentType',
    value: 'Quarterly Report',
    id: 3,
  },
  {
    name: 'paymentType',
    value: 'Other',
    id: 4,
  },
];

export const paymentTypesAll = [
  {
    name: 'paymentType',
    value: 'Royalty',
    id: 2,
  },
  {
    name: 'paymentType',
    value: 'Advance Due',
    id: 2,
  },
  {
    name: 'paymentType',
    value: 'Minimum Guarantee Due',
    id: 3,
  },
  {
    name: 'paymentType',
    value: 'Other',
    id: 4,
  },
];

export const anchor = [
  {
    name: 'paymentScheduleDateAnchor',
    value: 'Start of the month',
    id: 1,
  },
  {
    name: 'paymentScheduleDateAnchor',
    value: 'End of the month',
    id: 2,
  },
];

export const businessDaysCheckBox = ['Business Days'];

export const brandCategories = [
  // 'Adult',
  'Animation',
  'Appliances',
  'Art',
  'Automotive & Transportation',
  'Celebrity',
  'Creator & Influencer',
  'Entertainment',
  'Fashion & Clothing',
  'Food & beverage',
  'Gaming',
  'Health & beauty',
  'Infant',
  'Kids',
  'Music',
  'Outdoor gear & equipment',
  'Pet products',
  'Services',
  'Sports & Fitness',
  'Teen',
  'Toys & Games',
  'Travel & tourism',
  'Videogames',
];

export const listOfBrandCategories = [
  // { name: 'listOfBrandCategories', value: 'Adult', id: 0 },
  { name: 'listOfBrandCategories', value: 'Animation', id: 1 },
  { name: 'listOfBrandCategories', value: 'Appliances', id: 2 },
  { name: 'listOfBrandCategories', value: 'Art', id: 3 },
  {
    name: 'listOfBrandCategories',
    value: 'Automotive & Transportation',
    id: 4,
  },
  { name: 'listOfBrandCategories', value: 'Celebrity', id: 5 },
  { name: 'listOfBrandCategories', value: 'Creator & Influencer', id: 6 },
  { name: 'listOfBrandCategories', value: 'Entertainment', id: 7 },
  { name: 'listOfBrandCategories', value: 'Fashion & Clothing', id: 8 },
  { name: 'listOfBrandCategories', value: 'Food & beverage', id: 9 },
  { name: 'listOfBrandCategories', value: 'Gaming', id: 10 },
  { name: 'listOfBrandCategories', value: 'Health & beauty', id: 11 },
  { name: 'listOfBrandCategories', value: 'Infant', id: 12 },
  { name: 'listOfBrandCategories', value: 'Kids', id: 13 },
  { name: 'listOfBrandCategories', value: 'Music', id: 14 },
  {
    name: 'listOfBrandCategories',
    value: 'Outdoor gear & equipment',
    id: 15,
  },
  { name: 'listOfBrandCategories', value: 'Pet products', id: 16 },
  { name: 'listOfBrandCategories', value: 'Services', id: 17 },
  { name: 'listOfBrandCategories', value: 'Sports & Fitness', id: 18 },
  { name: 'listOfBrandCategories', value: 'Teen', id: 19 },
  { name: 'listOfBrandCategories', value: 'Toys & Games', id: 20 },
  { name: 'listOfBrandCategories', value: 'Travel & tourism', id: 21 },
  { name: 'listOfBrandCategories', value: 'Videogames', id: 22 },
];
