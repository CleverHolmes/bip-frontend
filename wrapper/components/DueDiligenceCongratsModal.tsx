import React from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import Modal from 'components/new/Modal';
import routes from 'constants/routes';
import Button from 'components/Buttons/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const DueDiligenceCongratsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} title={t('due-diligence.questionnaire-has-been-sent')} closeModal={onClose}>
      <div className="flex flex-col items-center">
        <div className="fixed bottom-0 right-0 overflow-hidden pointer-events-none">
          <Image
            src="/images/BackgroundBlur.svg"
            alt="background-blur"
            width={1353}
            height={524}
            objectPosition="right bottom"
            layout="fixed"
          />
        </div>
        <div className="mt-10 text-center text-xl font-custom1 leading-10">
          {t('due-diligence.thank-you-for-submitting')}
        </div>
        <div className="w-full mb-10 mt-10 text-right text-xl font-bold font-custom1">
          {t('the-bip-team')}
        </div>
        <div className="flex flex-col">
          <Button className="self-center mt-10" onClick={onClose}>
            {t('close')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DueDiligenceCongratsModal;
