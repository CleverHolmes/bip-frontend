import React, { FC, useState } from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import PopoverPanel from 'components/PopoverPanel';
import Modal from 'components/new/Modal';

type Props = {
  show?: boolean;
  hideInfo?: boolean;
};

const VerifiedMark: FC<Props> = ({ show = false, hideInfo = false }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  if (!show) return null;

  const img = () => (
    <Image
      src="/images/verified-mark.svg"
      alt="Verified User"
      width={20}
      height={20}
    />
  );

  return (
    <span className={`inline-block w-[${20}px] h-[${20}px] shrink-0`}>
      {hideInfo && img()}
      {!hideInfo && (
        <PopoverPanel
          panelClasses="mt-0 text-base md:translate-x-0"
          buttonElem={img}
        >
          <div className="flex flex-col gap-4">
            <Image
              src="/images/verified-mark.svg"
              alt="Verified User"
              width={40}
              height={40}
            />
            <div className="text-xl text-center font-custom1 font-bold">
              {t('checkmark-title')}
            </div>
            <div className="font-normal">
              {t('checkmark-description')}{' '}
              <a
                className="text-blue2 cursor-pointer hover:underline font-bold"
                onClick={() => setIsOpen(true)}
              >
                {t('details')}
              </a>
            </div>
          </div>
        </PopoverPanel>
      )}
      <Modal
        isOpen={isOpen}
        title={t('checkmark-description-title')}
        closeModal={onClose}
      >
        <div className="mt-10">
          {t('checkmark-description-long')}{' '}
          <a
            className="text-blue2 cursor-pointer hover:underline font-bold"
            href="mailto:mail@bip.co"
          >
            mail@bip.co
          </a>
          .
        </div>
      </Modal>
    </span>
  );
};

export default VerifiedMark;
