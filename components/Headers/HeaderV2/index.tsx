import type { FC } from 'react';
import type { HeaderV2Props } from './types';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, MenuButton, MenuList, MenuItem, Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const HeaderV2: FC<HeaderV2Props> = ({ breadcrumb }) => {
  const { push } = useRouter();
  const [isLoading] = useState(false);

  const handleLogout = async () => {
    push('/login');
  };

  return (
    <Box
      as="header"
      className="md:fixed md:h-72px md:flex flex-row items-center md:w-cms-header block w-full bg-calla_lily z-20 md:pr-6 md:pl-0 pl-4 pr-4"
    >
      <div className="flex flex-1 justify-between items-center leading-5 text-gray-500">
        <div className="text-silver_charm text-size12">
          <div className="flex items-center justify-center">
            <Link href="/">
              <a className="inline-block h-24px w-24px mr-1">
                <Image
                  src="/assets/images/home-breadcrumb.png"
                  width="24"
                  height="24"
                  alt="home-breadcrumb"
                />
              </a>
            </Link>
            <div>{breadcrumb}</div>
          </div>
        </div>
        <div className="md:block hidden">
          {/* <UserDropdown /> */}
          <Menu autoSelect={false}>
            <MenuButton as="a" className="text-blueGray-500 block cursor-pointer">
              <div className="items-center flex">
                <span className="w-10 h-10 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full"></span>
              </div>
            </MenuButton>
            <MenuList>
              <MenuItem isDisabled={isLoading} onClick={handleLogout}>
                Log out
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </Box>
  );
};

export default HeaderV2;
