import 'rc-slider/assets/index.css';

import Slider from 'rc-slider';
import React, { useState } from 'react';

import HeaderSplitPrimaryButton from 'components/HeaderSplitPrimaryButton';

type Props = {
  sliderValue: any;
  setSliderValue: any;
  label?: string;
  marks: any;
  storeProperty: string;
  extraText?: string;
  smaller?: boolean;
};

const SliderInput: React.FC<Props> = ({
  label,
  marks,
  sliderValue,
  setSliderValue,
  storeProperty,
  smaller,
  extraText,
}) => {
  const [focused, setFocused] = useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  const smallerClass = smaller
    ? 'text-xl md:text-2xl lg:text-3xl'
    : 'text-xl md:text-5xl lg:text-7xl';
  const smallerMargin = smaller ? 'mb-8 ' : 'mb-16 ';

  return (
    <div className="flex flex-col">
      {!!label && (
        <label
          className={
            smallerMargin +
            'block mb-16 text-lg font-bold font-custom1 md:text-xl lg:text-2xl'
          }
        >
          <HeaderSplitPrimaryButton label={label} />
          <span className="ml-2 text-base font-normal text-inputGray lg:text-lg">
            {extraText && `(${extraText})`}
          </span>
        </label>
      )}
      <Slider
        marks={marks}
        railStyle={{ backgroundColor: 'rgba(10, 2, 39, 0.04)', height: 17 }}
        trackStyle={{ backgroundColor: 'rgba(74,167,202,1)', height: 17 }}
        handleStyle={{
          background: '#FFFFFF',
          boxShadow: '0px 7px 25px rgba(157, 164, 184, 0.1)',
          height: 28,
          width: 28,
          marginLeft: 0,
          marginTop: -5,
          backgroundColor: 'white',
          opacity: 100,
        }}
        dotStyle={{
          width: 10,
          height: 10,
          background: '#FFFFFF',
          position: 'absolute',
          top: 3,
        }}
        onChange={(value) => {
          setSliderValue(value);
        }}
        value={sliderValue}
      />
      <div className="flex mt-16">
        <input
          type="number"
          name={storeProperty}
          className={
            'pb-1 block appearance-none focus:outline-none bg-transparent placeholder-inputGray relative border-b-2 border-borderColor focus-within:border-button w-20 cursor-pointer ' +
            smallerClass
          }
          onFocus={onFocus}
          onBlur={onBlur}
          value={sliderValue}
          onChange={(e) => {
            setSliderValue(e.target.value);
          }}
        />
        <div className="text-xl md:text-2xl lg:text-3xl">%</div>
      </div>
    </div>
  );
};

export default SliderInput;
