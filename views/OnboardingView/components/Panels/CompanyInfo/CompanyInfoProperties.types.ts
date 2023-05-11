export enum ActiveLicenseEnum {
  upto25 = '0-25',
  lessThan100 = '26-100',
  greaterThan100 = '101+',
}

export type CompanyInfoData = {
  agencyName: string;
  territories: Array<number>;
  yearsInBusiness?: number;
  activeLicenses?: ActiveLicenseEnum;
};

export type CompanyInfoFormProperties = {
  company_name: string;
  territories: string[];
  business_years: number;
  active_licensees: string | number[];
};
