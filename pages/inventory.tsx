import { withProtected } from 'components/PrivateRoute';
import type { NextPage } from 'next';
import InventoryPage from 'src/app/Menus/Inventory/pages/InventoryPage';

const InventoryMenuPage: NextPage = () => <InventoryPage />;

export default withProtected(InventoryMenuPage);
