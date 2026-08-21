import type { FC } from 'react';
import type { StatusLabelProps } from './types';

import { useState, useEffect, useCallback } from 'react';

import { When } from 'react-if';
import { Box } from '@chakra-ui/react';

const StatusLabel: FC<StatusLabelProps> = ({ status, label: statusLabel, ...props }) => {
  const [label, setLabel] = useState(status);
  const [className, setClassName] = useState('');

  const generateClassName = useCallback(() => {
    switch (status) {
      case 'inactive':
      case 'deleted':
      case 'expired':
      case 'failed':
      case 'rejected':
      case 'reverse':
      case 'blocked':
      case 'canceled':
      case 'deactived':
        setClassName('bg-mary_rose text-ottoman_red');
        break;
      case 'active':
      case 'success':
      case 'approved':
      case 'inject':
      case 'permitted':
      case 'completed':
      case 'achieved':
        setClassName('bg-otto_ice text-grass_court');
        break;
      case 'pending':
      case 'need-approval':
      case 'need-verify':
        setClassName('bg-sleep_lamp text-squash');
        break;
      case 'blacklist':
      case 'fraud':
        setClassName('border border-ottoman_red text-ottoman_red');
        break;
      case 'whitelist':
        setClassName('border border-jordan_jazz text-jordan_jazz');
        break;
      case 'non-fraud':
        setClassName('border border-deep_skyblue text-deep_skyblue');
        break;
      case 'running':
        setClassName('bg-cloudless text-deep_skyblue');
        break;
      case 'scheduled':
        setClassName('bg-sleep_lamp text-oldTrail');
        break;
      default:
        setClassName('bg-calla_lily text-black_lead');
        break;
    }
  }, [status]);

  useEffect(() => {
    generateClassName();
    setLabel(status ? status[0].toUpperCase() + status?.slice(1) : '');
  }, [generateClassName, status]);

  return (
    <>
      <When condition={status}>
        <Box
          {...props}
          className={`inline-block text-size12 leading-15px capitalize py-1 px-2 rounded-md ${className}`}
        >
          {statusLabel || label}
        </Box>
      </When>
    </>
  );
};

export default StatusLabel;
