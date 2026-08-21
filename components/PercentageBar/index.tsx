import type { FC } from 'react';
import type { PercentageBarProps } from './types';

const PercentageBar: FC<PercentageBarProps> = ({
  label = '',
  color = 'green',
  currentData = 0,
  totalData = 0,
  currentDataLabel
}) => {
  const getPercentage = () => {
    const percentage = (parseInt(currentData.toString()) / parseInt(totalData.toString())) * 100;

    return percentage.toFixed(2).toString() + '%';
  };

  const numberWithDotFormat = (currentData: PercentageBarProps['currentData']) => {
    return currentData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const getBarColor = () => {
    let bgColor = 'bg-grass_court';

    switch (color) {
      case 'red':
        bgColor = 'bg-ottoman_red';
        break;
      case 'green':
        bgColor = 'bg-grass_court';
        break;
      case 'blue':
        bgColor = 'bg-deep_skyblue';
        break;
      case 'orange':
        bgColor = 'bg-squash';
        break;
      case 'black':
        bgColor = 'bg-black_lead';
        break;
      default:
        bgColor = 'bg-grass_court';
        break;
    }

    return bgColor;
  };

  return (
    <>
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-size14 leading-17px text-tarnished_silver">{label}</span>
          <span className="text-size14 leading-22px font-bold text-dark_willow">
            {currentDataLabel
              ? numberWithDotFormat(currentDataLabel)
              : numberWithDotFormat(currentData)}
          </span>
        </div>
        <div className="block w-full">
          <div className="relative rounded h-1 p-0 bg-flash_white">
            <span
              className={`block relative overflow-hidden rounded h-1 ${getBarColor()}`}
              style={{ width: getPercentage() }}
            ></span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PercentageBar;
