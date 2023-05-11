import React, { useEffect, useState } from 'react';
import { NextRouter, useRouter } from 'next/router';

import DueDiligenceModal from 'wrapper/components/DueDiligenceModal';
import PasswordChangeModal from 'wrapper/components/PasswordChangeModal';
import AcceptTermsModal from 'wrapper/components/AcceptTermsModal';
import PlansModal from 'wrapper/components/PlansModal';
import TourModal from 'wrapper/components/TourModal';
import useStore from 'modules/Store';
import { getCurrentAccountFlags } from 'utils/getCurrentAccountFlags';
import { AccountFlags } from 'models/user/user';
import { checkAccountFlag } from 'utils/checkAccountFlag';
import routes from 'constants/routes';

export enum ModalsEnum {
  ACCEPT_TERMS = 'acceptTerms',
  PASSWORD_CHANGE = 'passwordChange',
  PLANS = 'plans',
  DUE_DILIGENCE = 'dueDiligence',
  TOUR = 'tour',
}

const FirstLoadModals: React.FC = () => {
  const router: NextRouter = useRouter();

  const isDueDiligenceModalOpen = useStore(
    (state) => state.isDueDiligenceModalOpen
  );
  const updateDueDiligenceModalOpen = useStore(
    (state) => state.updateDueDiligenceModalOpen
  );
  const isPlansModalOpen = useStore((state) => state.isPlansModalOpen);
  const updatePlansModalOpen = useStore((state) => state.updatePlansModalOpen);

  const tourCompleted = useStore((state) => state.tourCompleted);
  const roles = useStore((state) => state.roles);

  const [isAcceptTermsModalOpen, setIsAcceptTermsModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [isOpenJoyride, setIsOpenJoyride] = useState<boolean>(false);

  const [modalsStack, setModalsStack] = useState<ModalsEnum[]>([]);
  const [isChecked, setIsChecked] = useState(false);

  const accountFlags = getCurrentAccountFlags(true);

  const forcePlanSelection = checkAccountFlag(
    AccountFlags.FORCE_PLAN_SELECTION,
    true
  );

  useEffect(() => {
    const newModalStack: ModalsEnum[] = [];

    if (!isChecked && roles.length && router.pathname !== routes.home) {
      if (accountFlags.includes(AccountFlags.TERMS_NOT_ACCEPTED)) {
        newModalStack.push(ModalsEnum.ACCEPT_TERMS);
      }

      if (accountFlags.includes(AccountFlags.FORCE_PASSWORD_CHANGE)) {
        newModalStack.push(ModalsEnum.PASSWORD_CHANGE);
      }

      if (forcePlanSelection) {
        newModalStack.push(ModalsEnum.PLANS);
      }

      if (
        !accountFlags.includes(AccountFlags.TOUR_COMPLETED) &&
        !accountFlags.includes(AccountFlags.CUSTOMER_SERVICE) &&
        !tourCompleted
      ) {
        newModalStack.push(ModalsEnum.TOUR);
      }
      setIsChecked(true);
    }

    setModalsStack(newModalStack);
  }, [roles]);

  useEffect(() => {
    showModal();
  }, [modalsStack]);

  const showModal = () => {
    const nextModal: ModalsEnum = modalsStack[0];

    if (nextModal) {
      switch (nextModal) {
        case ModalsEnum.ACCEPT_TERMS:
          setIsAcceptTermsModalOpen(true);
          break;
        case ModalsEnum.PASSWORD_CHANGE:
          setIsChangePasswordModalOpen(true);
          break;
        case ModalsEnum.PLANS:
          updatePlansModalOpen(true);
          break;
        case ModalsEnum.TOUR:
          setIsOpenJoyride(true);
          break;
      }
    }
  };

  const closeModal = (name: ModalsEnum, setFunc: any) => {
    setFunc(false);
    setModalsStack(modalsStack.filter((item) => item !== name));
  };

  return (
    <div>
      <AcceptTermsModal
        isOpen={isAcceptTermsModalOpen}
        onClose={() =>
          closeModal(ModalsEnum.ACCEPT_TERMS, setIsAcceptTermsModalOpen)
        }
      />

      <PasswordChangeModal
        isOpen={isChangePasswordModalOpen}
        onClose={() =>
          closeModal(ModalsEnum.PASSWORD_CHANGE, setIsChangePasswordModalOpen)
        }
      />

      <PlansModal
        isOpen={isPlansModalOpen}
        onClose={() => closeModal(ModalsEnum.PLANS, updatePlansModalOpen)}
      />

      {isDueDiligenceModalOpen && (
        <DueDiligenceModal
          isOpen={isDueDiligenceModalOpen}
          onClose={() =>
            closeModal(ModalsEnum.DUE_DILIGENCE, updateDueDiligenceModalOpen)
          }
        />
      )}

      <TourModal
        isOpen={isOpenJoyride}
        onClose={() => closeModal(ModalsEnum.TOUR, setIsOpenJoyride)}
      />
    </div>
  );
};

export default FirstLoadModals;
