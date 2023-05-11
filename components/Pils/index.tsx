import OwnImage from 'components/Image';

interface Props {
  text?: string;
  icon?: string;
  viewBox?: string;
  size?:
    | '22'
    | '12'
    | '14'
    | '16'
    | '18'
    | '24'
    | '26'
    | '32'
    | '40'
    | undefined;
}

const Pils: React.FC<Props> = ({ text, icon, viewBox, size }) => {
  return (
    <>
      {text ? (
        <button
          className={
            'drop-shadow-md font-custom2 rounded-full text-lg py-3 px-8 flex justify-center items-center mr-5 bg-white text-button mb-2 cursor-default'
          }
        >
          {text}
        </button>
      ) : (
        icon && (
          <button className="flex items-center justify-center min-w-[64px] min-h-[64px] w-16 h-16 mr-5 text-lg bg-white rounded-full cursor-default drop-shadow-md font-custom2 text-button">
            <OwnImage
              src={`/images/Company/${icon}`}
              alt="ProfileImage"
              layout="fill"
              width={22}
              className="mx-auto overflow-visible"
              // classNameImage=" rounded-full"
            />
            {/* <Icon
              name={icon}
              viewBox={viewBox ? viewBox : '0 0 22 22'}
              size={size ? size : '22'}
              className="overflow-visible cursor-default fill-button"
            /> */}
          </button>
        )
      )}
    </>
  );
};

export default Pils;
