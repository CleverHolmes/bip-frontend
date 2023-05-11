import { CategoriesItem } from 'models/item/item';

interface BoxFieldProps {
  title: string;
  description: CategoriesItem[];
  emphasis?: CategoriesItem[];
  onClick?: () => void;
  brand?: boolean;
}

const BoxFieldCategories = ({
  title,
  description,
  onClick,
  brand,
  emphasis,
}: BoxFieldProps) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between px-5 py-6 bg-white border-b-2 sm:px-10 border-borderColor"
    >
      <div className="flex flex-col">
        <div className="flex flex-row items-center text-base font-custom1 text-inputGray">
          {title}
        </div>
        {description &&
          description.map((item: any, i: number) => {
            return (
              <div
                className="flex items-start my-1 text-lg font-bold sm:text-xl font-custom1"
                key={`${item.category_name}-${i}`}
              >
                <div className="text-primary">
                  {!emphasis ? (
                    item.category_name
                  ) : !!emphasis.find(
                      (emphasisItem) =>
                        emphasisItem.category_name === item.category_name
                    ) ? (
                    <div className="text-yellow">{item.category_name}</div>
                  ) : (
                    <div>{item.category_name}</div>
                  )}

                  {!!brand && ':'}
                </div>
                <div className="flex flex-wrap items-end">
                  {!!brand && item.products.length === 0 ? (
                    <div className="ml-3 text-button ">Open to all</div>
                  ) : (
                    item.products.map((prod: any, index: number) => {
                      return (
                        <div
                          className="ml-3 text-button "
                          key={`${prod.product_name}-${index}`}
                        >
                          {prod.product_name}
                          {index !== item.products.length - 1 && ', '}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
      </div>
      <div className="cursor-pointer">
        <svg
          width="19"
          height="22"
          viewBox="0 0 19 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 21H18M13 1L17 5L6 16H2V12L13 1Z"
            stroke="#7C8B9E"
            strokeOpacity="0.6"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default BoxFieldCategories;
