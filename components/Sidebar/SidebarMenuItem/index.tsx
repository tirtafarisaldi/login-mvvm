import type { FC } from 'react';
import type { SidebarItemProps } from './types';
import { useState, Fragment, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { colors } from 'styles/theme/constants';
import { Auth } from 'aws-amplify';
import React from 'react';

const SidebarItem: FC<SidebarItemProps> = ({
  depthStep = 40,
  depth = 0,
  expanded,
  item,
  ...rest
}) => {
  const router = useRouter();
  const isFirstCollapsed = () => {
    if (item.childrenHrefs) {
      if (item.childrenHrefs.includes(router.pathname)) {
        return false;
      }
    }

    return true;
  };

  const [collapsed, setCollapsed] = useState(false);
  const { label, items, icon, MenuIcon, href, onClick = false, name } = item;
  const [isHovering, setIsHovered] = useState(false);

  const active = router.pathname === href;

  const onMouseEnter = () => setIsHovered(true);
  const onMouseLeave = () => setIsHovered(false);

  const toggleCollapse = () => {
    setCollapsed((prevValue) => !prevValue);
  };

  const onClickAction = useCallback(() => {
    if (item.childrenHrefs) {
      toggleCollapse();
    }

    if (href && !item.childrenHrefs) {
      router.push(href || '');
    }
  }, [href, item.childrenHrefs, router]);

  const isHasChildHrefs = (childrenHrefs: SidebarItemProps['item']['childrenHrefs']) => {
    if (childrenHrefs) {
      return childrenHrefs.includes(router.pathname);
      // return childrenHrefs.toString().indexOf(router.pathname) > -1;
    } else {
      return false;
    }
  };

  let expandIcon;

  if (Array.isArray(items) && items.length) {
    expandIcon = !collapsed ? (
      <i
        className={
          'fas fa-chevron-up flex items-center justify-center text-size12 h-24px w-24px ml-auto bg-center'
        }
      />
    ) : (
      <i
        className={
          'fas fa-chevron-down flex items-center justify-center text-size12 h-24px w-24px ml-auto bg-center'
        }
      />
    );
  }

  const handleLogout = async () => {
    try {
      await Auth.signOut({
        global: true
      });
      router.push('/login');
    } catch (error: any) {
      if (error.code === 'NotAuthorizedException') {
        await Auth.signOut();
        router.push('/login');
      }
    }
  };

  useEffect(() => {
    setCollapsed(true);
  }, [expanded]);

  return (
    <>
      <li
        className={
          'pr-5 pl-8 pb-6 pt-6 flex items-center justify-between h-24px cursor-pointer font-normal hover:font-bold' +
          'text-dark_willow font-bold hover:text-ottoman_red hover:bg-mary_rose ' +
          `${active && 'text-ottoman_red bg-mary_rose'}`
        }
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClickAction}
        style={{
          marginTop: `${name === 'logout' && '100px'}`,
          marginBottom: `${name === 'logout' && '50px'}`
        }}
        {...rest}
      >
        {href ? (
          <div style={{ paddingLeft: depth * depthStep }} className="flex items-center">
            {icon && (
              <>
                <span
                  className={
                    'mr-4 flex items-center justify-center text-size18 h-24px w-24px bg-center'
                  }
                >
                  <Image
                    src={`/assets/images/sidebar/${icon}${
                      (isHovering || active) && icon !== 'master-management' && icon !== 'logout'
                        ? '-red'
                        : ''
                    }.png`}
                    alt="me"
                    width="24"
                    height="24"
                  />
                </span>
              </>
            )}
            {/* Using SVG Icon instead background image */}
            {!!MenuIcon && (
              <span className="mr-4 flex items-center justify-center">
                <MenuIcon isLine={true} width={24} height={24} fill={colors.darkWillow} />
              </span>
            )}
            {expanded ? (
              <span className="sidebar-item-text text-size14 leading-17px align-left">{label}</span>
            ) : null}
          </div>
        ) : (
          <div
            style={{ paddingLeft: depth * depthStep }}
            className="flex items-center"
            onClick={handleLogout}
          >
            {icon && (
              <>
                <span
                  className={
                    'mr-4 flex items-center justify-center text-size18 h-24px w-24px bg-center'
                  }
                >
                  <Image
                    src={`/assets/images/sidebar/${icon}.png`}
                    alt="me"
                    width="24"
                    height="24"
                  />
                </span>
              </>
            )}
            {expanded ? (
              <span className="sidebar-item-text text-size14 leading-17px align-left">{label}</span>
            ) : null}
          </div>
        )}

        {expanded && expandIcon}
      </li>
      <div
        hidden={collapsed}
        className={!expanded ? 'fixed left-24 top-48 w-60 bg-white rounded-xl' : ''}
      >
        {Array.isArray(items) ? (
          <ul>
            {items.map((subItem, index) => {
              if (expanded) {
                return (
                  <Fragment key={`${subItem.name}${index}`}>
                    {!subItem.notAllowed && (
                      <SidebarItem
                        depth={depth + 1}
                        depthStep={depthStep}
                        item={{
                          ...subItem,
                          href: `/master${subItem.href}`
                        }}
                        expanded={expanded}
                      />
                    )}
                  </Fragment>
                );
              } else {
                return (
                  <Fragment key={`${subItem.name}${index}`}>
                    <li
                      className={
                        'pr-5 pl-8 pb-6 pt-6 border-1 flex items-center justify-between h-24px cursor-pointer font-normal hover:font-bold' +
                        'text-dark_willow font-bold hover:text-ottoman_red hover:bg-mary_rose ' +
                        `${active && 'text-ottoman_red bg-mary_rose'}`
                      }
                      onClick={() => {
                        toggleCollapse();
                        if (subItem.href && !subItem.childrenHrefs) {
                          router.push(`/master/${subItem.href}` || '');
                        }
                      }}
                      onMouseEnter={onMouseEnter}
                      onMouseLeave={onMouseLeave}
                    >
                      {subItem.label}
                    </li>
                  </Fragment>
                );
              }
            })}
          </ul>
        ) : null}
      </div>
    </>
  );
};

export default React.memo(SidebarItem);
