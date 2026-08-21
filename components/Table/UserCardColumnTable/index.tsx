import type { FC } from 'react';
import type { UserCardColumnTableProps } from './types';

const UserCardColumnTable: FC<UserCardColumnTableProps> = ({ avatar, name, username }) => (
  <div className="flex items-center min-w-200px">
    <img
      src={avatar ? avatar : '/empty-avatar.png'}
      className="h-10 w-10 bg-white rounded-full"
      alt={username}
    ></img>{' '}
    <span className="w-full ml-4">
      <p className="text-dark_willow text-size14 leading-17px mb-1 break-all">{name}</p>
      <p className="text-tarnished_silver text-size12 leading-15px break-all">{username}</p>
    </span>
  </div>
);

export default UserCardColumnTable;
