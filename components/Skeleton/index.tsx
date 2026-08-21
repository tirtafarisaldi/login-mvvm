import type { FC } from 'react';
import type { SkeletonProps } from './types';
import { Skeleton as ChakaraUiSkeleton, SkeletonCircle } from '@chakra-ui/react';
import { When } from 'react-if';

import { colors } from 'styles/theme/constants';

const Skeleton: FC<SkeletonProps> = ({ variant = 'default', ...props }) => {
  return (
    <>
      <When condition={variant === 'circle'}>
        <SkeletonCircle startColor={colors.flashWhite} endColor={colors.callaLily} {...props} />
      </When>
      <When condition={variant === 'default'}>
        <ChakaraUiSkeleton startColor={colors.flashWhite} endColor={colors.callaLily} {...props} />
      </When>
    </>
  );
};

export default Skeleton;
