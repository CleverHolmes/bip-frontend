import Button from 'components/Buttons/Button';

interface FooterButtonsProps {
  onClickButton: () => void;
  buttonText: string;
  error?: string;
  isUser?: boolean;
  disabled?: boolean;
}

export const FooterButtonsNoBack: React.FC<FooterButtonsProps> = ({
  onClickButton,
  buttonText,
  disabled,
  error,
  isUser,
}) => {
  return (
    <div
      className={
        '!z-40 fixed left-0 bottom-0 w-full  !bg-white !border-t-2 border-borderColor rounded-t-xl drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]' +
        (error ? ' h-36' : ' h-24')
      }
    >
      <div className="flex items-center justify-end px-4 pt-5 sm:px-10 lg:px-20 lg:container lg:mx-auto">
        {!isUser && (
          <div className="flex flex-col items-center justify-center">
            {error && (
              <div className="mb-4 text-sm text-red-400 font-custom2">
                {error}
              </div>
            )}
            <Button disabled={disabled} onClick={onClickButton}>
              {buttonText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
