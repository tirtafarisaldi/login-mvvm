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

const CustomPopup = ({
  title,
  description,
  img,
  isError,
  setError
}: {
  title: string;
  description: string;
  img: string;
  isError: boolean;
  setError?: Dispatch<SetStateAction<boolean>>;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClosePopup = useCallback(() => {
    onClose();
    setError && setError(false);
  }, [onClose, setError]);

  useEffect(() => {
    if (isError) {
      onOpen();
    }
    setError && setError(false);
  }, [isError, onOpen, setError]);

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
          <Image src={img} width="253" height="138" alt="error-popup" unoptimized />
        </div>
        <Text variant="headingLargeBlack" color={colors.darkWillow} mb="8px" mt="8px">
          {title}
        </Text>
        <Text variant="bodySmallRegular" color={colors.tarnishedSilver}>
          {description}
        </Text>
        <Button
          onClick={handleClosePopup}
          text="Baik, Mengerti"
          size="large"
          mergeClass="w-auto"
          style={{
            width: '100%',
            height: '48px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '24px'
          }}
        />
      </ModalBody>
    </Modal>
  );
};

export default CustomPopup;
