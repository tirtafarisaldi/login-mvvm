import type { IconProps } from 'common-types';

const AngleDown = ({ width = 24, height = 24, fill }: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill={fill ?? 'none'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.4699 5.86208C12.3399 5.73341 10.9986 5.66675 7.99856 5.66675C4.99856 5.66675 3.65722 5.73341 3.52722 5.86208C3.40224 5.9871 3.33203 6.15664 3.33203 6.33341C3.33203 6.51019 3.40224 6.67973 3.52722 6.80475L7.52722 10.8047C7.65224 10.9297 7.82178 10.9999 7.99856 10.9999C8.17533 10.9999 8.34487 10.9297 8.46989 10.8047L12.4699 6.80475C12.5949 6.67973 12.6651 6.51019 12.6651 6.33341C12.6651 6.15664 12.5949 5.9871 12.4699 5.86208Z"
      fill={fill ?? '#14171A'}
    />
  </svg>
);

export default AngleDown;
