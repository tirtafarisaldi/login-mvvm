import { withProtected } from 'components/PrivateRoute';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

const InventoryPage = dynamic(
  () => import('src/app/Menus/Inventory/pages/InventoryPage'),
  { ssr: false },
);

const InventoryMenuPage: NextPage = () => <InventoryPage />;

export default withProtected(InventoryMenuPage);
