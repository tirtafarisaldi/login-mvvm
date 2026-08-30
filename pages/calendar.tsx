import { withProtected } from 'components/PrivateRoute';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

const CalendarPage = dynamic(
  () => import('src/app/Menus/Calendar/pages/CalendarPage'),
  { ssr: true }
);

const CalendarMenuPage: NextPage = () => <CalendarPage />;

export default withProtected(CalendarMenuPage);
