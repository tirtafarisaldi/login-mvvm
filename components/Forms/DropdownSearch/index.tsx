import { background, Box, Button, Flex, Tooltip, useOutsideClick } from '@chakra-ui/react';
import type { FC, ReactNode } from 'react';
import React, { useState } from 'react';
import Select, { components } from 'react-select';
import ChevronDown from 'components/Icon/ChevronDown';
import ChevronUp from 'components/Icon/ChevronUp';
import Search from 'components/Icon/Search';
import Text from 'components/Typography/Text';
import { colors } from 'styles/theme/constants';

import type { DropdownSearchProps } from './types';
import Close from 'components/Icon/Close';
import Empty from 'components/Icon/Empty';
import Info from 'components/Icon/Info';

const { ValueContainer, Placeholder } = components;

const customStyles = (size: string, isTopPlaceholder: boolean) => {
  const style = {
    menu: (provided: any) => ({
      ...provided,
      position: 'relative',
      marginTop: '0px',
      marginBottom: '0px',
      overflow: 'hidden',
      boxShadow: 'inset 0 1px 0 transparent'
    }),
    control: (provided: any) => ({
      ...provided,
      display: 'flex',
      height: size === 'small' ? '50px' : '56px',
      border: '0 !important',
      paddingLeft: '8px',
      width: '100%',
      borderRadius: 8,
      background: 'none',
      outline: `2px solid ${colors.flashWhite}`,
      flexDirection: 'row-reverse'
    }),
    input: (provided: any, state: any) => ({
      ...provided,
      display: 'block',
      width: '100%',
      fontSize: state.isFocused ? '16px !important' : '16px',
      lineHeight: size === 'small' ? '22px' : '24px',
      color: colors.darkWillow,
      background: 'none',
      border: '0',
      borderRadius: 8,
      borderColor: 'none',
      boxShadow: 'none',
      outline: state.isFocused ? 'none' : 'none',
      '&:after': {
        content: "''"
      },
      '&:focus': {
        fontSize: '16px !important'
      }
    }),
    singleValue: (provided: any) => ({
      ...provided,
      lineHeight: '24px',
      ...(isTopPlaceholder ? { paddingTop: '16px' } : {})
    }),
    container: (provided: any) => ({
      ...provided
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      height: '100%',
      overflow: 'visible'
    }),
    placeholder: (provided: any, state: any) => ({
      ...provided,
      ...(isTopPlaceholder
        ? {
            position: 'absolute',
            color:
              state.hasValue || state.selectProps.menuIsOpen || state.selectProps.inputValue
                ? colors.tarnishedSilver
                : colors.silverCharm,
            top:
              // eslint-disable-next-line no-nested-ternary
              state.hasValue || state.selectProps.menuIsOpen || state.selectProps.inputValue
                ? size === 'small'
                  ? '6px'
                  : '8px'
                : undefined,
            transition: 'top 0.1s, font-size 0.1s',
            fontSize:
              // eslint-disable-next-line no-nested-ternary
              state.hasValue || state.selectProps.menuIsOpen || state.selectProps.inputValue
                ? 11
                : size === 'small'
                ? 14
                : 16
          }
        : {
            color: colors.silverCharm,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          })
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      display: 'none'
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
      cursor: state.isDisabled ? 'not-allowed' : 'default',
      padding: '12px 16px 12px 16px'
    })
  };

  return style;
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

const DropdownSearch: FC<DropdownSearchProps> = ({
  options,
  selectedOption,
  setSelectedOption,
  name = '',
  placeholder = '',
  placeholderTarget,
  size,
  isTopPlaceholder = false,
  optionContainerWidth,
  optionContainerPosition,
  containerWidth,
  isClearable,
  isDisabled,
  required,
  keyName,
  handleSearchOption,
  searchOption,
  tooltipLabel,
  loading,
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

  const Menu = (props: any) => {
    return (
      <Box
        position="absolute"
        bgColor="white"
        borderRadius="8px"
        zIndex={2}
        boxShadow={`0px 8px 16px 0px rgba(20, 23, 26, 0.16)`}
        width={optionContainerWidth || '100%'}
      >
        {props.children}
      </Box>
    );
  };

  const Dropdown = ({
    children,
    isOpenDropdown,
    target
  }: {
    children: ReactNode;
    isOpenDropdown: boolean;
    target: ReactNode;
  }) => (
    <Box position="relative" width={containerWidth || '100%'} ref={ref}>
      {target}
      {isOpenDropdown ? <Menu>{children}</Menu> : null}
    </Box>
  );

  const CustomDropdownIndicator = () => (
    <Box>
      <Search />
    </Box>
  );

  const CustomControl = (props: any) => (
    <Box width={'100%'} padding="12px">
      <Flex
        outline={`2px solid ${colors.flashWhite}`}
        width={'100%'}
        borderRadius={'8px'}
        padding="8px"
        flexDirection="row-reverse"
      >
        {props.children}
      </Flex>
    </Box>
  );

  const filterOption = (option: any, inputValue: string): boolean =>
    (option.label.toString().toLowerCase().match(inputValue.toLocaleLowerCase()) || []).length > 0;

  return (
    <>
      <Dropdown
        isOpenDropdown={isOpen}
        target={
          <Button
            onClick={toggleOpen}
            cursor="pointer"
            alignItems="center"
            justifyContent="space-between"
            gap="12px"
            backgroundColor={colors.flashWhite}
            borderRadius="8px"
            paddingX="16px"
            paddingY={name ? '8px' : '12px'}
            flexWrap="wrap"
            width={containerWidth}
            display={'flex'}
            w="100%"
            h="auto"
            disabled={isDisabled}
            _hover={{ bgColor: 'none' }}
            _focus={{ bgColor: 'none', outline: 'none', boxShadow: 'none' }}
            _pressed={{ bgColor: 'none' }}
          >
            <Box
              display="flex"
              flexDir={'column'}
              flex="1 1 0%"
              flex-wrap="wrap"
              position="relative"
              overflow="visible"
              boxSizing="border-box"
              height="100%"
              alignItems={'baseline'}
            >
              <Text variant="captionRegular" color={colors.tarnishedSilver}>
                <div style={{ display: 'flex' }}>
                  {name}
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
              <Text
                variant="bodySmallRegular"
                color={selectedOption?.label ? colors.bastille : colors.silverCharm}
              >
                {selectedOption?.label || placeholderTarget}
              </Text>
            </Box>
            {selectedOption?.label && isClearable && (
              <Close
                onClick={() => {
                  setSelectedOption(undefined);
                }}
              />
            )}
            <Flex alignItems="center">
              {isOpen ? (
                <ChevronUp fill={colors.silverCharm} />
              ) : (
                <ChevronDown fill={colors.silverCharm} />
              )}
            </Flex>
          </Button>
        }
      >
        <div
          className={`inline-block relative w-full ${
            size === 'small' ? 'h-50px form-input-small' : 'h-56px form-input'
          }`}
        >
          <Select
            filterOption={filterOption}
            menuIsOpen
            autoFocus
            backspaceRemovesValue={false}
            controlShouldRenderValue={false}
            hideSelectedOptions={false}
            isClearable={false}
            tabSelectsValue={false}
            name={name}
            placeholder={
              <Text variant="paragraphSmallRegular" color={colors.silverCharm}>
                {placeholder}
              </Text>
            }
            value={selectedOption}
            onChange={(newValue) => {
              toggleOpen();
              setSelectedOption(newValue);
            }}
            onInputChange={(val) => {
              handleSearchOption && handleSearchOption(val);
            }}
            inputValue={searchOption}
            styles={customStyles(size as string, isTopPlaceholder)}
            options={options}
            components={{
              Control: (props) => CustomControl(props),
              DropdownIndicator: CustomDropdownIndicator,
              NoOptionsMessage: (props) => CustomNoOptionsMessage(props, keyName || '', loading)
            }}
            {...otherProps}
          />
        </div>
      </Dropdown>
    </>
  );
};

export default DropdownSearch;
