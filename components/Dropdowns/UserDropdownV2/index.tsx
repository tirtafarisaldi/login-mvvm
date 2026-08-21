import type { FC } from 'react';
import { useState, createRef } from 'react';
import { createPopper } from '@popperjs/core';
import { useRouter } from 'next/router';

const UserDropdown: FC = () => {
  const { push } = useRouter();

  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
  const btnDropdownRef = createRef<HTMLAnchorElement>();
  const popoverDropdownRef = createRef<HTMLDivElement>();
  const openDropdownPopover = () => {
    if (!btnDropdownRef.current || !popoverDropdownRef.current) return;

    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: 'bottom-start',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 10]
          }
        }
      ]
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  return (
    <>
      <a
        className="text-blueGray-500 block"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      ></a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? 'block ' : 'hidden ') +
          'bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48 mt-4'
        }
      >
        <a
          className={
            'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700 cursor-pointer'
          }
          onClick={() => {
            push('/login');
          }}
        >
          Log out
        </a>
      </div>
    </>
  );
};

export default UserDropdown;
