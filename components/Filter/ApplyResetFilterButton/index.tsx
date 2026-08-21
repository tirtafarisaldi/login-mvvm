import type { FC } from 'react';
import type { ApplyResetFilterButtonProps } from './types';
import Button from 'components/Button/Button';
import Text from 'components/Typography/Text';
import { colors } from 'styles/theme/constants';

const ApplyResetFilterButton: FC<ApplyResetFilterButtonProps> = ({
  applyButtonOnClick,
  isApplyButtonDisable = false,
  resetButtonOnClick,
  isResetButtonDisable = false
}) => (
  <div className="md:flex md:justify-between md:items-center block mb-5">
    <div
      className="flex"
      style={{
        gap: '10px'
      }}
    >
      <Button
        text="Reset"
        disabled={isResetButtonDisable}
        appearance="outline"
        onClick={resetButtonOnClick}
        style={{
          padding: '6px 16px',
          width: '60px',
          height: '30px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      />
      <Button
        text="Terapkan Filter"
        disabled={isApplyButtonDisable}
        onClick={applyButtonOnClick}
        style={{
          padding: '6px 16px',
          width: '115px',
          height: '30px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      />
    </div>
  </div>
);

export default ApplyResetFilterButton;
