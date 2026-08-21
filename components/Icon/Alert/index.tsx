import type { IconProps } from 'common-types';

const Alert = ({ width = 24, height = 24, fill }: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill={fill ?? 'none'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="ic_alert" transform="translate(25 -13)">
      <g id="Surface">
        <g id="Artboard" transform="translate(-25 13)">
          <rect
            id="Rectangle_5053"
            data-name="Rectangle 5053"
            width={width}
            height={height}
            fill={fill ?? '#14171A'}
            opacity="0"
          />
        </g>
      </g>
      <g id="Group_10682" data-name="Group 10682" transform="translate(-21.5 33.5)">
        <path
          id="Path_9313"
          data-name="Path 9313"
          d="M8.5-17A8.5,8.5,0,0,0,0-8.5,8.5,8.5,0,0,0,8.5,0,8.5,8.5,0,0,0,17-8.5,8.5,8.5,0,0,0,8.5-17Zm0,2A6.5,6.5,0,0,1,15-8.5,6.5,6.5,0,0,1,8.5-2,6.5,6.5,0,0,1,2-8.5,6.5,6.5,0,0,1,8.5-15Zm0,8.5a1,1,0,0,1,1,1,1,1,0,0,1-1,1,1,1,0,0,1-1-1A1,1,0,0,1,8.5-6.5Zm-1-5v3a1,1,0,0,0,1,1,1,1,0,0,0,1-1v-3a1,1,0,0,0-1-1A1,1,0,0,0,7.5-11.5Z"
          fill={fill ?? '#14171A'}
        />
      </g>
    </g>
  </svg>
);

export default Alert;
