import type { FC } from 'react';
import type { TableSkeletonProps } from './types';

const TableSkeleton: FC<TableSkeletonProps> = ({ totalRow = 10, totalColumn = 4 }) => {
  return (
    <>
      {[...Array(totalRow)].map((_e, i) => {
        return (
          <tr key={i}>
            {[...Array(totalColumn)].map((_e, i) => {
              return (
                <td key={i} className="border-t-0 px-8 align-middle border-l-0 border-r-0 py-4">
                  <div className="h-5 bg-gray-300 rounded-lg animate-pulse"></div>
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
};

export default TableSkeleton;
