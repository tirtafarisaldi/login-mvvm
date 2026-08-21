import type { IconProps } from 'common-types';

const Calendar = ({ width = 24, height = 24, fill }: IconProps) => (
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
          id="Rectangle_5065"
          data-name="Rectangle 5065"
          width={width}
          height={height}
          fill={fill ?? '#14171A'}
          opacity="0"
        />
      </g>
    </g>
    <g id="Group_10179" data-name="Group 10179" transform="translate(4.2 20.5)">
      <path
        id="Path_8161"
        data-name="Path 8161"
        d="M9.75-15.5V-16a1,1,0,0,1,1-1,1,1,0,0,1,1,1v.5h.75a3,3,0,0,1,3,3V-3a3,3,0,0,1-3,3H3A3,3,0,0,1,0-3v-9.5a3,3,0,0,1,3-3h.75V-16a1,1,0,0,1,1-1,1,1,0,0,1,1,1v.5ZM13.5-9H2v6A1,1,0,0,0,3-2h9.5a1,1,0,0,0,1-1Zm-1.75-4.5v.5a1,1,0,0,1-1,1,1,1,0,0,1-1-1v-.5h-4v.5a1,1,0,0,1-1,1,1,1,0,0,1-1-1v-.5H3a1,1,0,0,0-1,1V-11H13.5v-1.5a1,1,0,0,0-1-1Z"
        fill={fill ?? '#14171A'}
      />
    </g>
  </svg>
);

export default Calendar;
