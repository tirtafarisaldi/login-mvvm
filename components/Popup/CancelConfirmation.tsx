import { Modal, ModalBody, ModalFooter } from 'components/Modal';
import React, { useState, useEffect, ReactNode } from 'react';
import Text from 'components/Typography/Text';
import { colors } from 'styles/theme/constants';
import { Button } from 'components/Button';
import Image from 'next/image';

const CancelConfirmation = ({
  isOpen,
  onClose,
  handleCancel,
  loading
}: {
  isOpen: boolean;
  onClose: () => void;
  handleCancel: () => void;
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
      width={'375px'}
    >
      <ModalBody>
        <div className="w-253 flex justify-center">
          <Image
            src="/assets/images/cancel-illustration.png"
            width="253"
            height="138"
            alt="home-breadcrumb"
            unoptimized
          />
        </div>
        <Text variant="headingLargeBlack" color={colors.darkWillow} mb="8px" mt="8px">
          Yakin ingin batalkan menu campaign berjalan?
        </Text>
        <Text variant="bodySmallRegular" color={colors.tarnishedSilver}>
          Menu campaign tidak bisa diaktifkan lagi dan kamu harus mulai dari awal.
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
              handleCancel();
            }}
            text={
              loading ? (
                <div className="flex space-x-2 justify-center items-center bg-transparent dark:invert">
                  <div className="h-1 w-1 bg-white rounded-full animate-bounce [animation-delay:-0.1s]"></div>
                  <div className="h-1 w-1 bg-white rounded-full animate-bounce [animation-delay:-0.05s]"></div>
                  <div className="h-1 w-1 bg-white rounded-full animate-bounce"></div>
                </div>
              ) : (
                'Ya, Batal'
              )
            }
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

export default CancelConfirmation;
