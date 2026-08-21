import { Modal, ModalBody, ModalFooter } from 'components/Modal';
import React, {
  useState,
  useEffect,
  ReactNode,
  useCallback,
  Dispatch,
  SetStateAction
} from 'react';
import Text from 'components/Typography/Text';
import { colors } from 'styles/theme/constants';
import { Button } from 'components/Button';
import { useDisclosure } from '@chakra-ui/react';
import Image from 'next/image';

const ErrorServer = ({
  error,
  setError
}: {
  error: boolean;
  setError?: Dispatch<SetStateAction<boolean>>;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClosePopup = useCallback(() => {
    onClose();
    setError && setError(false);
  }, [onClose, setError]);

  useEffect(() => {
    if (error) {
      onOpen();
    }
    setError && setError(false);
  }, [error, onOpen, setError]);

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
            src="/assets/images/error-server-illustration.png"
            width="253"
            height="138"
            alt="server-error"
            unoptimized
          />
        </div>
        <Text variant="headingLargeBlack" color={colors.darkWillow} mb="8px" mt="8px">
          Maaf, ada sedikit kesalahan teknis
        </Text>
        <Text variant="bodySmallRegular" color={colors.tarnishedSilver}>
          Muat ulang halaman ini untuk melanjutkan.
        </Text>
        <div className="flex mt-6 gap-2 w-full justify-ce">
          <Button
            onClick={onClose}
            text="Kembali"
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
              if (typeof window !== 'undefined') {
                window.location.reload();
              }
              onClose();
            }}
            text="Muat Ulang"
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

export default ErrorServer;
