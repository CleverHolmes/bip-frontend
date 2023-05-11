import React from 'react';
import { useTranslation } from 'next-i18next';

import Modal from 'components/new/Modal';
import Button from 'components/Buttons/Button';
import useStore from 'modules/Store';
import { setAccountFlagCall } from 'api/user/setAccountFlagCall';
import { getCurrentUuid } from 'utils/getCurrentUuid';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TourModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const currentUuid = getCurrentUuid(true);

  const startJoyride = () => {
    useStore.setState({ run: true });
    useStore.setState({ tourActive: true });
    useStore.setState({ stepIndex: 0 });
    onClose();
  };

  const skipJoyride = () => {
    const user = {
      user_uuid: currentUuid,
      account_flag: 'tour_completed',
    };
    setAccountFlagCall(user);
    useStore.setState({ tourCompleted: true });
    useStore.setState({ run: false });
    useStore.setState({ tourActive: false });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={t('explore.joyride-modal-header')}
      closeModal={onClose}
    >
      <div className="py-10 mx-auto text-lg font-custom1 font-primary">
        {t('explore.joyride-modal-text')}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Button onClick={() => skipJoyride()} color="yellow">
          {t('explore.joyride-button-2')}
        </Button>
        <Button onClick={() => startJoyride()}>
          {t('explore.joyride-button-1')}
        </Button>
      </div>
    </Modal>
  );
};

export default TourModal;
