import Link from 'next/link';
import UserMenu from './UserMenu';

export function Header() {
  return (
    <div className="bg-green-800">
      <div className="flex justify-between items-center px-6 py-4 max-w-[50rem] mx-auto">
        <Link href={'/'}>
          <a>
            <h1 className="text-gray-300 text-3xl font-bold flex items-center">
              <svg className="w-10 h-10 fill-current mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 124 124">
                <circle cx="20.3" cy="103.749" r="20"/>
                <path
                  d="M67 113.95c0 5.5 4.5 10 10 10s10-4.5 10-10c0-42.4-34.5-77-77-77-5.5 0-10 4.5-10 10s4.5 10 10 10c31.5 0 57 25.6 57 57z"/>
                <path
                  d="M114 123.95c5.5 0 10-4.5 10-10C124 51.15 72.9.05 10.1.05c-5.5 0-10 4.5-10 10s4.5 10 10 10c51.8 0 93.9 42.1 93.9 93.9 0 5.5 4.4 10 10 10z"/>
              </svg>
              RSS!
            </h1>
          </a>
        </Link>
        <UserMenu />
      </div>
    </div>
  )
}
