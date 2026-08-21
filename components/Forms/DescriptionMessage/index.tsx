import type { FC } from 'react';

import type { DesctiptionMessageProps } from './types';

const DesctiptionMessage: FC<DesctiptionMessageProps> = ({ text }) => {
  return (
    <span className="block px-4 pt-1 text-size11 leading-13px text-tarnished_silver">{text}</span>
  );
};

export default DesctiptionMessage;
