import type { IconProps } from 'common-types';

const ChevronRight = ({ width = 24, height = 24, fill }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
    <g id="ic_chevron_down" transform="translate(0 24) rotate(-90)">
      <g id="Surface">
        <g id="Artboard">
          <rect
            id="Rectangle_5033"
            data-name="Rectangle 5033"
            width={width}
            height={height}
            fill={fill ?? '#14171A'}
            opacity="0"
          />
        </g>
      </g>
      <g id="Icon" transform="translate(7.001 9.5)">
        <path
          id="Path_5451"
          data-name="Path 5451"
          d="M12,13.086l3.293-3.293a1,1,0,0,1,1.414,1.414l-4,4a1,1,0,0,1-1.414,0l-4-4A1,1,0,0,1,8.707,9.793L12,13.086Z"
          transform="translate(-7.001 -9.5)"
          fill={fill ?? '#14171A'}
        />
      </g>
    </g>
  </svg>
);

export default ChevronRight;
