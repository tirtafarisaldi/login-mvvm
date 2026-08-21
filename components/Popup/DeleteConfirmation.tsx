import { Modal, ModalBody, ModalFooter } from 'components/Modal';
import React, { useState, useEffect, ReactNode } from 'react';
import Text from 'components/Typography/Text';
import { colors } from 'styles/theme/constants';
import { Button } from 'components/Button';
import { useDisclosure } from '@chakra-ui/react';
import Image from 'next/image';

const DeleteConfirmation = ({
  isOpen,
  onClose,
  handleDeleteSubmition,
  nameData
}: {
  isOpen: boolean;
  onClose: () => void;
  handleDeleteSubmition: () => void;
  nameData: string;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      scrollBehavior={'inside'}
      isCentered
      width={'375px'}
    >
      <ModalBody>
        <div className="w-253 flex justify-center">
          <Image
            src="/assets/images/delete-illustration.png"
            width="253"
            height="138"
            alt="home-breadcrumb"
            unoptimized
          />
        </div>
        <Text variant="headingLargeBlack" color={colors.darkWillow} mb="8px" mt="8px">
          Yakin ingin menghapus data?
        </Text>
        <Text variant="bodySmallRegular" color={colors.tarnishedSilver}>
          Seluruh data {nameData} akan terhapus dan tidak bisa dikembalikan lagi.
        </Text>
        <div className="flex mt-6 gap-2 w-full justify-ce">
          <Button
            onClick={onClose}
            text="Tidak, Kembali"
            appearance="outline"
            size="large"
            mergeClass="w-auto"
            style={{
              width: '158px',
              height: '48px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          />
          <Button
            onClick={() => {
              handleDeleteSubmition();
              onClose();
            }}
            text="Ya, Hapus"
            size="large"
            type="submit"
            mergeClass="w-auto"
            style={{
              width: '158px',
              height: '48px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          />
        </div>
      </ModalBody>
    </Modal>
  );
};

export default DeleteConfirmation;
