import React from 'react';
import Skeleton from 'react-loading-skeleton';

const ProductSkeleton: React.FC = () => {
  return (
    <>
      <div className="flex flex-col">
        <div className="relative w-full h-60 rounded-xl">
          <Skeleton width="100%" height={256} />

          <div className="absolute w-24 h-24 bg-white border-4 border-white rounded-xl sm:w-32 md:w-48 lg:w-40 sm:h-32 md:h-48 lg:h-40 md:border-8 lg:border-14 bottom-2 left-2 lg:-bottom-20 md:left-4 lg:left-20">
            <Skeleton width="100%" height="100%" />
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-5 lg:ml-64">
        <div className="flex flex-col mt-4 md:flex-row md:justify-between">
          <div className="flex flex-col mt-4">
            <Skeleton width={200} height={16} />
            <Skeleton width={200} height={16} className="mt-2" />
          </div>
        </div>
      </div>
      <div className="w-full my-6 md:my-6" />
      <div className="px-5 py-6 my-10 border-2 border-backgroundInput bg-backgroundInput2 rounded-xl">
        <Skeleton width={200} height={16} className="mb-8" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:mt-10 lg:mt-0">
          {[...Array(3)].map((_, i) => {
            return (
              <div className="grid grid-cols-1" key={i}>
                <div className="flex items-center">
                  <Skeleton
                    width={64}
                    height={64}
                    className="mt-8 mb-8 rounded-full"
                  />
                  <div className="flex flex-col ml-4">
                    {[...Array(3)].map((_, i) => {
                      return (
                        <Skeleton
                          width={100}
                          height={16}
                          className="mb-2"
                          key={i}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full my-6 md:my-6" />
      <div className="flex flex-col lg:flex-row">
        {[...Array(3)].map((_, i) => {
          return (
            <div
              className="shadow-lg rounded-xl relative w-[300px] h-[200px] lg:mx-5 my-5"
              key={i}
            >
              <Skeleton width={300} height={200} />
            </div>
          );
        })}
      </div>
      <div className="w-full my-6 md:my-6" />
      <div className="px-5 py-6 my-10 border-2 border-backgroundInput bg-backgroundInput2 rounded-xl">
        <Skeleton width={200} height={16} className="mb-8" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:mt-10 lg:mt-0">
          {[...Array(3)].map((_, i) => {
            return (
              <div className="grid grid-cols-1" key={i}>
                <div className="flex items-center">
                  <Skeleton
                    width={64}
                    height={64}
                    className="mt-8 mb-8 rounded-full"
                  />
                  <div className="flex flex-col ml-4">
                    {[...Array(3)].map((_, i) => {
                      return (
                        <Skeleton
                          width={100}
                          height={16}
                          className="mb-2"
                          key={i}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full my-6 md:my-6" />
    </>
  );
};

export default ProductSkeleton;
