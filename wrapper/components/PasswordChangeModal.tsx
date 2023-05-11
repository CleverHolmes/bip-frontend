import React from 'react';
import { useTranslation } from 'next-i18next';

import Modal from 'components/new/Modal';
import ChangePassword from 'components/new/ChangePassword';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordChangeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      title={t('change-password.modal.title')}
      closeModal={onClose}
      closable={false}
    >
      <div className="mt-10 mb-4 text-xl font-bold font-custom1 lg:text-3xl text-primary">
        {t('change-password.modal.description')}
      </div>
      <div className="mt-10">
        <ChangePassword onChangePassword={onClose} />
      </div>
    </Modal>
  );
};

export default PasswordChangeModal;
