import type { FC } from 'react';
import type { FormTextareaProps } from './types';
import React from 'react';
import { Flex, Textarea } from '@chakra-ui/react';
import Text from 'components/Typography/Text';
import { colors } from 'styles/theme/constants';

const FormTextarea: FC<FormTextareaProps> = ({
  defaultValue,
  label,
  rows = 4,
  placeholder = 'Masukkan isi form...',
  disabled,
  value,
  maxLength,
  required,
  onChange,
  ...otherProps
}) => {
  return (
    <div>
      <Flex
        w="100%"
        borderRadius={'8px'}
        background={colors.flashWhite}
        flexDir={'column'}
        h="120px"
        paddingX={'16px'}
        paddingY={'8px'}
        style={otherProps.style}
      >
        <Text display={'flex'} variant="captionSmall" color={colors.tarnishedSilver}>
          {label}
          {required && <div style={{ color: 'red', fontSize: '12px' }}>*</div>}
        </Text>
        <Textarea
          _focus={{
            outline: 'none',
            border: 'none',
            boxShadow: 'none'
          }}
          width={'100%'}
          height={'100%'}
          value={value}
          onChange={onChange}
          border={'none'}
          name={label}
          placeholder={placeholder}
          padding={0}
          fontSize={'14px'}
          fontWeight={400}
          maxLength={maxLength}
        ></Textarea>
      </Flex>
      {maxLength && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <p
            style={{
              fontSize: '10px',
              fontWeight: 400,
              lineHeight: '140%',
              color: colors.silverCharm
            }}
          >
            {`${typeof value === 'string' ? (value ? value.length : 0) : 0}/${maxLength}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default FormTextarea;
