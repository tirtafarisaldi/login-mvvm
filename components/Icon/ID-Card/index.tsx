import type { IconProps } from 'common-types';

const IdCard = ({ width = 24, height = 24, fill }: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill={fill ?? 'none'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 2H20V14H2V2ZM1 0C0.44772 0 0 0.44772 0 1V15C0 15.5523 0.44772 16 1 16H21C21.5523 16 22 15.5523 22 15V1C22 0.44772 21.5523 0 21 0H1ZM12 4H18V6H12V4ZM17 8H12V10H17V8ZM9.5 6C9.5 7.3807 8.38071 8.5 7 8.5C5.61929 8.5 4.5 7.3807 4.5 6C4.5 4.61929 5.61929 3.5 7 3.5C8.38071 3.5 9.5 4.61929 9.5 6ZM7 9.5C5.067 9.5 3.5 11.067 3.5 13H10.5C10.5 11.067 8.933 9.5 7 9.5Z"
      fill={fill ?? '#ED2227'}
    />
  </svg>
);

export default IdCard;
