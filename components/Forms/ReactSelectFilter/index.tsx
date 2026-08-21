import type { FC, ReactNode } from 'react';
import type { ReactSelectFilterProps } from './types';
import type { Size } from 'common-types';
import { Children, ReactElement, useRef, useState } from 'react';
import Select, { components } from 'react-select';
import type { IndicatorsContainerProps, PlaceholderProps, ValueContainerProps } from 'react-select';
import { colors } from 'styles/theme/constants';
import { Flex, Tooltip, useOutsideClick } from '@chakra-ui/react';
import ChevronUp from 'components/Icon/ChevronUp';
import ChevronDown from 'components/Icon/ChevronDown';
import Close from 'components/Icon/Close';
import Text from 'components/Typography/Text';
import React from 'react';
import Info from 'components/Icon/Info';

const { ValueContainer, Placeholder } = components;

const customStyles = (size: Size) => {
  const style = {
    control: (provided: any, state: any) => ({
      ...provided,
      height: '56px',
      border: '0 !important',
      paddingLeft: '8px',
      width: '100%',
      borderRadius: 8,
      background: state.isDisabled ? colors.callaLily : '#F2F4F6',
      cursor: state.isDisabled ? 'not-allowed' : 'pointer',
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
    singleValue: (provided: any, state: any) => ({
      ...provided,
      lineHeight: '24px',
      zIndex: 0,
      paddingTop: !state.selectProps.name ? '' : size === 'small' ? '16px' : '20px'
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
        state.hasValue ||
        state.selectProps.menuIsOpen ||
        state.selectProps.inputValue ||
        state.selectProps.name
          ? '#797D7F'
          : '#ADB1B4',
      top:
        state.hasValue ||
        state.selectProps.menuIsOpen ||
        state.selectProps.inputValue ||
        state.selectProps.name
          ? size === 'small'
            ? '6px'
            : '8px'
          : 'translate(50%, 50%)',
      transition: 'top 0.1s, font-size 0.1s',
      fontSize:
        state.hasValue ||
        state.selectProps.menuIsOpen ||
        state.selectProps.inputValue ||
        state.selectProps.name
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
      zIndex: 3
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      '&:hover': {
        backgroundColor: state.isFocused ? colors.maryRose : '#E5E9EC',
        color: state.isFocused ? colors.ottomanRed : '#14171A'
      },
      fontSize: '14px',
      fontWeight: '700',
      color: state.isSelected ? '#14171A' : state.isDisabled ? '' : '#14171A',
      backgroundColor: '#FFFFFF',
      cursor: state.isDisabled ? 'not-allowed' : 'default'
    })
  };

  return style;
};

const CustomValueContainer = (
  placeholder: any,
  { children, ...props }: ValueContainerProps,
  required?: boolean,
  tooltipLabel?: string | ReactNode
) => {
  return (
    <ValueContainer {...props}>
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
          {!props.hasValue && placeholder}
        </Text>
      </Placeholder>
      {Children.map(children, (child) =>
        child && (child as ReactElement).type !== Placeholder ? child : null
      )}
    </ValueContainer>
  );
};

const CustomIndicatorContainer = (
  isClearable: boolean,
  props: IndicatorsContainerProps,
  isClear?: boolean
) => {
  if (isClear) props.clearValue();
  return (
    <Flex paddingRight={'16px'} cursor={'pointer'}>
      {isClearable && props.hasValue && (
        <Close
          onClick={() => {
            props.clearValue();
          }}
          fill={colors.silverCharm}
        />
      )}
      {props.selectProps.menuIsOpen ? (
        <ChevronUp fill={colors.silverCharm} />
      ) : (
        <ChevronDown fill={colors.silverCharm} />
      )}
    </Flex>
  );
};

const ReactSelectFilter: FC<ReactSelectFilterProps> = ({
  options,
  selectedOption,
  setSelectedOption,
  name,
  placeholder = 'Select...',
  size = 'large',
  containerWidth,
  isClearable,
  isClear,
  required,
  isDisabled,
  tooltipLabel,
  ...otherProps
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = React.useRef<HTMLInputElement>(null);
  useOutsideClick({
    ref,
    handler: () => setIsOpen(false)
  });

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <div
        className={`inline-block relative cursor-pointer ${containerWidth ? '' : 'w-full'} ${
          size === 'small' ? 'h-56px form-input-small' : 'h-56px form-input'
        }`}
        style={{
          width: containerWidth,
          cursor: isDisabled ? 'not-allowed' : 'pointer'
        }}
        onClick={isDisabled ? undefined : toggleOpen}
        ref={ref}
      >
        <Select
          isDisabled={isDisabled}
          autoFocus
          menuIsOpen={isOpen}
          instanceId={name}
          name={name}
          placeholder={placeholder}
          value={selectedOption?.label !== '' ? selectedOption : undefined}
          onChange={setSelectedOption}
          styles={customStyles(size)}
          options={options}
          openMenuOnFocus
          components={{
            ...(name
              ? {
                  ValueContainer: (props) =>
                    CustomValueContainer(placeholder, props, required, tooltipLabel)
                }
              : undefined),
            IndicatorsContainer: (props) =>
              CustomIndicatorContainer(isClearable || false, props, isClear)
          }}
          {...otherProps}
        />
      </div>
    </>
  );
};

export default ReactSelectFilter;
