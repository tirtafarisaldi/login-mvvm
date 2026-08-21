import Skeleton from 'components/Skeleton';
import type { FC } from 'react';

const ProfileCardSkeleton: FC = () => {
  return (
    <div className="user-profile flex items-center md:mb-0 mb-4 flex-wrap">
      <Skeleton variant="circle" height="80px" width="80px" mr="24px" />
      <div>
        <Skeleton width="200px" height="26px" mb="3px" />
        <Skeleton width="250px" height="15px" />
      </div>
    </div>
  );
};

export default ProfileCardSkeleton;
