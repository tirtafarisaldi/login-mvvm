import type { FC } from 'react';
import type { PaginationProps } from './types';
import { number } from 'utility/number';
import { useState, useEffect } from 'react';

const Pagination: FC<PaginationProps> = ({ page, rowCount, event, hidden, pageName, dataName }) => {
  const [lastPageListCount, setLastPageListCount] = useState<number | undefined>();

  const renderPages = () => {
    const pages = [];
    let endPage = page.total > 5 ? 5 : page.total;
    let startPage = 1;

    // previous button
    pages.push(
      <button
        key={pageName + '_previous'}
        disabled={page.current == 1}
        onClick={() => (event ? event(page.current - 1) : undefined)}
        className="first:ml-0 text-xs font-semibold md:flex w-8 h-8 md:items-center md:justify-center inline-block leading-tight bg-white border border-gray-300 rounded-lg focus:outline-none disabled:opacity-50"
      >
        <i className="text-gray-500 fas fa-chevron-left -ml-px"></i>
      </button>
    );

    if (page.current > 4 && page.total > 5) {
      startPage = page.total - 4;
      endPage = page.total;

      if (page.current + 2 < page.total) {
        startPage = page.current - 1;
        endPage = page.current + 1;
      }

      pages.push(
        <button
          onClick={() => (event ? event(1) : undefined)}
          key={pageName + '_0'}
          className={
            'text-gray-500 bg-white border border-gray-300 first:ml-0 text-xs font-semibold md:flex min-w-8 h-8 px-2 md:items-center md:justify-center inline-block leading-tight rounded-lg focus:outline-none'
          }
        >
          {1}
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          onClick={() => (event ? event(i) : undefined)}
          key={pageName + '_' + i}
          className={
            (i == page.current
              ? 'text-red-600 bg-red-200 '
              : 'text-gray-500 bg-white border border-gray-300') +
            'first:ml-0 text-xs font-semibold md:flex min-w-8 h-8 px-2 md:items-center md:justify-center inline-block leading-tight rounded-lg focus:outline-none'
          }
        >
          {i}
        </button>
      );
    }

    if (page.total > 5 && page.current + 2 < page.total) {
      if (page.current + 1 < page.total) {
        pages.push(
          <button
            key={pageName + '_' + page.total + 1}
            className="text-gray-500 bg-white border border-gray-300 first:ml-0 text-xs font-semibold md:flex w-8 h-8 p-0 md:items-center md:justify-center inline-block leading-tight rounded-lg focus:outline-none"
          >
            ...
          </button>
        );
      }
      pages.push(
        <button
          onClick={() => (event ? event(page.total) : undefined)}
          key={pageName + '_' + page.total}
          className="text-gray-500 bg-white border border-gray-300 first:ml-0 text-xs font-semibold md:flex min-w-8 h-8 px-2 md:items-center md:justify-center inline-block leading-tight rounded-lg focus:outline-none"
        >
          {number(page.total)}
        </button>
      );
    }

    //button next
    pages.push(
      <button
        key={pageName + '_next'}
        disabled={page.current == page.total || page.total == 0}
        onClick={() => (event ? event(page.current + 1) : undefined)}
        className="first:ml-0 text-xs font-semibold md:flex w-8 h-8 md:items-center md:justify-center inline-block leading-tight bg-white border border-gray-300 rounded-lg focus:outline-none disabled:opacity-50"
      >
        <i className="text-gray-500 fas fa-chevron-right -ml-px"></i>
      </button>
    );

    return <>{pages}</>;
  };

  useEffect(() => {
    const mod = page.total_data % 10;
    setLastPageListCount(mod > 0 ? mod : 10);
  }, [page.total_data]);

  return (
    <>
      <div hidden={hidden} className="py-2 lg:flex lg:justify-between space-x-1 block">
        <>
          {page?.total_data && (
            <div className="md:flex md:items-center block text-sm text-gray-500 lg:mb-0 mb-2">
              <div className="mr-2 md:mb-0 mb-2">Showing</div>
              <div className="md:flex md:flex-wrap md:items-center md:justify-center block">
                <div className="bg-red-200 text-red-600 mr-2 rounded-md px-3 py-1 max-w-max inline-block">
                  {page.total_data == 0 ? 0 : `1 - ${rowCount ? rowCount : ''}`}
                  {/* <i className="ml-2 text-xs fas fa-chevron-down"></i> */}
                </div>
                <div className="inline-block">
                  of <span className="font-bold">{number(page.total_data)}</span>{' '}
                  {dataName || 'users'}
                </div>
              </div>
            </div>
          )}
          <nav className="flex">
            <ul className="md:flex md:flex-wrap space-x-0.5 md:space-y-0 space-y-0.5 list-none">
              {renderPages()}
            </ul>
          </nav>
        </>
      </div>
    </>
  );
};

export default Pagination;
