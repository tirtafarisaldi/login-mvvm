import { withProtected } from 'components/PrivateRoute';
import type { NextPage } from 'next';
import SchedulePage from 'src/app/Menus/Schedule/pages/SchedulePage';

const ScheduleMenuPage: NextPage = () => <SchedulePage />;

export default withProtected(ScheduleMenuPage);
