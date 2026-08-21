import type { FC } from 'react';
import type { PlusMinusNumberProps } from './types';
import Text from 'components/Typography/Text';
import { number } from 'utility/number';

const PlusMinusNumber: FC<PlusMinusNumberProps> = ({ symbol, amount }) => {
  const getClassName = () => {
    let className = '';

    switch (symbol) {
      case 'out':
        className = 'text-ottoman_red';
        break;
      case 'in':
        className = 'text-grass_court';
        break;
      default:
        className += 'text-black_lead';
        break;
    }

    return className;
  };

  const getSign = () => {
    let sign = '';

    switch (symbol) {
      case 'out':
        sign = '-';
        break;
      case 'in':
        sign = '+';
        break;
      default:
        break;
    }

    return sign;
  };

  return (
    <>
      <Text variant="bodySmallBold" as="div">
        <div className={getClassName()}>
          {getSign()}
          {number(amount)}
        </div>
      </Text>
    </>
  );
};

export default PlusMinusNumber;
