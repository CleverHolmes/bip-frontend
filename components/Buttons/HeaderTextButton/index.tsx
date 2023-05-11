import Accordion from 'components/Accordions/AccordionHome';
import Button from 'components/Buttons/Button';

interface Props {
  header: string;
  text?: string;
  button?: string;
  button2?: string;
  color: string;
  center?: boolean;
  className?: string;
  accordionDropDown?: string;
  onClick?: () => void;
  onClick2?: () => void;
  bigger?: boolean;
}

const HeaderTextButton: React.FC<Props> = ({
  header,
  text,
  button,
  button2,
  color,
  center,
  className,
  accordionDropDown,
  onClick,
  onClick2,
  bigger,
}) => {
  const centered = center
    ? 'text-center '
    : 'text-center md:text-left md:items-start ';
  const headerSize = bigger ? 'text-6xl lg:text-8xl' : 'text-4xl lg:text-6xl';
  const subtextSize = bigger ? 'text-xl lg:text-2xl' : 'text-xl lg:text-2xl';
  return (
    <div
      className={
        centered + `flex flex-col items-center justify-center ` + className
      }
    >
      <div className={`text-${color} font-bold font-custom1 ` + headerSize}>
        {header}
      </div>
      {text && typeof accordionDropDown !== 'string' && (
        <div className={`text-${color} font-custom2 mt-6 mb-16 ` + subtextSize}>
          {text}
        </div>
      )}
      {text && typeof accordionDropDown === 'string' && (
        <Accordion>
          <div
            className={`text-${color} font-custom2 mt-6 mb-16 ` + subtextSize}
          >
            {accordionDropDown}
          </div>
        </Accordion>
      )}
      <div className="flex flex-col md:flex-row">
        {button && (
          <Button
            className="text-xl hover:scale-105 lg:text-2xl"
            onClick={onClick}
          >
            {button}
          </Button>
        )}
        {button2 && (
          <Button
            className="mt-5 text-xl hover:scale-105 lg:text-2xl md:mt-0 md:ml-5"
            color="blue2"
            onClick={onClick2}
          >
            {button2}
          </Button>
        )}
      </div>
    </div>
  );
};

export default HeaderTextButton;
