import Link from 'next/link';
import md5 from 'md5'
import { useCallback, useEffect, useRef, useState } from 'react';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState<Boolean>(false)
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsOpen(false);
    }
    if (ref.current && ref.current.contains(event.target)){
      setTimeout(() => setIsOpen(false), 500)
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [])

  const toggleUserMenu = useCallback(() => {
    setIsOpen(!isOpen)
  }, [setIsOpen, isOpen])

  return (
    <div className="relative z-10">
      <div className="flex items-center cursor-pointer select-none" onClick={toggleUserMenu}>
        <span className="mr-2 text-gray-200">Eduardo F.</span>
        <img src={`https://www.gravatar.com/avatar/${md5('edu@rdo.blog.br')}?d=mp&s=80`} className="w-10 h-10 rounded-full" alt="Eduardo f"/>
      </div>
      <ul
        className={
          `bg-gray-700 p-3 rounded shadow-lg absolute w-48 right-0 top-11 grid gap-3 text-right
          ${isOpen ? 'block' : 'hidden'}`
        }
        ref={ref}
      >
        <li>
          <Link href={'/feeds'}>
            <a className="text-gray-200">Edit RSS Feeds</a>
          </Link>
        </li>
        <li className="text-gray-200 border-t border-gray-500 pt-2">Sair</li>
      </ul>
    </div>
  )
}
