import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@hooks/auth';
import Router from 'next/router';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ref = useRef(null);
  const menuRef = useRef(null);
  const { user, signOut } = useAuth();

  const handleClickOutside = event => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsOpen(false);
    }
    if (menuRef.current && menuRef.current.contains(event.target)) {
      setTimeout(() => ref.current && setIsOpen(false), 500);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [user]);

  const toggleUserMenu = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleSignOut = useCallback(async () => {
    document.removeEventListener('click', handleClickOutside, true);
    await signOut();
    await Router.push('/');
  }, []);

  return (
    <div className="relative text-gray-300" ref={ref}>
      <div
        className="flex items-center cursor-pointer select-none"
        onClick={toggleUserMenu}
      >
        <svg
          className={`fill-current w-3 h-3 mr-1.5 ${
            isOpen && 'transform rotate-180'
          }`}
          viewBox="0 0 515.556 515.556"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M257.778 386.671L0 128.893h128.886l128.892 128.889 128.886-128.897 128.892.008z" />
        </svg>
        <span className="mr-2">{user.name}</span>
        <img
          src={user.avatar}
          className="w-10 h-10 rounded-full"
          alt="Eduardo f"
        />
      </div>
      <ul
        className={`bg-gray-700 rounded shadow-lg absolute w-56 right-0 top-11 grid text-right
          ${isOpen ? 'block' : 'hidden'}`}
        ref={menuRef}
      >
        <li>
          <Link href={'/feeds'}>
            <a className="block w-full px-3 py-2">Edit your RSS providers</a>
          </Link>
        </li>
        <li className="border-b border-gray-600 mt-1" />
        <li>
          <Link href={'/profile'}>
            <a className="block w-full px-3 py-2">Edit profile</a>
          </Link>
        </li>
        <li className="cursor-pointer" onClick={handleSignOut}>
          <span className="block w-full p-3">Logout</span>
        </li>
      </ul>
    </div>
  );
}
