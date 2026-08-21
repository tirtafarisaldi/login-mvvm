import type { IconProps } from 'common-types';
import { colors } from 'styles/theme/constants';

const Mobile = ({ width = 24, height = 24, active }: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox={`0 0 32 32`}
    fill={'none'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width={width} height={height} rx="16" fill={active ? 'white' : '#1B78EB'} />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.2143 9.25H12.7857C12.0756 9.25 11.5 9.85442 11.5 10.6V21.4C11.5 22.1456 12.0756 22.75 12.7857 22.75H19.2143C19.9244 22.75 20.5 22.1456 20.5 21.4V10.6C20.5 9.85442 19.9244 9.25 19.2143 9.25Z"
      stroke={active ? colors.ottomanRed : 'white'}
      strokeWidth={'1.5'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="11.5" y="19" width="9" height="1.5" fill={active ? colors.ottomanRed : 'white'} />
  </svg>
);

export default Mobile;
