import { useRef, useState, type FC } from 'react';
import type { FormInputProps } from './types';
import { colors } from 'styles/theme/constants';
import { useOutsideClick } from '@chakra-ui/react';

const FormInput: FC<FormInputProps> = ({
  defaultValue,
  children,
  label,
  type = 'text',
  size,
  placeholder,
  icon,
  value,
  width,
  required,
  readOnly,
  onChange,
  showMaxLength = true,
  handleShow,
  inputRef,
  ...otherProps
}) => {
  const ref = useRef<HTMLInputElement>(null);
  useOutsideClick({
    ref,
    handler: () => handleShow && handleShow(false)
  });

  return (
    <>
      <div
        className={`inline-block relative ${!width && 'w-full'} ${
          size === 'small'
            ? `h-56px form-input-small ${value ? 'form-input-small-value' : ''}`
            : `h-56px form-input${value ? 'form-input-value' : ''}`
        }`}
        style={{
          width: width
        }}
        ref={ref}
      >
        <input
          ref={inputRef}
          type={type}
          defaultValue={defaultValue}
          className={`block h-56px ${
            !width && 'w-full'
          } border-0 placeholder-transparent bg-flash_white disabled:bg-calla_lily rounded-lg ${
            readOnly ? 'text-silver_charm' : 'text-dark_willow'
          } disabled:text-silver_charm disabled:cursor-not-allowed focus:outline-none focus:ring-0 ${
            size === 'small'
              ? 'text-size14 leading-22px pt-5 pb-2'
              : 'text-size16 leading-24px pt-24px pb-8px'
          } ${icon ? 'pl-4 pr-12' : 'px-4'}`}
          placeholder={placeholder}
          value={value}
          style={{
            width: width
          }}
          readOnly={readOnly}
          autoComplete="off"
          onChange={(e) => {
            value = e.target.value;
            if (otherProps.maxLength) {
              if (e.target.value.length > otherProps.maxLength) {
                value = e.target.value.slice(0, otherProps.maxLength);
              }
            }

            onChange && onChange(value);
          }}
          {...otherProps}
        ></input>
        <label
          className={`absolute text-silver_charm pointer-events-none transform origin-left transition-all duration-100 ease-in-out ${
            size === 'small' ? 'text-size14 top-16px left-4' : 'text-size16 top-18px left-4'
          }`}
        >
          <div style={{ display: 'flex' }}>
            {label}
            {required ? <div style={{ color: 'red', fontSize: '12px' }}>*</div> : ''}
          </div>
        </label>
        {icon && (
          <span className="h-full w-auto leading-snug text-center absolute top-0 right-0 bg-transparent flex items-center justify-center px-3 py-3">
            {icon}
          </span>
        )}
        {children}
        {otherProps.maxLength && showMaxLength && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <p
              style={{
                fontSize: '10px',
                fontWeight: 400,
                lineHeight: '140%',
                color: colors.silverCharm
              }}
            >
              {`${typeof value === 'string' ? (value ? value.length : 0) : 0}/${
                otherProps.maxLength
              }`}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default FormInput;
