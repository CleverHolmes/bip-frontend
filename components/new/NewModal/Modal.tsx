import React from 'react';
import classnames from 'classnames';
import Modal from 'react-modal';
import resolveConfig from 'tailwindcss/resolveConfig';

import Icon from 'components/new/Icon';
import tailwindConfig from 'tailwind.config';
import Radio from 'components/new/Radio';
import { ScreenSize, useMediaQuery } from 'hooks/useScreenSize';
import Button from '../Button';

const fullConfig = resolveConfig(tailwindConfig);

const customStyles = {
  overlay: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(48, 56, 67, .6)',
    zIndex: '1000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
};

type ModalProps = {
  children: React.ReactNode;
  bottomLeftSlot?: React.ReactNode;
  className?: string;
  isOpen: boolean;
  closable?: boolean;
  modalTitle?: string;
  buttonSecondary?: string;
  buttonPrimary?: string;
  disabledPrimary?: boolean;
  disabledSecondary?: boolean;
  closeModal: () => void;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
};

const ModalComponent: React.FC<ModalProps> = ({
  children,
  className,
  bottomLeftSlot,
  isOpen,
  closable = true,
  modalTitle = 'Modal Title',
  buttonSecondary,
  buttonPrimary,
  disabledPrimary = false,
  disabledSecondary = false,
  closeModal,
  onPrimaryAction,
  onSecondaryAction,
}) => {
  const isSm = useMediaQuery(ScreenSize.sm, 'lt');

  return (
    <Modal
      className={classnames(
        className,
        'bg-white rounded-2xl p-0 max-w-[38rem] w-11/12 lg:w-full outline-0'
      )}
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Modal"
      shouldCloseOnOverlayClick={closable ? true : false}
      ariaHideApp={false}
    >
      <div className="flex flex-row items-center justify-between bg-white p-24 border-b-1 border-grayN75 rounded-t-2xl">
        <h1 className="font-headings font-bold text-3xl text-grayN500">
          {modalTitle}
        </h1>
        {closable && (
          <Icon
            className="cursor-pointer"
            name="Close"
            size="lg"
            color={fullConfig.theme.colors.grayN500}
            onClick={closeModal}
          />
        )}
      </div>
      <div className="overflow-y-scroll overflow-x-hidden max-h-[34.875rem] py-32 px-24">
        {children}
      </div>
      <div
        className={`flex flex-col items-center gap-24 px-24 py-[1rem] border-t-1 border-grayN75 md:flex-row ${
          bottomLeftSlot ? 'justify-center md:justify-between' : 'justify-end'
        }`}
      >
        {bottomLeftSlot && <div>{bottomLeftSlot}</div>}
        {(buttonSecondary || buttonPrimary) && (
          <div
            className={`w-full md:w-auto flex ${
              bottomLeftSlot ? 'justify-center md:justify-end' : 'justify-end'
            } gap-16`}
          >
            {buttonSecondary && (
              <Button
                variant="secondary"
                size="lg"
                disabled={disabledSecondary}
                onClick={onSecondaryAction}
                fullWidth={isSm}
              >
                {buttonSecondary}
              </Button>
            )}
            {buttonPrimary && (
              <Button
                size="lg"
                variant="primary"
                disabled={disabledPrimary}
                onClick={onPrimaryAction}
                fullWidth={isSm}
              >
                {buttonPrimary}
              </Button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ModalComponent;
