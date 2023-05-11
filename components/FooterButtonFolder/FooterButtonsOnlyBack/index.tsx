import { useTranslation } from 'next-i18next';

import Icon from 'components/Icon';

interface FooterButtonsOnlyBackProps {
  onClickBack: () => void;
}

export const FooterButtonsOnlyBack: React.FC<FooterButtonsOnlyBackProps> = ({
  onClickBack,
}) => {
  const { t } = useTranslation();
  return (
    <div
      className={
        '!z-40 fixed left-0 bottom-0 w-full  !bg-white !border-t-2 border-borderColor rounded-t-xl drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] h-24'
      }
    >
      <div className="flex items-center px-4 pt-5 sm:px-10 lg:px-20 lg:container lg:mx-auto">
        <div
          className={`flex items-center justify-center cursor-pointer mt-3`}
          onClick={onClickBack}
        >
          <Icon
            name="Back"
            className="mt-1 mr-2 fill-primary hover:fill-button"
          />
          <div className="ml-1 text-sm sm:text-lg sm:ml-2 font-custom1 text-primary hover:text-button">
            {t('back')}
          </div>
        </div>
      </div>
    </div>
  );
};
