import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import Slider from 'react-slick';

import Icon from 'components/Icon';

// if add back in photos how list looks
// const licensorHeaders = [
//   {
//     name: 'listOfCategories',
//     value: 'Accessories',
//     photo: 'accessories.png',
//     id: 1,
//   },
// ];

const brandCategoryHeaders = [
  // {
  //   name: 'listOfBrandCategories',
  //   id: 0,
  //   value: 'Adult',
  // },
  {
    name: 'listOfBrandCategories',
    id: 1,
    value: 'Animation',
  },
  {
    name: 'listOfBrandCategories',
    id: 2,
    value: 'Appliances',
  },
  {
    name: 'listOfBrandCategories',
    id: 3,
    value: 'Art',
  },
  {
    name: 'listOfBrandCategories',
    id: 4,
    value: 'Automotive & Transportation',
  },
  {
    name: 'listOfBrandCategories',
    id: 5,
    value: 'Celebrity',
  },
  {
    name: 'listOfBrandCategories',
    id: 6,
    value: 'Creator & Influencer',
  },
  {
    name: 'listOfBrandCategories',
    id: 7,
    value: 'Entertainment',
  },
  {
    name: 'listOfBrandCategories',
    id: 8,
    value: 'Fashion & Clothing',
  },
  {
    name: 'listOfBrandCategories',
    id: 9,
    value: 'Food & beverage',
  },
  {
    name: 'listOfBrandCategories',
    id: 10,
    value: 'Gaming',
  },
  {
    name: 'listOfBrandCategories',
    id: 11,
    value: 'Health & beauty',
  },
  {
    name: 'listOfBrandCategories',
    id: 12,
    value: 'Infant',
  },
  {
    name: 'listOfBrandCategories',
    id: 13,
    value: 'Kids',
  },
  {
    name: 'listOfBrandCategories',
    id: 14,
    value: 'Music',
  },
  {
    name: 'listOfBrandCategories',
    id: 15,
    value: 'Outdoor gear & equipment',
  },
  {
    name: 'listOfBrandCategories',
    id: 16,
    value: 'Pet products',
  },
  {
    name: 'listOfBrandCategories',
    id: 17,
    value: 'Services',
  },
  {
    name: 'listOfBrandCategories',
    id: 18,
    value: 'Sports & Fitness',
  },
  {
    name: 'listOfBrandCategories',
    id: 19,
    value: 'Teen',
  },
  {
    name: 'listOfBrandCategories',
    id: 20,
    value: 'Toys & Games',
  },
  {
    name: 'listOfBrandCategories',
    id: 21,
    value: 'Travel & tourism',
  },
  {
    name: 'listOfBrandCategories',
    id: 22,
    value: 'Videogames',
  },
];

interface CategoriesProps {
  setCategoriesFilter: (selection: { selections: string[] }) => void;
  categoriesFilter: { selections: string[] };
}

const Categories: React.FC<CategoriesProps> = ({
  setCategoriesFilter,
  categoriesFilter,
}) => {
  const settings = {
    dots: false,
    variableWidth: true,
    speed: 500,
    slidesToScroll: 1,
    infinite: true,
    slidesToShow: 1,
    centerMode: true,
    nextArrow: <ForwardButton />,
    prevArrow: <BackButton />,
  };

  return (
    <Slider {...settings}>
      {brandCategoryHeaders.map((item) => (
        <CategoriesCard
          key={item.id}
          text={item.value}
          // image={item.photo}
          categoriesFilter={categoriesFilter}
          setCategoriesFilter={setCategoriesFilter}
        />
      ))}
    </Slider>
  );
};

export default Categories;

interface Props {
  image?: string;
  text: string;
  setCategoriesFilter: (selection: { selections: string[] }) => void;
  categoriesFilter: { selections: string[] };
}

const CategoriesCard: React.FC<Props> = ({
  image,
  text,
  setCategoriesFilter,
  categoriesFilter,
}) => {
  const active = categoriesFilter.selections.includes(text);
  return (
    <div
      className="flex items-center justify-center w-40 h-16 mx-1 rounded-lg shadow-lg cursor-pointer lg:h-20 lg:w-56"
      onClick={() => {
        categoriesFilter.selections.includes(text)
          ? setCategoriesFilter({
              selections: [],
            })
          : setCategoriesFilter({
              selections: [text],
            });
      }}
    >
      <div
        className={`relative w-full h-full rounded-lg ${
          active
            ? 'bg-primary/80 hover:bg-primary/90'
            : 'bg-primary hover:bg-primary/90'
        }`}
      >
        {image && (
          <Image
            className="rounded-t-lg opacity-40 hover:opacity-50"
            src={`/images/Explore/${image}`}
            alt={image}
            layout="fill"
            objectFit="cover"
          />
        )}
      </div>

      <div className="absolute mx-4 text-sm font-medium text-center text-white uppercase font-custom2 max-w-[100px] md:max-w-[150px] lg:max-w-[200px]">
        {text}
      </div>
    </div>
  );
};

const ForwardButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="absolute z-10 flex items-center justify-center p-2 mb-2 bg-white border-4 rounded-full cursor-pointer -right-2 sm:p-3 top-3 md:top-2 lg:top-4 border-inputGray hover:border-button"
    >
      <Icon
        name="ForwardIcon"
        className="fill-primary"
        viewBox="0 0 18 18"
        size="14"
      />
    </button>
  );
};

const BackButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="absolute z-10 flex items-center justify-center p-2 mb-2 bg-white border-4 rounded-full cursor-pointer -left-2 sm:p-3 border-inputGray top-3 md:top-2 lg:top-4 hover:border-button"
    >
      <Icon
        name="ForwardIcon"
        className="rotate-180 fill-primary"
        viewBox="0 0 18 18"
        size="14"
      />
    </button>
  );
};
