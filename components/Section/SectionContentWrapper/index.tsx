import type { FC } from 'react';
import type { SectionContentWrapperProps } from './types';

const SectionContentWrapper: FC<SectionContentWrapperProps> = ({
  children,
  mergeClass,
  ...otherProps
}) => {
  return (
    <div
      {...otherProps}
      className={'bg-white py-6 rounded-lg' + (mergeClass ? ` ${mergeClass}` : '')}
    >
      {children}
    </div>
  );
};

export default SectionContentWrapper;
