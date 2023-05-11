import React from 'react';
import { useTranslation } from 'next-i18next';

import { ItemByUUIDResponse } from 'models/item/item';
import { Modal, ModalContents, ModalOpenButton } from 'components/ModalWindow';
import Demographics from 'components/Modals/Demographics';
import ProductEditButton from './ProductEditButton';

interface Props {
  title: string;
  text: string;
  isOwnProperty: boolean;
  product: ItemByUUIDResponse;
  handleRefreshProduct: () => void;
  inputName: string;
  inputPlaceholder: string;
  defaultVault: string;
  label: string;
}

const DemographicsCard: React.FC<Props> = ({
  title,
  text,
  isOwnProperty,
  product,
  handleRefreshProduct,
  inputName,
  inputPlaceholder,
  defaultVault,
  label,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[190px] bg-white rounded-2xl shadow-lg p-2">
      <div className="text-lg font-medium uppercase lg:text-xl text-inputGray font-custom1">
        {title}
      </div>
      <div className="mt-2 text-2xl font-bold uppercase lg:text-3xl text-primary font-custom1 text-center">
        {t(text)}
      </div>
      {isOwnProperty && (
        <Modal>
          <ModalOpenButton>
            <div className="mt-1">
              <ProductEditButton />
            </div>
          </ModalOpenButton>
          <ModalContents pencil>
            <Demographics
              defaultValue={defaultVault}
              refreshProperties={handleRefreshProduct}
              uuid={product.uuid}
              inputName={inputName}
              inputPlaceholder={inputPlaceholder}
              label={label}
            />
          </ModalContents>
        </Modal>
      )}
    </div>
  );
};

export default DemographicsCard;
