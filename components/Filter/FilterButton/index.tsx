import type { FC } from 'react';
import type { FilterButtonProps } from './types';
import ButtonLinkWithLogo from 'components/Button/ButtonLinkWithLogo';

const FilterButton: FC<FilterButtonProps> = ({ onClick }) => (
  <ButtonLinkWithLogo onClick={onClick} mergeClass="mr-4">
    <div className="flex items-center">
      <i className="flex items-center justify-center text-size14 h-4 w-4 bg-center bg-filter-icon mr-2"></i>
      <span>Filter</span>
    </div>
  </ButtonLinkWithLogo>
);

export default FilterButton;
