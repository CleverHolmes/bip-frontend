import { useTranslation } from 'next-i18next';

import Button from 'components/Buttons/Button';
import Icon from 'components/Icon';

interface FooterButtonsProps {
  onClickBack: () => void;
  onClickButton: () => void;
  onClickButton2?: () => void;
  buttonText: string;
  buttonText2?: string;
  extraText?: string;
  onClickExtra?: () => void;
  error?: string;
  isUser?: boolean;
  disabled?: boolean;
}

export const FooterButtons: React.FC<FooterButtonsProps> = ({
  onClickBack,
  onClickButton,
  onClickButton2,
  buttonText,
  buttonText2,
  extraText,
  onClickExtra,
  error,
  isUser,
  disabled,
}) => {
  const { t } = useTranslation();
  return (
    <div
      className={
        '!z-40 fixed left-0 bottom-0 w-full  !bg-white !border-t-2 border-borderColor rounded-t-xl drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]' +
        (error ? ' sm:min-h-[144px]' : ' sm:min-h-[96px]')
      }
    >
      <div className="flex items-center justify-between px-4 pt-5 sm:px-10 lg:px-20 lg:container lg:mx-auto">
        <div className="flex items-center justify-center">
          <div
            className={`flex items-center justify-center cursor-pointer ${
              isUser ? 'mt-3' : ''
            }`}
            onClick={onClickBack}
          >
            <Icon
              name="Back"
              className="mt-1 mr-2 fill-primary hover:fill-button"
            />
            <div className="ml-1 text-sm leading-none sm:text-lg sm:ml-2 font-custom1 text-primary hover:text-button">
              {t('back')}
            </div>
          </div>
          {extraText && (
            <div className="hidden md:flex md:mb-0 md:ml-4">
              <Button onClick={onClickExtra} color="orange">
                {extraText}
              </Button>
            </div>
          )}
        </div>
        {!isUser && (
          <div className="flex flex-col items-center justify-center">
            {error && (
              <div className="mb-4 text-sm text-red-400 font-custom2">
                {error}
              </div>
            )}
            <div className="flex flex-col items-center mb-4 lg:mb-0 lg:flex-row">
              {extraText && (
                <div className="mb-4 md:hidden md:mb-0">
                  <Button onClick={onClickExtra} color="orange">
                    {extraText}
                  </Button>
                </div>
              )}
              {buttonText2 && (
                <Button
                  onClick={onClickButton2}
                  disabled={disabled}
                  color="yellow"
                  className="mb-4 lg:mb-0 lg:mr-8"
                >
                  {buttonText2}
                </Button>
              )}
              <Button onClick={onClickButton} disabled={disabled}>
                {buttonText}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
