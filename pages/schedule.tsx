import { withProtected } from 'components/PrivateRoute';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

const SchedulePage = dynamic(
  () => import('src/app/Menus/Schedule/pages/SchedulePage'),
  { ssr: true }
);

const ScheduleMenuPage: NextPage = () => <SchedulePage />;

export default withProtected(ScheduleMenuPage);
