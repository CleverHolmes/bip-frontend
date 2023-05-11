import React from 'react';
import { useTranslation } from 'next-i18next';

import Modal from 'components/new/Modal';
import AcceptTerms from 'wrapper/components/AcceptTerms';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AcceptTermsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      title={t('accept-privacy-policy')}
      closeModal={onClose}
      closable={false}
    >
      <div className="mt-10">
        <AcceptTerms onAcceptTerms={onClose} />
      </div>
    </Modal>
  );
};

export default AcceptTermsModal;
