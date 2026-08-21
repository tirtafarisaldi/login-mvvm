import type { IconProps } from 'common-types';

const AngleUp = ({ width = 24, height = 24, fill }: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill={fill ?? 'none'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="ic_angle_down" transform="translate(16 16) rotate(180)">
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
      <g id="Group_9579" data-name="Group 9579" transform="translate(3.333 5.667)">
        <path
          id="Path_7687"
          data-name="Path 7687"
          d="M9.138-7.8c-.13-.13-1.472-.2-4.472-.2S.325-7.935.2-7.8a.667.667,0,0,0,0,.943l4,4a.667.667,0,0,0,.943,0l4-4A.667.667,0,0,0,9.138-7.8Z"
          transform="translate(0 8)"
          fill={fill ?? '#14171A'}
        />
      </g>
    </g>
  </svg>
);

export default AngleUp;
