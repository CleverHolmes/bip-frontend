export type DueDiligenceQuestionnaireRequest = {
  userUuid: string;
  dueDiligenceAgencyActingBehalfCompany: boolean;
  dueDiligenceAgencyActingBehalfCompanyBase64: string;
  dueDiligenceAgencyActingBehalfCompanyBase64Filename: string;
  dueDiligenceActiveInsurancePol: boolean;
  dueDiligenceDbas: string;
  dueDiligenceBusinessLicenseBase64: string;
  dueDiligenceBusinessLicenseBase64Filename: string;
  dueDiligenceSpecialtyCertifications: boolean;
  dueDiligenceAttestTrueAndCorrect: boolean;
  dueDiligenceCompanyAddressLine_1: string;
  dueDiligenceCompanyAddressCity: string;
  dueDiligenceCompanyAddressState: string;
  dueDiligenceCompanyAddressCountry: string;
  dueDiligenceCompanyAddressZipCode: string;
  dueDiligenceCompanyPhoneNumberCountryCode: string;
  dueDiligenceCompanyPhoneNumber: string;
  dueDiligenceCompanyAddressLine_2: string;
  dueDiligenceAgencyActingBehalfCompanyName: string;
  dueDiligenceActiveInsurancePolLackDetails: string;
  dueDiligenceActiveInsurancePolBase64: string;
  dueDiligenceActiveInsurancePolBase64Filename: string;
  dueDiligenceSpecialtyCertificationsBase64: string[];
  dueDiligenceSpecialtyCertificationsFilenames: string[];
};

export type DueDiligenceQuestionnaireResponse = {
  dueDiligenceSubmittedDate: string;
};
