import type { FC } from 'react';
import type { UserPaginationProps } from './types';
import { number } from 'utility/number';

const UserPagination: FC<UserPaginationProps> = ({ page, event, hidden, pageName }) => {
  const renderPages = () => {
    var pages = [];
    var endPage = page.total > 5 ? 5 : page.total;
    var startPage = 1;

    var lastPageListCount = page.total_data % 10 == 0 ? 10 : page.total_data % 10;
    page.total_last_page_data = lastPageListCount;

    // previous button
    pages.push(
      <button
        key={pageName + '_previous'}
        disabled={page.current == 1}
        onClick={() => event(page.current - 1)}
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
          onClick={() => event(1)}
          key={pageName + '_0'}
          className={
            'text-gray-500 bg-white border border-gray-300 first:ml-0 text-xs font-semibold md:flex min-w-8 h-8 px-2 md:items-center md:justify-center inline-block leading-tight rounded-lg focus:outline-none'
          }
        >
          {1}
        </button>
      );
      pages.push(
        <button
          key={pageName + '_2'}
          className="text-gray-500 bg-white border border-gray-300 first:ml-0 text-xs font-semibold md:flex w-8 h-8 p-0 md:items-center md:justify-center inline-block leading-tight rounded-lg focus:outline-none"
        >
          ...
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          onClick={() => event(i)}
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
          onClick={() => event(page.total)}
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
        onClick={() => event(page.current + 1)}
        className="first:ml-0 text-xs font-semibold md:flex w-8 h-8 md:items-center md:justify-center inline-block leading-tight bg-white border border-gray-300 rounded-lg focus:outline-none disabled:opacity-50"
      >
        <i className="text-gray-500 fas fa-chevron-right -ml-px"></i>
      </button>
    );

    return <>{pages}</>;
  };

  return (
    <>
      <div hidden={hidden} className="py-2 lg:flex lg:justify-between space-x-1 block">
        <div className="md:flex md:items-center block text-sm text-gray-500 lg:mb-0 mb-2">
          <div className="mr-2 md:mb-0 mb-2">Showing</div>
          <div className="md:flex md:flex-wrap md:items-center md:justify-center block">
            <div className="bg-red-200 text-red-600 mr-2 rounded-md px-3 py-1 max-w-max min-w-75px inline-block">
              {page.total_data == 0
                ? 0
                : page.current < page.total
                ? '1 - 10'
                : '1 - ' + (page.total_last_page_data ? page.total_last_page_data : '')}
              <i className="ml-2 text-xs fas fa-chevron-down"></i>
            </div>
            <div className="inline-block">
              of <span className="font-bold">{number(page.total_data)}</span> users
            </div>
          </div>
        </div>
        <nav className="flex">
          <ul className="md:flex md:flex-wrap space-x-0.5 md:space-y-0 space-y-0.5 list-none">
            {renderPages()}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default UserPagination;
