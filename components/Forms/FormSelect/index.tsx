import type { FC } from 'react';
import type { FormSelectProps } from './types';
import React from 'react';

const FormSelect: FC<FormSelectProps> = ({
  selectedOption,
  setSelectedOption,
  options = [],
  children,
  label = '',
  size,
  ...otherProps
}) => {
  return (
    <>
      <div
        className={`inline-block relative w-full ${
          size === 'small' ? 'h-50px form-input-small' : 'h-56px form-input'
        }`}
      >
        <select
          className={`block w-full border-0 placeholder-transparent bg-flash_white rounded-lg text-dark_willow focus:ring-0 focus:outline-none px-4 h-full ${
            size === 'small'
              ? 'text-size14 leading-22px pt-3 pb-3'
              : 'text-size16 leading-24px pt-4 pb-4'
          }`}
          // defaultValue={selectedOption}
          value={selectedOption}
          onChange={setSelectedOption}
          {...otherProps}
        >
          {children}
          {options.map((element, index) => {
            return (
              <option key={index} value={element.value}>
                {element.label}
              </option>
            );
          })}
        </select>
        {children}
      </div>
    </>
  );
};

export default FormSelect;
