import type { FC } from 'react';
import type { TitleColumnProps } from './types';
import { indonesianDateTime } from 'utility/date';

const TitleColumn: FC<TitleColumnProps> = ({ title, portalName, releaseDate }) => (
  <>
    <div className="flex flex-col min-w-200px">
      <p className="font-bold text-black mb-2">{title}</p>
      <p className="text-size12 flex space-x-1.5">
        <span>{portalName}</span>
        <span>&middot;</span>
        <span>{indonesianDateTime(releaseDate)}</span>
      </p>
    </div>
  </>
);

export default TitleColumn;
