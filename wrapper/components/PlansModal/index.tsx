import React, { useRef } from 'react';
import { useTranslation } from 'next-i18next';

import Modal from 'components/new/Modal';
import PlanItem from './PlanItem';
import { selfServicePlan, fullServicePlan } from './plans';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PlansModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  let focusingElemRef = useRef(null);

  return (
    <Modal
      isOpen={isOpen}
      title={t('plans-selection.title')}
      initialFocus={focusingElemRef}
      closeModal={onClose}
    >
      <div
        ref={focusingElemRef}
        className="mt-10 flex gap-6 justify-center flex-col items-start md:flex-row"
      >
        <PlanItem plan={selfServicePlan} isSelf onFinish={onClose} />
        <PlanItem plan={fullServicePlan} onFinish={onClose} />
      </div>
    </Modal>
  );
};

export default PlansModal;
