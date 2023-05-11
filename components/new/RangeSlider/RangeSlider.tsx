import { useState, useEffect } from 'react';

type Value = {
  min: number;
  max: number;
};

type RangeSliderProperties = {
  step?: number;
  min?: number;
  max?: number;
  value?: Value;
  onChange: (value: { max: number; min: number }) => void;
  identifier?: string;
};

const RangeSlider: React.FC<RangeSliderProperties> = ({
  min = 0,
  max = 100,
  value,
  step = 5,
  onChange,
  identifier = '%',
}) => {
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);

  useEffect(() => {
    if (value) {
      setMinValue(value.min);
      setMaxValue(value.max);
    }
  }, [value]);

  const handleMinChange = (e: any) => {
    e.preventDefault();
    const newMinVal = Math.min(+e.target.value, maxValue - step);
    if (!value) setMinValue(newMinVal);
    onChange({ min: newMinVal, max: maxValue });
  };

  const handleMaxChange = (e: any) => {
    e.preventDefault();
    const newMaxVal = Math.max(+e.target.value, minValue + step);
    if (!value) setMaxValue(newMaxVal);
    onChange({ min: minValue, max: newMaxVal });
  };

  const minPos = Math.floor(((minValue - min) / (max - min)) * 100);
  const maxPos = Math.floor(((maxValue - min) / (max - min)) * 100);
  const range = max - min;
  const middleSteps = step - 1; // remove first step on 0%;
  const differenceRange = Math.floor(range / step);

  return (
    <div className="relative flex items-center mt-28 md:mt-40 mb-24 h-16 w-[calc(100%-1rem)] mx-auto">
      <div className="w-[calc(100%+1rem)] my-0 -mx-8 absolute h-16">
        <input
          className="absolute w-full pointer-events-none appearance-none h-full opacity-0 z-30 p-0 range-slider"
          type="range"
          value={minValue}
          min={min}
          max={max}
          step={step}
          onChange={handleMinChange}
        />
        <input
          className="absolute w-full pointer-events-none appearance-none h-full opacity-0 z-30 p-0 range-slider"
          type="range"
          value={maxValue}
          min={min}
          max={max}
          step={step}
          onChange={handleMaxChange}
        />
      </div>

      <div className="w-full absolute h-16">
        <div
          className="w-16 h-16 rounded shadow-box-dropButton absolute bg-blueN300 top-1/2 -ml-8 z-20 -translate-y-1/2"
          style={{ left: `${minPos}%` }}
        >
          <span className="absolute font-bodyText bg-white px-5 left-1/2 transform -translate-x-1/2 text-sm text-grayN500 -bottom-20">
            {minPos + identifier}
          </span>
        </div>
        <div className="absolute w-full top-1/2 -translate-y-1/2 h-[0.5rem] rounded bg-grayN50">
          <div
            className="absolute h-full bg-blueN300 z-50"
            style={{
              left: `${Math.floor(minPos)}%`,
              right: `${Math.floor(max - maxPos)}%`,
            }}
          />
          <ul className="absolute list-none z-10 w-[calc(100%_+_1rem)] flex flex-row justify-between -bottom-24 -left-8">
            <li className="relative text-grayN100 font-bodyText text-sm flex justify-center w-1 overflow-visible">
              <span className="left-0 absolute bg-white shadow-box-dropButton rounded w-12 h-12 -top-[1.1875rem]" />
              {min + identifier}
            </li>
            {[...Array(middleSteps)].map((item, index) => (
              <li
                className="relative text-grayN100 font-bodyText text-sm flex justify-center w-1 overflow-visible"
                key={index}
              >
                <span className="left-1/2 transform -translate-x-1/2 absolute bg-white shadow-box-dropButton rounded w-12 h-12 -top-[1.1875rem]" />
                {(index + 1) * differenceRange}
                {identifier}
              </li>
            ))}
            <li className="relative text-grayN100 font-bodyText text-sm flex justify-center w-1 overflow-visible">
              <span className="right-0 absolute bg-white shadow-box-dropButton rounded w-12 h-12 -top-[1.1875rem]" />
              {max + identifier}
            </li>
          </ul>
        </div>
        <div
          className="w-16 h-16 rounded shadow-box-dropButton absolute bg-blueN300 top-1/2 -ml-8 z-20 -translate-y-1/2"
          style={{ left: `${maxPos}%` }}
        >
          <span className="absolute font-bodyText bg-white px-5 left-1/2 transform -translate-x-1/2 text-sm text-grayN500 -bottom-20">
            {maxPos + identifier}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RangeSlider;
