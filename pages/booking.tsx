import { withProtected } from 'components/PrivateRoute';
import type { NextPage } from 'next';
import BookingPage from 'src/app/Menus/Booking/pages/BookingPage';

const BookingMenuPage: NextPage = () => <BookingPage />;

export default withProtected(BookingMenuPage);
