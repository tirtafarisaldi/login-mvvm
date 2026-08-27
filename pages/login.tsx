import type { NextPage } from 'next';
import { withLoginPageHandler } from 'components/PrivateRoute';
import dynamic from 'next/dynamic';

const Login = dynamic(() => import('src/app/Authentication/pages/LoginPage'), {
  ssr: false,
});

const LoginPage: NextPage = () => <Login />;

export default withLoginPageHandler(LoginPage);
