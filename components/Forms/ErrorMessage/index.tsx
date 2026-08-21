import type { FC } from 'react';

import type { ErrorMessageProps } from './types';

const ErrorMessage: FC<ErrorMessageProps> = ({ text }) => {
  return <span className="block px-4 pt-1 text-size11 leading-13px text-ottoman_red">{text}</span>;
};

export default ErrorMessage;
