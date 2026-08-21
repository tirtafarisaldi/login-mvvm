import type { NextPage } from 'next';
import { withLoginPageHandler } from 'components/PrivateRoute';
import Login from 'src/app/Authentication/pages/LoginPage';

const LoginPage: NextPage = () => <Login />;

export default withLoginPageHandler(LoginPage);
