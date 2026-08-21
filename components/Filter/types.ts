import React from 'react';

export interface FilterAreaProps {
  filters: Array<React.ReactElement>;
  onClickApply: () => void;
  onClickReset: () => void;
  disabled?: boolean;
}
