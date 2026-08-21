import type { IconProps } from 'common-types';

const Edit = ({ width = 24, height = 24, fill }: IconProps) => (
  <svg
    id="ic_edit"
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
  >
    <g id="Surface">
      <g id="Artboard">
        <rect
          id="Rectangle_5043"
          data-name="Rectangle 5043"
          width={width}
          height={width}
          fill={fill ?? '#14171A'}
          opacity="0"
        />
      </g>
    </g>
    <g id="Icon" transform="translate(3.5 3.5)">
      <path
        id="Path_5462"
        data-name="Path 5462"
        d="M11.209,5.081H5.991A2.5,2.5,0,0,0,3.5,7.572V18.009A2.5,2.5,0,0,0,5.991,20.5H16.428a2.5,2.5,0,0,0,2.491-2.491V12.79a1,1,0,1,0-2,0v5.219a.494.494,0,0,1-.491.491H5.991a.494.494,0,0,1-.491-.491V7.572a.494.494,0,0,1,.491-.491h5.218a1,1,0,1,0,0-2Zm4.885-.825L9.011,11.338a1,1,0,0,0-.263.465L8,14.785A1,1,0,0,0,9.216,16l2.982-.746a1,1,0,0,0,.464-.263l7.082-7.082a2.581,2.581,0,1,0-3.65-3.65h0Zm-4.65,9.122L18.33,6.492a.581.581,0,0,0-.822-.822l-6.887,6.886-.274,1.1,1.1-.274Z"
        transform="translate(-3.5 -3.5)"
        fill={fill ?? '#14171A'}
        fillRule="evenodd"
      />
    </g>
  </svg>
);

export default Edit;
