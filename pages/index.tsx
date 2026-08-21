import { withProtected } from 'components/PrivateRoute';
import type { NextPage } from 'next';
import HomePage from 'src/app/Home/pages/HomePage';

const DashboardPage: NextPage = () => <HomePage />;

export default withProtected(DashboardPage);
