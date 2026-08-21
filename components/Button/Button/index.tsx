import type { FC } from 'react';
import Link from 'next/link';
import { If, Else, Then } from 'react-if';
import type { ButtonProps } from './types';
import { Flex } from '@chakra-ui/react';

const Button: FC<ButtonProps> = ({
  href,
  as,
  size,
  appearance,
  mergeClass,
  text,
  type,
  onClick,
  disabled,
  icon,
  iconPosition,
  style
}) => {
  const getClassName = () => {
    let className =
      'inline-block text-center font-lato rounded-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none transition-all';

    switch (size) {
      case 'large':
        className += ' text-size14 leading-17px';
        break;
      default:
        className += ' text-size12 leading-15px';
        break;
    }

    switch (appearance) {
      case 'outline':
        className +=
          ' font-bold bg-white border border-calla_lily text-dark_willow hover:bg-mary_rose hover:border-mary_rose hover:text-ottoman_red focus:outline-none';
        break;

      case 'cancel':
        className +=
          ' bg-white text-ottoman_red hover:bg-mary_rose hover:border-mary_rose focus:outline-none';
        break;

      case 'text':
        className += 'font-bold bg-white text-ottoman_red focus:outline-none';
        break;

      default:
        className +=
          ' bg-ottoman_red text-white shadow-btn_default hover:bg-ottoman_red_dark focus:outline-none';
        break;
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
          <a className={getClassName()}>{text}</a>
        </Link>
      </Then>
      <Else>
        <button
          type={type as Exclude<typeof type, 'link'>}
          disabled={disabled}
          onClick={onClick}
          className={getClassName()}
          style={style}
        >
          <Flex alignItems={'center'} gap={'8px'}>
            {iconPosition === 'right' ? (
              <>
                {text}
                {icon ?? icon}
              </>
            ) : (
              <>
                {icon ?? icon}
                {text}
              </>
            )}
          </Flex>
        </button>
      </Else>
    </If>
  );
};

export { Button };

export default Button;
