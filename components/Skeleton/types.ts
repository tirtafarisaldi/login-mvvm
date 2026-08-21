import { SkeletonProps as ChakraUiSkeletonProps } from '@chakra-ui/react';

export interface SkeletonProps extends ChakraUiSkeletonProps {
  variant?: 'circle' | 'default';
}
