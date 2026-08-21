import type { FC } from 'react';
import type { StatusGatewayProps } from './types';

const StatusGateway: FC<StatusGatewayProps> = ({ status }) => {
  const getClassName = () => {
    let className = '';

    const stts = status?.toLowerCase().replace('-', ' ');

    switch (stts) {
      case 'inactive':
      case 'out':
      case 'deleted':
      case 'expired':
      case 'failed':
      case 'rejected':
      case 'expired payment':
      case 'payment canceled':
        className = 'text-ottoman_red';
        break;
      case 'active':
      case 'success':
      case 'in':
      case 'approved':
      case 'payment success':
      case 'transaction completed':
        className = 'text-jordan_jazz';
        break;
      case 'pending':
      case 'need approval':
      case 'need verify':
      case 'waiting for payment':
        className = 'text-squash';
        break;
      default:
        className += 'text-black_lead';
        break;
    }

    return className;
  };

  return (
    <>
      <div className={`${getClassName()}`}>
        <span className="capitalize">&#8226; {status.replace('-', ' ')}</span>
      </div>
    </>
  );
};

export default StatusGateway;
