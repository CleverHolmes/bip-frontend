import Image from 'next/image';

interface Props {
  image: string;
  title: string;
  text: string;
}

const CardHome: React.FC<Props> = ({ image, title, text }) => {
  return (
    <div className="flex pt-8 pb-8 pr-8 transition-all duration-300 rounded-lg bg-card hover:-translate-y-2 md:flex-col">
      <div className="w-60">
        <Image
          src={`/images/Home/${image}`}
          alt={image}
          width="100%"
          height="100%"
          layout="responsive"
          objectFit="contain"
        />
      </div>
      <div className="flex flex-col">
        <div className="ml-2 text-xl font-bold lg:text-2xl font-custom1 text-primary sm:ml4 md:ml-8">
          {title}
        </div>
        <div className="mt-2 ml-2 text-lg lg:text-xl font-custom2 text-inputGray sm:ml4 md:ml-8">
          {text}
        </div>
      </div>
    </div>
  );
};

export default CardHome;
