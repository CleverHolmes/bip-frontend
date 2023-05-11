type SliderControlProperties = {
  activeSlider?: number;
  changeSlider: (slide: number) => void;
};

const SliderControl: React.FC<SliderControlProperties> = ({
  activeSlider,
  changeSlider,
}) => {
  const controlClasses =
    'w-12 h-4 bg-grayN50 mr-4 rounded-full cursor-pointer w-12 h-4 bg-grayN50 rounded-full cursor-pointer z-50 ';

  return (
    <ul className="flex flex-row mx-auto md:mx-24 lg:mx-24 list-none xl:mx-auto h-4">
      <li
        className={
          controlClasses + (activeSlider === 1 ? 'w-40 bg-grayN500' : '')
        }
        onClick={() => changeSlider(1)}
      />
      <li
        className={
          controlClasses + (activeSlider === 2 ? 'w-40 bg-grayN500' : '')
        }
        onClick={() => changeSlider(2)}
      />
      <li
        className={
          controlClasses +
          'mr-4 ' +
          (activeSlider === 3 ? 'w-40 bg-grayN500' : '')
        }
        onClick={() => changeSlider(3)}
      />
    </ul>
  );
};

export default SliderControl;
