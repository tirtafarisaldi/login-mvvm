import { IconButton as ChakraUiIconButton } from '@chakra-ui/react';
import type { IconButtonProps } from './types';
import type { FC } from 'react';

const IconButton: FC<IconButtonProps> = ({ dimension = 40, variant = 'ghost', ...props }) => {
  const unit = `${dimension}px`;
  return (
    <ChakraUiIconButton
      width={unit}
      height={unit}
      minWidth={unit}
      borderRadius={unit}
      variant={variant}
      _focus={{
        outline: 'none'
      }}
      {...props}
    />
  );
};

export default IconButton;
