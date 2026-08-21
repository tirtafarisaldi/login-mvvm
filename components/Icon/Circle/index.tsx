import type { IconProps } from 'common-types';

const Circle = ({ width = 24, height = 24, fill }: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill={fill ?? 'none'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Surface">
      <g id="Artboard">
        <rect
          id="Rectangle_5026"
          data-name="Rectangle 5026"
          width={width}
          height={height}
          fill={fill ?? '#14171A'}
          opacity="0"
        />
      </g>
    </g>
    <g id="Group_9579" data-name="Group 9579">
      <circle cx="8" cy="8" r="4" fill={fill ?? '#14171A'} />
    </g>
  </svg>
);

export default Circle;
