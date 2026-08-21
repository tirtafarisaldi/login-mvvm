import type { FC } from 'react';
import { Children, ReactElement } from 'react';
import type { ReactSelectAsyncPaginateProps } from './types';
import Select, { components } from 'react-select';
import { AsyncPaginate } from 'react-select-async-paginate';
import type { Size } from 'common-types';
import type { PlaceholderProps, ValueContainerProps } from 'react-select';

const { ValueContainer, Placeholder } = components;

const customStyles = (size: Size) => {
  const style = {
    control: (provided: any) => ({
      ...provided,
      height: size === 'small' ? '50px' : '56px',
      border: '0 !important',
      paddingLeft: '8px',
      width: '100%',
      borderRadius: 8,
      background: '#F2F4F6',
      outline: 'none',
      boxShadow: 'none'
    }),
    input: (provided: any, state: any) => ({
      ...provided,
      width: '100%',
      paddingTop: size === 'small' ? '16px' : '20px',
      fontSize: size === 'small' ? '14px' : '16px',
      lineHeight: size === 'small' ? '22px' : '24px',
      color: '#14171A',
      background: '#F2F4F6',
      border: '0',
      borderRadius: 8,
      borderColor: 'none',
      boxShadow: 'none',
      outline: state.isFocused ? 'none' : 'none'
    }),
    singleValue: (provided: any) => ({
      ...provided,
      lineHeight: '24px',
      zIndex: 0,
      paddingTop: size === 'small' ? '16px' : '20px'
    }),
    container: (provided: any) => ({
      ...provided
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      height: '100%',
      overflow: 'visible',
      paddingTop: 0,
      paddingBottom: 0
    }),
    placeholder: (provided: any, state: any) => ({
      ...provided,
      position: 'absolute',
      zIndex: 1,
      color:
        state.hasValue || state.selectProps.menuIsOpen || state.selectProps.inputValue
          ? '#797D7F'
          : '#ADB1B4',
      top:
        state.hasValue || state.selectProps.menuIsOpen || state.selectProps.inputValue
          ? size === 'small'
            ? '6px'
            : '8px'
          : 'translate(50%, 50%)',
      transition: 'top 0.1s, font-size 0.1s',
      fontSize:
        state.hasValue || state.selectProps.menuIsOpen || state.selectProps.inputValue
          ? 11
          : size === 'small'
          ? 14
          : 16
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      display: 'none'
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 2
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      '&:hover': {
        backgroundColor: state.isSelected ? '#E5E9EC' : '#E5E9EC',
        color: state.isSelected ? '#14171A' : '#14171A'
      },
      fontSize: '14px',
      fontWeight: '700',
      color: state.isSelected ? '#14171A' : '#14171A',
      backgroundColor: '#FFFFFF'
    })
  };

  return style;
};

const CustomValueContainer = ({ children, ...props }: ValueContainerProps) => {
  return (
    <ValueContainer {...props}>
      <Placeholder
        {...(props as PlaceholderProps)}
        isFocused={(props as PlaceholderProps).isFocused}
      >
        {props.selectProps.placeholder}
      </Placeholder>
      {Children.map(children, (child) =>
        child && (child as ReactElement).type !== Placeholder ? child : null
      )}
    </ValueContainer>
  );
};

const ReactSelectAsyncPaginate: FC<any> = ({
  value,
  name,
  noOptionsMessage,
  loadOptions,
  onChange,
  additional,
  size = 'large',
  placeholder,
  ...otherProps
}) => {
  return (
    <>
      <div
        className={`inline-block relative w-full ${
          size === 'small' ? 'h-50px form-input-small' : 'h-56px form-input'
        }`}
      >
        <AsyncPaginate
          instanceId={name}
          placeholder={placeholder}
          value={value}
          name={name}
          noOptionsMessage={noOptionsMessage}
          loadOptions={loadOptions}
          onChange={onChange}
          additional={additional}
          styles={customStyles(size)}
          components={{
            ValueContainer: CustomValueContainer
          }}
          {...otherProps}
        />
      </div>
    </>
  );
};

export default ReactSelectAsyncPaginate;
