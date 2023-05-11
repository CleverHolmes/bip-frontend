import React, { useState } from 'react';

import Chip from 'components/new/Chip';

type InputWithTagsProperties = {
  tags: Array<string>;
  textFieldLabel: string;
  placeholder?: string;
  limit?: number;
  onChange: (tags: Array<string>) => void;
  onDelete: (index: number) => void;
};

const InputWithTags: React.FC<InputWithTagsProperties> = ({
  tags,
  limit = 0,
  onChange,
  onDelete,
  textFieldLabel,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isInputFocus, setIsInputFocus] = useState(false);
  const handleOnChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleOnKeyDown = (e: any) => {
    let newTags: string[] = tags || [];
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      if (!newTags.includes(inputValue.trim())) {
        newTags = [...tags, inputValue.trim()];
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && inputValue === '') {
      e.preventDefault();
      newTags = tags.slice(0, tags.length - 1);
    }
    const updatedTags = newTags
      .map((v) => v.trim().split(','))
      .flat()
      .filter((v) => v !== '');
    onChange(limit ? updatedTags.slice(0, limit) : updatedTags);
  };

  return (
    <div
      className={`min-h-[3.125rem] align-left w-full lg:w-3/4 py-4 rounded-lg border border-1 border-solid overflow-x-auto no-scrollbar ${
        isInputFocus ? `border-blueN200` : 'black'
      } flex flex-row`}
    >
      <div className={`${isInputFocus ? '' : 'hidden'} absolute`}>
        <span
          style={{ display: 'inl' }}
          className="whitespace-nowrap font-bodyText text-[0.75rem] text-blueN200 absolute max-h-20 flex bg-white pl-2 pr-2 top-[-1rem] left-[0.625rem]"
        >
          {textFieldLabel}
        </span>
      </div>
      <div className="flex flex-row items-center justify-center">
        {(tags || []).map((tag, index) => (
          <Chip
            removable={true}
            selected={true}
            key={index.toString()}
            className="max-h-[2rem] ml-1.5"
            label={tag}
            onClick={() => onDelete(index)}
          />
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        className="flex ml-[0.625rem] outline-none border-none w-full"
        onChange={handleOnChange}
        onKeyDown={handleOnKeyDown}
        onBlur={(e) => setIsInputFocus(false)}
        onFocus={(e) => setIsInputFocus(true)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputWithTags;
