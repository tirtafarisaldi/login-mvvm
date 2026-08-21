import type { FC } from 'react';
import type { TabProps, TabItem } from './types';
import Link from 'next/link';
import { Box } from '@chakra-ui/react';

const Tab: FC<TabProps> = ({ type, items, isBordered = true, ...props }) => {
  const getTabWrapperClass = () => {
    switch (type) {
      case 'line':
        return `gap-6 ${isBordered ? 'border-b border-calla_lily' : ''}`;
      default:
        return 'gap-4';
    }
  };

  const getItemClassName = (item: TabItem) => {
    let className = '';
    switch (type) {
      case 'line':
        className = 'text-size16 leading-24px px-3 py-0.5';
        break;
      case 'rounded':
        className = 'font-bold text-size12 leading-19px px-4 py-1.5 rounded-full';
        break;
      default:
        break;
    }

    if (type === 'line' && item?.isActive) {
      className += ' text-dark_willow font-bold border-b-2 border-dark_willow';
    } else if (type === 'line' && !item?.isActive) {
      className += ' text-silver_charm';
    } else if (type === 'rounded' && item?.isActive) {
      className += ' text-white bg-dark_willow border border-dark_willow';
    } else if (type === 'rounded' && !item?.isActive) {
      className += ' text-silver_charm bg-transparent border border-silver_charm';
    }

    return className;
  };

  return (
    <Box {...props}>
      <div className={`flex flex-wrap ${getTabWrapperClass()}`}>
        {items.map((item, index) => {
          return !item.isActive && item.url ? (
            <Link key={index} href={item.url} passHref>
              <a>
                <div className={getItemClassName(item)}>{item?.title}</div>
              </a>
            </Link>
          ) : (
            <div key={index}>
              <div className={getItemClassName(item)}>{item?.title}</div>
            </div>
          );
        })}
      </div>
    </Box>
  );
};

export default Tab;
