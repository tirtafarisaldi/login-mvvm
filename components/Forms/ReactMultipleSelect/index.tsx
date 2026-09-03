import type { FC } from 'react';
import type { ReactSelectFilterProps } from './types';
import type { Size } from 'common-types';
import { Children, ReactElement } from 'react';
import Select, { components } from 'react-select';
import type { PlaceholderProps, ValueContainerProps } from 'react-select';
import Text from 'components/Typography/Text';
import { colors } from 'styles/theme/constants';
import { Box } from '@chakra-ui/react';

const { ValueContainer, Placeholder } = components;

const customStyles = (size: Size) => {
  const style = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: size === 'small' ? '50px' : '56px',
      border: '0 !important',
      paddingLeft: '8px',
      width: '100%',
      borderRadius: 8,
      background: state.isDisabled ? colors.callaLily : '#F2F4F6',
      cursor: state.isDisabled ? 'not-allowed' : 'default',
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
      ' label': {
        color: state.isDisabled ? colors.silverCharm : '#14171A',
        cursor: state.isDisabled ? 'not-allowed' : 'default'
      },
      ' [type="checkbox"]': {
        cursor: state.isDisabled ? 'not-allowed' : 'default'
      },
      '&:hover': {
        backgroundColor: state.isSelected ? '#E5E9EC' : '#E5E9EC',
        color: state.isSelected ? '#14171A' : '#14171A'
      },
      cursor: state.isDisabled ? 'not-allowed' : 'default',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '14px',
      fontWeight: '700',
      color: state.isSelected ? '#14171A' : state.isDisabled ? '' : '#14171A',
      backgroundColor: '#FFFFFF',
      '[type="checkbox"]': {
        '&:hover': {
          backgroundColor: state.isSelected ? colors.ottomanRed : '#FFFFFF',
          color: state.isSelected ? colors.flashWhite : 'transparent',
          borderRadius: '4px',
          borderWidth: '2px',
          borderColor: colors.callaLily
        },
        backgroundColor: state.isSelected ? colors.ottomanRed : '#FFFFFF',
        color: state.isSelected ? colors.flashWhite : 'transparent',
        borderRadius: '4px',
        borderWidth: '2px',
        borderColor: colors.callaLily
      }
    }),
    multiValue: (styles: any, { data }: { data: any }) => {
      return {
        ...styles,
        backgroundColor: colors.maryRose,
        borderRadius: '6px'
      };
    },
    multiValueLabel: (styles: any, { data }: { data: any }) => ({
      ...styles,
      color: colors.ottomanRed,
      font: 'Poppins',
      fontSize: '12px',
      fontWeight: 'bold'
    }),
    multiValueRemove: (styles: any, { data }: { data: any }) => ({
      ...styles,
      color: colors.ottomanRed,
      ':hover': {
        backgroundColor: colors.ottomanRed,
        color: colors.flashWhite,
        borderRadius: '6px'
      }
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
      <Box
        paddingTop={'24px'}
        paddingBottom="4px"
        width="auto"
        flexFlow="wrap"
        display="inline-flex"
      >
        {Children.map(children, (child) =>
          child && (child as ReactElement).type !== Placeholder ? child : null
        )}
      </Box>
    </ValueContainer>
  );
};

const CustomOption = (props: any) => {
  return (
    <div>
      <components.Option {...props}>
        <label>{props.label}</label>
        <input type="checkbox" checked={props.isSelected} onChange={() => null} />{' '}
      </components.Option>
    </div>
  );
};

const formatGroupLabel = (data: any) => (
  <Text variant="headlineBold" color={colors.tarnishedSilver} textTransform={'uppercase'} mb="8px">
    {data.label}
  </Text>
);

const ReactMultipleSelect: FC<ReactSelectFilterProps> = ({
  options,
  selectedOption,
  setSelectedOption,
  name,
  placeholder = 'Select...',
  size = 'large',
  ...otherProps
}) => {
  return (
    <>
      <div
        className={`inline-block relative w-full ${
          size === 'small' ? 'min-h-50px form-input-small' : 'min-h-56px form-input'
        }`}
      >
        <Select
          name={name}
          placeholder={placeholder}
          defaultValue={selectedOption}
          value={selectedOption}
          onChange={setSelectedOption}
          styles={customStyles(size)}
          options={options}
          isMulti
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          components={{
            ValueContainer: CustomValueContainer,
            Option: CustomOption
          }}
          formatGroupLabel={formatGroupLabel}
          {...otherProps}
        />
      </div>
    </>
  );
};

export default ReactMultipleSelect;
