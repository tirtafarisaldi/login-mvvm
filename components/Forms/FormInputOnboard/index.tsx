import type { FC } from 'react';
import type { FormInputOnboardProps } from './types';
import React from 'react';

const FormInputOnboard: FC<FormInputOnboardProps> = ({
  defaultValue,
  children,
  label = '',
  type = 'text',
  placeholder = 'Isi Form...',
  ...otherProps
}) => {
  return (
    <>
      <div className="inline-block relative w-full h-48px form-input-onboard">
        <input
          type={type}
          defaultValue={defaultValue}
          className="block w-full border-0 placeholder-transparent bg-flash_white disabled:bg-calla_lily rounded-lg text-dark_willow disabled:text-silver_charm disabled:cursor-not-allowed focus:outline-none focus:ring-0 px-4 text-size16 leading-24px pt-5 pb-1"
          placeholder={placeholder}
          {...otherProps}
        ></input>
        <label className="absolute text-silver_charm pointer-events-none transform origin-left transition-all duration-100 ease-in-out text-size16 top-15px left-4">
          {label}
        </label>
        {children}
      </div>
    </>
  );
};

export default FormInputOnboard;
