import { useState, type FC, type KeyboardEventHandler } from 'react';
import type { ReactCreatableSelectProps, Option } from './types';
import CreatableSelect from 'react-select/creatable';
import { Box } from '@chakra-ui/react';
import { colors } from 'styles/theme/constants';
import { Children, ReactElement } from 'react';
import { components } from 'react-select';
import type { PlaceholderProps, ValueContainerProps } from 'react-select';

const { ValueContainer, Placeholder } = components;

const createOption = (label: string) => ({
  label,
  value: label
});

const customStyles = (isFocused: boolean) => ({
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
    color: state.hasValue || isFocused || state.selectProps.inputValue ? '#797D7F' : '#ADB1B4',
    top:
      state.hasValue || isFocused || state.selectProps.inputValue ? '8px' : 'translate(50%, 50%)',
    transition: 'top 0.1s, font-size 0.1s',
    fontSize: state.hasValue || isFocused || state.selectProps.inputValue ? 11 : 16
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    display: 'none'
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    minHeight: '56px',
    border: '0 !important',
    paddingLeft: '8px',
    width: '100%',
    borderRadius: 8,
    background: state.isDisabled ? colors.callaLily : '#F2F4F6',
    outline: 'none',
    boxShadow: 'none'
  }),
  input: (provided: any, state: any) => ({
    ...provided,
    fontSize: '16px',
    lineHeight: '24px',
    border: '0',
    borderRadius: 8,
    borderColor: 'none',
    boxShadow: 'none',
    outline: state.isFocused ? 'none' : 'none',
    padding: 0,
    margin: 0
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
  }),
  menu: (provided: any) => ({
    ...provided,
    zIndex: 2
  })
});

const CustomValueContainer = ({ children, ...props }: any) => {
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

const ReactCreatableSelect: FC<ReactCreatableSelectProps> = ({
  placeholder,
  selectedOption,
  setSelectedOption,
  isDisabled
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // const handleKeyDown: KeyboardEventHandler = (event) => {
  //   console.log(selectedOption, inputValue);
  //   // if (!inputValue) return;
  //   switch (event.key) {
  //     case 'Enter':
  //     case 'Tab':
  //       if (
  //         !selectedOption.some((opt) => opt.value === inputValue) &&
  //         (!inputCondition || (inputCondition && inputValue.match(inputCondition)))
  //       ) {
  //         setSelectedOption((prev: Array<Option>) => [...prev, createOption(inputValue)]);
  //         setInputValue('');
  //       }
  //       event.preventDefault();
  //   }
  // };

  return (
    <Box width="100%">
      <CreatableSelect
        styles={customStyles(isFocused)}
        components={{
          ValueContainer: CustomValueContainer,
          DropdownIndicator: null
        }}
        inputValue={inputValue}
        isClearable
        isMulti
        // menuIsOpen={false}
        onInputChange={(newValue) => setInputValue(newValue)}
        // onKeyDown={handleKeyDown}
        placeholder={placeholder}
        defaultValue={selectedOption}
        value={selectedOption}
        onChange={setSelectedOption}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
        isDisabled={isDisabled}
      />
    </Box>
  );
};

export default ReactCreatableSelect;
