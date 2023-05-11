import React, { useEffect, useState } from 'react';

import Tab from 'components/new/Tab';
import AboutYou from './AboutYou';
import CompanyInfo from './CompanyInfo';
import Confirmation from './Confirmation';
import YourBrands from './YourBrands';
import type { YourBrandsData } from './YourBrands/YourBrands';
import type { OnboardingConfirmationData } from './Confirmation/Confirmation';
import type { AboutYouData } from './AboutYou/AboutYou.types';
import type { CompanyInfoData } from './CompanyInfo/CompanyInfoProperties.types';
import useStore from 'modules/Store';
import { UserRoles } from 'models/user/user';
import Categories from './Categories';

const Panels = () => {
  const [aboutYou, setAboutYou] = useState<AboutYouData>({
    firstName: '',
    lastName: '',
    role: undefined,
    tcAgreed: false,
  });

  const [companyInfo, setCompanyInfo] = useState<CompanyInfoData>({
    agencyName: '',
    territories: [],
  });
  const [yourBrands, setYourBrands] = useState<YourBrandsData>({ brands: [] });
  const [confirmation, setConfirmation] = useState<OnboardingConfirmationData>({
    aboutYou,
    companyInfo,
    yourBrands,
    atAgreed: false,
  });
  const roles = useStore((state) => state.roles);
  const isLicensee = roles.includes(UserRoles.LICENSEE);
  const isLicensor = roles.includes(UserRoles.LICENSOR);

  useEffect(() => {
    setConfirmation({ ...confirmation, aboutYou });
  }, [aboutYou]);

  return (
    <>
      <Tab.Panel unmount={false} className="w-full">
        <div className="w-full">
          <AboutYou />
        </div>
      </Tab.Panel>
      <Tab.Panel unmount={false}>
        <div>
          <CompanyInfo />
        </div>
      </Tab.Panel>
      <Tab.Panel unmount={false}>
        <div>{isLicensee || isLicensor ? <Categories /> : <YourBrands />}</div>
      </Tab.Panel>
      <Tab.Panel unmount={false}>
        <div>
          <Confirmation
            data={confirmation}
            onChange={(data) => setConfirmation(data)}
          />
        </div>
      </Tab.Panel>
    </>
  );
};

export default Panels;
