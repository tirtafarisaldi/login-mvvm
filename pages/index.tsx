import { withProtected } from 'components/PrivateRoute';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

const HomePage = dynamic(() => import('src/app/Home/pages/HomePage'), {
  ssr: false,
});

const DashboardPage: NextPage = () => <HomePage />;

export default withProtected(DashboardPage);
