import type { FC } from 'react';
import Link from 'next/link';
import { If, Else, Then } from 'react-if';
import type { ButtonLinkWithLogoProps } from './types';

const ButtonLinkWithLogo: FC<ButtonLinkWithLogoProps> = ({
  children,
  href,
  as,
  type,
  mergeClass,
  onClick,
  disabled,
  textColor
}) => {
  const getClassName = () => {
    let className =
      'inline-block font-poppins font-bold text-size14 leading-17px focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 transition-all';

    if (!textColor) {
      className += ' text-deep_skyblue hover:text-deep_skyblue_dark';
    } else {
      className += ` ${textColor}`;
    }

    if (mergeClass) {
      className += ` ${mergeClass}`;
    }

    return className;
  };

  return (
    <If condition={type === 'link'}>
      <Then>
        <Link href={href!} as={as}>
          <a className={getClassName()}>{children}</a>
        </Link>
      </Then>
      <Else>
        <button
          type={type as Exclude<typeof type, 'link'>}
          disabled={disabled}
          onClick={onClick}
          className={getClassName()}
        >
          {children}
        </button>
      </Else>
    </If>
  );
};

export default ButtonLinkWithLogo;
