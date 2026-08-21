import type { FC } from 'react';
import type { TableWrapperProps } from './types';

const TableWrapper: FC<TableWrapperProps> = ({ children }) => {
  return (
    <>
      <div className="block w-full overflow-hidden bg-white">{children}</div>
    </>
  );
};

export default TableWrapper;
