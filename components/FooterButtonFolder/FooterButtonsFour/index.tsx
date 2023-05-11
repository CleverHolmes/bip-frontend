import Button from 'components/Buttons/Button';

interface FooterButtonsFourButtonsProps {
  onClickButton: () => void;
  onClickButton2?: () => void;
  onClickButton3?: () => void;
  onClickButton4?: () => void;
  buttonText: string;
  buttonText2?: string;
  buttonText3?: string;
  buttonText4?: string;
  error?: string;
  isUser?: boolean;
  disabled?: boolean;
}

export const FooterButtonsFour: React.FC<FooterButtonsFourButtonsProps> = ({
  onClickButton,
  onClickButton2,
  onClickButton3,
  onClickButton4,
  buttonText,
  buttonText2,
  buttonText3,
  buttonText4,
  error,
  isUser,
  disabled,
}) => {
  return (
    <div
      className={
        '!z-40 sm:fixed sm:left-0 sm:bottom-0 w-full  !bg-white !border-t-2 border-borderColor rounded-t-xl drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]'
      }
    >
      <div className="flex items-end justify-end px-4 pt-5 pb-5 sm:px-10 lg:container lg:mx-auto">
        {!isUser && (
          <div className="flex flex-col items-end justify-center">
            {error && (
              <div className="mb-4 mr-5 text-sm text-red-400 font-custom2">
                {error}
              </div>
            )}
            <div className="flex flex-wrap items-end justify-end">
              {/* BUTTON 4 GREEN */}
              {buttonText4 && (
                <Button
                  onClick={onClickButton4}
                  disabled={disabled}
                  className="my-2 mr-2 bg-green hover:bg-greenButtonHover focus:bg-greenButtonHover focus:ring-green/50 active:bg-greenButtonHover disabled:cursor-not-allowed disabled:bg-greenButtonHover/50 disabled:shadow-none"
                >
                  {buttonText4}
                </Button>
              )}
              {/* BUTTON 3 RED */}
              {buttonText3 && (
                <Button
                  onClick={onClickButton3}
                  disabled={disabled}
                  className="my-2 mr-2 bg-redButton hover:bg-redButtonHover focus:bg-redButtonHover focus:ring-redButton/50 active:bg-redButtonHover disabled:cursor-not-allowed disabled:bg-redButtonHover/50 disabled:shadow-none"
                >
                  {buttonText3}
                </Button>
              )}
            </div>
            <div className="flex flex-wrap items-end justify-end">
              {/* BUTTON 2 YELLOW */}
              {buttonText2 && (
                <Button
                  onClick={onClickButton2}
                  disabled={disabled}
                  color="yellow"
                  className="my-2 mr-2"
                >
                  {buttonText2}
                </Button>
              )}
              {/* BUTTON 1 BLUE */}
              {buttonText && (
                <Button
                  onClick={onClickButton}
                  disabled={disabled}
                  className="my-2 mr-2"
                >
                  {buttonText}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
