import OwnImage from 'components/Image';

interface Props {
  image: string;
  title: string;
  isActive: boolean;
  onClick?: any;
  type: string;
  id?: string;
}

const ProfileViewCard: React.FC<Props> = ({
  image,
  title,
  isActive,
  onClick,
  type,
  id,
}) => {
  const activeClass = isActive
    ? ' bg-backgroundInput rounded-lg shadow-lg drop-shadow-lg border-inputGray border-1'
    : ' bg-white';
  const activeClassText = isActive ? ' text-primary' : ' text-inputGray';
  return (
    <div
      className={
        'flex flex-col md:flex-row items-center text-center md:text-left px-1 py-1 my-1 sm:mr-4 transition-all duration-300 hover:-translate-y-1 min-h-[80px] max-w-[100px] md:max-w-full' +
        activeClass
      }
      onClick={onClick}
    >
      <OwnImage
        src={`/images/${type}/${image}`}
        alt={image}
        width={60}
        layout="fill"
        className="bg-none"
      />
      <div
        id={id}
        className={
          'ml-2 text-base text-center font-bold font-custom1 hover:text-button cursor-pointer' +
          activeClassText
        }
      >
        {title}
      </div>
    </div>
  );
};

export default ProfileViewCard;
