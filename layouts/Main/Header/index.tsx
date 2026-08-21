import type { FC } from 'react';
import type { HeaderProps } from './types';
import { Fragment, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, MenuButton, MenuList, MenuItem, Box, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { When } from 'react-if';

const Header: FC<HeaderProps> = ({ crumbs }) => {
  const { push } = useRouter();
  const [isLoading] = useState(false);

  const handleLogout = async () => {
    push('/login');
  };

  return (
    <Box
      as="header"
      height={{ base: '20px', md: '100px' }}
      marginY={{ base: '10px', md: 0 }}
      className="md:flex flex-row items-center md:w-cms-header block w-full bg-transparent z-20 md:pr-6 md:pl-0 pl-4 pr-4"
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
            <div>
              {crumbs.length > 0 && (
                <Flex as="ul" flexWrap={'wrap'}>
                  {crumbs.map((crumb, index) => (
                    <Fragment key={index}>
                      {typeof crumb === 'string' ? (
                        <li className="text-deep_skyblue mr-1">
                          {crumbs.length === 1 || index < crumbs.length ? (
                            <a>/ {crumb}</a>
                          ) : (
                            <a> {crumb}</a>
                          )}
                        </li>
                      ) : (
                        <li className="text-deep_skyblue mr-1">
                          {crumbs.length === 1 || index < crumbs.length ? (
                            <Link href={crumb.link} passHref>
                              <a>/ {crumb.label}</a>
                            </Link>
                          ) : (
                            <Link href={crumb.link} passHref>
                              <a> {crumb.label}</a>
                            </Link>
                          )}
                        </li>
                      )}
                    </Fragment>
                  ))}
                </Flex>
              )}
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default Header;
