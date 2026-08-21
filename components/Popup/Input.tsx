import { Modal, ModalBody, ModalFooter } from 'components/Modal';
import React, { useState, useEffect, ReactNode } from 'react';
import Text from 'components/Typography/Text';
import { colors } from 'styles/theme/constants';
import { Button } from 'components/Button';
import { Divider, Flex, useDisclosure } from '@chakra-ui/react';
import Image from 'next/image';
import FormInput from 'components/Forms/FormInput';
import Close from 'components/Icon/Close';
import ErrorMessage from 'components/Forms/ErrorMessage';

const Input = ({
  isOpen,
  onClose,
  handleSave,
  handleChange,
  value,
  label,
  placeholder,
  name,
  error,
  loading
}: {
  isOpen: boolean;
  onClose: () => void;
  handleSave: () => void;
  handleChange: (value: number) => void;
  value?: number;
  label: string;
  placeholder: string;
  name: string;
  error?: string;
  loading?: boolean;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      scrollBehavior={'inside'}
      isCentered
      width={'480px'}
    >
      <Flex
        h="fit-content"
        justify={'center'}
        align={'center'}
        background={colors.white}
        borderRadius={'100%'}
        position={'absolute'}
        top={'-40px'}
        right={0}
        cursor={'pointer'}
        onClick={onClose}
      >
        <Close width={24} height={24} fill={colors.blackLead} />
      </Flex>
      <ModalBody padding={'24px'}>
        <Text variant="headingMediumBlack">{label}</Text>
        <Divider my={'16px'} />
        <div className="mb-5">
          <FormInput
            type={'number'}
            size="small"
            label={name}
            name={''}
            placeholder={placeholder}
            value={value}
            onChange={(val: string) => {
              handleChange(parseInt(val));
            }}
            onKeyDown={(evt) => ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()}
            maxLength={15}
            showMaxLength={false}
            required
          />

          {error ? <ErrorMessage text={error} /> : ''}
        </div>
        <Button
          onClick={() => {
            handleSave();
          }}
          text={
            loading ? (
              <div className="flex space-x-2 justify-center items-center bg-transparent dark:invert">
                <div className="h-1 w-1 bg-white rounded-full animate-bounce [animation-delay:-0.1s]"></div>
                <div className="h-1 w-1 bg-white rounded-full animate-bounce [animation-delay:-0.05s]"></div>
                <div className="h-1 w-1 bg-white rounded-full animate-bounce"></div>
              </div>
            ) : (
              'Simpan'
            )
          }
          size="large"
          type="submit"
          mergeClass="w-auto"
          disabled={!value}
          style={{
            width: '100%',
            height: '48px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        />
      </ModalBody>
    </Modal>
  );
};

export default Input;
