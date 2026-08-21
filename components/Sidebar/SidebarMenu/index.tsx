import { type FC } from 'react';
import type { SidebarMenuProps } from './types';
import { Fragment } from 'react';
import SidebarItem from 'components/Sidebar/SidebarMenuItem';
import { Flex, Spinner } from '@chakra-ui/react';
import { colors } from 'styles/theme/constants';

const SidebarMenu: FC<SidebarMenuProps> = ({ items, depthStep, depth, expanded }) => {
  return (
    <div className="sidebar">
      {!items.length ? (
        <Flex justify="center" align="center" minH="240px">
          <Spinner color={colors.ottomanRed} />
        </Flex>
      ) : (
        <ul className="m-0">
          {items.map((sidebarItem, index) => (
            <Fragment key={`${sidebarItem.name}${index}`}>
              {!sidebarItem.notAllowed && (
                <SidebarItem
                  depthStep={depthStep}
                  depth={depth}
                  expanded={expanded}
                  item={sidebarItem}
                />
              )}
            </Fragment>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SidebarMenu;
