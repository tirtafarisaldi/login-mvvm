import type { FC, ReactNode } from 'react';
import type { DropdownSearchMultipleProps } from './types';
import type { Size } from 'common-types';
import { Children, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import Select, { components } from 'react-select';
import type { PlaceholderProps, ValueContainerProps } from 'react-select';
import Text from 'components/Typography/Text';
import { colors } from 'styles/theme/constants';
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Tooltip,
  useOutsideClick
} from '@chakra-ui/react';
import Search from 'components/Icon/Search';
import Empty from 'components/Icon/Empty';
import Info from 'components/Icon/Info';
import { Button } from 'components/Button';
import ChevronUp from 'components/Icon/ChevronUp';
import ChevronDown from 'components/Icon/ChevronDown';

const { ValueContainer, Placeholder, MenuList } = components;

const customStyles = (size: Size, hasValue: boolean) => {
  const style = {
    dropdownIndicator: (base: any) => ({
      ...base,
      color: colors.silverCharm
    }),
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: '56px',
      border: '0 !important',
      paddingLeft: '8px',
      paddingRight: '8px',
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
      fontSize: size === 'small' ? '14px' : '16px',
      lineHeight: size === 'small' ? '22px' : '24px',
      color: '#14171A',
      background: '#F2F4F6',
      border: '0',
      borderRadius: 8,
      borderColor: 'none',
      boxShadow: 'none',
      outline: state.isFocused ? 'none' : 'none',
      display: 'none'
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
    valueContainer: (provided: any, state: any) => ({
      ...provided,
      height: '100%',
      overflow: 'visible',
      paddingTop: 0,
      paddingBottom: hasValue && state.name !== '' && '12px',
      cursor: 'pointer'
    }),
    placeholder: (provided: any, state: any) => ({
      ...provided,
      position: 'absolute',
      top: hasValue && '10px',
      zIndex: 1,
      color:
        state.hasValue || state.selectProps.menuIsOpen || state.selectProps.inputValue
          ? '#797D7F'
          : '#ADB1B4',
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
        cursor: state.isDisabled ? 'not-allowed' : 'default',
        paddingTop: '4px',
        paddingBottom: '4px'
      },
      ' [type="checkbox"]': {
        cursor: state.isDisabled ? 'not-allowed' : 'default'
      },
      '&:hover': {
        backgroundColor: state.isFocused ? colors.maryRose : '#E5E9EC',
        color: state.isFocused ? colors.ottomanRed : '#14171A'
      },
      cursor: state.isDisabled ? 'not-allowed' : 'default',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
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
        borderColor: colors.callaLily,
        marginRight: '8px'
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

const SelectedOptionComponent = ({
  selectedOption,
  handleRemoveSelectedOption
}: {
  selectedOption: {
    label: string;
    value: any;
  };
  handleRemoveSelectedOption: (id: string) => void;
}) => {
  const [isHovering, setIsHovered] = useState(false);

  const onMouseEnter = () => setIsHovered(true);
  const onMouseLeave = () => setIsHovered(false);
  return (
    <div
      key={selectedOption.label}
      style={{
        display: 'flex',
        minWidth: '0px',
        backgroundColor: colors.maryRose,
        borderRadius: '6px',
        margin: '2px',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          borderRadius: '2px',
          color: colors.ottomanRed,
          fontSize: '12px',
          padding: '3px 3px 3px 6px',
          boxSizing: 'border-box',
          fontWeight: 'bold'
        }}
      >
        {selectedOption.label}
      </div>
      <div
        role="button"
        aria-label={selectedOption.label}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          alignItems: 'center',
          display: 'flex',
          borderRadius: '2px',
          paddingLeft: '4px',
          paddingRight: '4px',
          boxSizing: 'border-box',
          backgroundColor: isHovering ? colors.ottomanRed : colors.maryRose
        }}
        onClick={() => {
          handleRemoveSelectedOption(
            typeof selectedOption.value === 'string'
              ? selectedOption.value
              : selectedOption.value.id
          );
        }}
      >
        <svg
          height="14"
          width="14"
          viewBox="0 0 20 20"
          aria-hidden="true"
          focusable="false"
          fill={isHovering ? colors.white : colors.ottomanRed}
          stroke={isHovering ? colors.white : colors.ottomanRed}
          strokeWidth={0}
        >
          <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
        </svg>
      </div>
    </div>
  );
};

const CustomValueContainer = (
  { placeholderTarget }: { placeholderTarget: string },
  props: ValueContainerProps,
  selectedOption: any,
  handleRemoveSelectedOption: (id: string) => void,
  required?: boolean,
  type?: 'input' | 'filter',
  tooltipLabel?: string | ReactNode
) => {
  const values = selectedOption.map((val: any) => val.label);
  return (
    <ValueContainer {...props}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Placeholder
          {...(props as PlaceholderProps)}
          isFocused={(props as PlaceholderProps).isFocused}
        >
          <Text variant="captionRegular" color={colors.tarnishedSilver}>
            <div style={{ display: 'flex' }}>
              {props.selectProps.name}
              {required ? <div style={{ color: 'red', fontSize: '12px' }}>*</div> : ''}
              {tooltipLabel && (
                <Tooltip
                  label={tooltipLabel}
                  placement="right"
                  hasArrow
                  bg="black"
                  color="white"
                  left={'4px'}
                  padding={'10px'}
                  rounded={'6px'}
                  zIndex={9999999}
                  cursor={'pointer'}
                  maxW="500px"
                >
                  <Flex
                    _hover={{ bgColor: 'none' }}
                    _focus={{ outline: 'none' }}
                    bgColor={'transparent'}
                    marginLeft={'4px'}
                  >
                    <Info width={16} height={16} fill={colors.tarnishedSilver} isLine />
                  </Flex>
                </Tooltip>
              )}
            </div>
          </Text>
          <Text variant="bodySmallRegular" color={colors.silverCharm}>
            {selectedOption.length === 0 && placeholderTarget}
          </Text>
        </Placeholder>
        <Box
          paddingTop={props.selectProps.name === '' ? '12px' : '32px'}
          width="auto"
          flexFlow="wrap"
          display="inline-flex"
        >
          {type === 'filter' ? (
            <Text variant="paragraphSmallRegular" color={colors.tarnishedSilver}>
              {values.join(', ')}
            </Text>
          ) : (
            selectedOption.map(
              (
                selectedOption: {
                  label: string;
                  value: any;
                },
                idx: number
              ) => (
                <SelectedOptionComponent
                  key={selectedOption.label}
                  selectedOption={selectedOption}
                  handleRemoveSelectedOption={handleRemoveSelectedOption}
                />
              )
            )
          )}
        </Box>
      </div>
    </ValueContainer>
  );
};

const CustomControl = (props: any, onClick: () => void) => {
  return (
    <components.Control {...props}>
      <Flex width={'100%'} onClick={onClick} alignItems={'center'}>
        {Children.map(props.children, (child) =>
          child && (child as ReactElement).type !== Placeholder ? child : null
        )}
      </Flex>
    </components.Control>
  );
};

const CustomMenuList = ({ selectProps, ...props }: any) => {
  const { onInputChange, inputValue, placeholder } = selectProps;
  const [val, setVal] = useState(inputValue);

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 2,
        boxShadow: '0px 8px 16px 0px rgba(20, 23, 26, 0.16)',
        borderRadius: '8px',
        maxHeight: '300px',
        overflowY: 'scroll'
      }}
    >
      <Stack spacing={4} padding={'12px'} pos={'sticky'} top={0} backgroundColor={'white'}>
        <InputGroup alignItems={'center'}>
          <InputLeftElement pointerEvents="none" top={'x'}>
            <Search />
          </InputLeftElement>
          <Input
            placeholder={placeholder}
            size={'lg'}
            borderRadius={'8px'}
            outline={'2px solid #F2F4F6'}
            fontSize={'14px'}
            value={val}
            onChange={(e) => {
              setVal(e.currentTarget.value);
              onInputChange(e.currentTarget.value, {
                action: 'input-change'
              });
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
            }}
            onBlur={(e) => {
              e.stopPropagation();
            }}
            variant="filled"
            _focus={{
              border: 'none'
            }}
            backgroundColor={'transparent'}
            style={{
              height: '30px',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
        </InputGroup>
      </Stack>
      {Children.map(props.children, (child) =>
        child && (child as ReactElement).type !== Placeholder ? child : null
      )}
      <Stack
        spacing={4}
        padding={'12px'}
        pos={'sticky'}
        bottom={0}
        backgroundColor={'white'}
        alignItems={'flex-end'}
      >
        <div
          className="flex"
          style={{
            gap: '10px'
          }}
        >
          <Button
            text="Reset"
            appearance="outline"
            onClick={() => {
              props.clearValue();
              onInputChange('cleared', {
                action: 'set-value'
              });
              onInputChange(val, {
                action: 'input-change'
              });
            }}
            style={{
              padding: '6px 16px',
              width: '60px',
              height: '30px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          />
          <Button
            text="Terapkan"
            onClick={() => {
              onInputChange('applied', {
                action: 'set-value'
              });
              onInputChange(val, {
                action: 'input-change'
              });
            }}
            style={{
              padding: '6px 16px',
              width: '90px',
              height: '30px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          />
        </div>
      </Stack>
    </div>
  );
};

const CustomOption = ({ selectProps, ...props }: any) => {
  return (
    <div
      style={{
        borderBottomWidth: '1px',
        borderBottomColor: colors.callaLily
      }}
    >
      <components.Option {...props}>
        <input type="checkbox" checked={props.isSelected} />
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

const CustomNoOptionsMessage = (
  { selectProps, ...props }: any,
  keyName: string,
  loading?: boolean
) => {
  return (
    <components.NoOptionsMessage {...props}>
      <Flex justifyContent={'center'} alignItems={'center'} padding={'12px'} direction={'column'}>
        {loading ? (
          <Text variant="paragraphSmallRegular" flexWrap={'wrap'} maxW={'208px'}>
            Sedang memuat.......
          </Text>
        ) : (
          <>
            <Empty width={68} height={68} fill="#F2F4F6" />
            <Text
              variant="paragraphSmallRegular"
              flexWrap={'wrap'}
              marginTop={'16px'}
              maxW={'208px'}
            >
              Data belum tersedia. Silakan buat data {keyName} terlebih dahulu.
            </Text>
          </>
        )}
      </Flex>
    </components.NoOptionsMessage>
  );
};

const CustomIndicatorContainer = (isOpen: boolean) => {
  return (
    <Flex alignItems="center" cursor={'pointer'}>
      {isOpen ? <ChevronUp fill={colors.silverCharm} /> : <ChevronDown fill={colors.silverCharm} />}
    </Flex>
  );
};

const formatGroupLabel = (data: any) => (
  <Text variant="headlineBold" color={colors.tarnishedSilver} textTransform={'uppercase'} mb="8px">
    {data.label}
  </Text>
);

const DropdownSearchMultipleSelect: FC<DropdownSearchMultipleProps> = ({
  options,
  selectedOption,
  setSelectedOption,
  name = '',
  placeholder = 'Select...',
  placeholderTarget = 'Select...',
  size = 'large',
  required,
  containerWidth,
  keyName,
  handleSearchOption,
  type = 'input',
  hideSelectOption = true,
  tooltipLabel,
  loading,
  loadOptions,
  customOption,
  isDisabled,
  closeMenuOnSelect = false,
  ...otherProps
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [tempSelected, setTempSelected] = useState<any>([]);
  const ref = useRef<HTMLInputElement>(null);
  useOutsideClick({
    ref,
    handler: () => setIsOpen(false)
  });
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isApplied) {
      setSelectedOption(tempSelected);
      setIsApplied(false);
      setIsOpen(false);
    }

    if (!isApplied && selectedOption.length !== 0) {
      setTempSelected(selectedOption);
    }
  }, [isApplied, selectedOption]);

  //handle clear option value when user click reset filter
  useEffect(() => {
    if (type === 'filter' && selectedOption.length === 0) {
      setTempSelected([]);
    }
  }, [selectedOption]);

  const handleRemoveSelectedOption = (id: string) => {
    setTempSelected((prevSelectedOptions: any) => {
      return prevSelectedOptions.filter((option: any) =>
        typeof option.value === 'string' ? option.value !== id : option.value.id !== id
      );
    });
    setSelectedOption((prevSelectedOptions: any) => {
      return prevSelectedOptions.filter((option: any) =>
        typeof option.value === 'string' ? option.value !== id : option.value.id !== id
      );
    });
    setIsOpen(false);
  };

  return (
    <>
      <div
        className={`inline-block relative w-full ${
          size === 'small' ? 'min-h-56px form-input-small' : 'min-h-56px form-input'
        }`}
        style={{
          width: containerWidth,
          cursor: isDisabled ? 'not-allowed' : 'default'
        }}
        ref={ref}
      >
        <Select
          name={name}
          placeholder={placeholder}
          defaultValue={selectedOption}
          value={tempSelected}
          onChange={setTempSelected}
          onInputChange={(val, action) => {
            if (action.action === 'input-change') {
              handleSearchOption && handleSearchOption(val);

              if (!isOpen && handleSearchOption) {
                setIsOpen(true);
                handleSearchOption('');
              }
            }

            if (action.action === 'set-value') {
              if (val === 'applied') {
                setIsApplied(true);
              } else if (val === 'cleared') {
                setIsApplied(false);
                setSelectedOption([]);
              }
            }
          }}
          styles={customStyles(size, selectedOption.length > 0)}
          options={options}
          isMulti
          backspaceRemovesValue={false}
          filterOption={() => true}
          components={{
            ValueContainer: (props) =>
              CustomValueContainer(
                { placeholderTarget: placeholderTarget },
                props,
                selectedOption,
                handleRemoveSelectedOption,
                required,
                type,
                tooltipLabel
              ),
            MenuList: CustomMenuList,
            Option: customOption ? customOption : CustomOption,
            NoOptionsMessage: (props) => CustomNoOptionsMessage(props, keyName || '', loadOptions),
            Control: (props) => CustomControl(props, toggleOpen),
            IndicatorsContainer: () => CustomIndicatorContainer(isOpen)
          }}
          onMenuOpen={() => setIsOpen(true)}
          onMenuClose={() => setIsOpen(false)}
          menuIsOpen={isOpen}
          formatGroupLabel={formatGroupLabel}
          closeMenuOnSelect={closeMenuOnSelect}
          closeMenuOnScroll={hideSelectOption}
          hideSelectedOptions={hideSelectOption}
          isDisabled={isDisabled}
          isClearable={false}
          {...otherProps}
        />
      </div>
    </>
  );
};

export default DropdownSearchMultipleSelect;
