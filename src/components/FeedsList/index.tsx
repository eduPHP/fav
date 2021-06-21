import Link from 'next/link';
import { FeedItem } from '../../pages';

interface FeedsListProps {
  feeds: FeedItem[];
  loading: boolean;
  noTag?: boolean;
}

export default function FeedsList({ feeds, loading, noTag }: FeedsListProps) {
  return (
    <ul className="mt-6 divide-y divide-gray-500 rounded-lg shadow bg-gray-600">
      {loading && !feeds.length && (
        <>
          {[0, 1, 2, 3, 4].map(i => (
            <li
              className="py-2 px-3 md:px-6 flex flex-col justify-between animate-pulse"
              key={i}
            >
              {!noTag && (
                <div className="w-full">
                  <span className="bg-gray-500 rounded px-1 h-4 block w-32" />
                </div>
              )}
              <div className="pt-3">
                <div>
                  <span className="text-blue-300 flex items-center text-xl">
                    <span className="overflow-hidden flex max-w-[60%] flex-1">
                      <svg
                        className="w-4 h-4 fill-current mr-1.5 float-left"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 511.997 511.997"
                      >
                        <path d="M212.26 390.24l-60.331 60.331c-25.012 25.012-65.517 25.012-90.508.005-24.996-24.996-24.996-65.505-.005-90.496l120.683-120.683c24.991-24.992 65.5-24.992 90.491 0 8.331 8.331 21.839 8.331 30.17 0 8.331-8.331 8.331-21.839 0-30.17-41.654-41.654-109.177-41.654-150.831 0L31.247 329.909c-41.654 41.654-41.654 109.177 0 150.831 41.649 41.676 109.177 41.676 150.853 0l60.331-60.331c8.331-8.331 8.331-21.839 0-30.17s-21.84-8.33-30.171.001z" />
                        <path d="M480.751 31.24c-41.654-41.654-109.199-41.654-150.853 0l-72.384 72.384c-8.331 8.331-8.331 21.839 0 30.17 8.331 8.331 21.839 8.331 30.17 0l72.384-72.384c24.991-24.992 65.521-24.992 90.513 0 24.991 24.991 24.991 65.5 0 90.491L317.845 284.638c-24.992 24.992-65.5 24.992-90.491 0-8.331-8.331-21.839-8.331-30.17 0s-8.331 21.839 0 30.17c41.654 41.654 109.177 41.654 150.831 0l132.736-132.736c41.654-41.654 41.654-109.178 0-150.832z" />
                      </svg>
                      <span className="bg-blue-300 rounded-sm w-full h-4 mb-4" />
                    </span>
                  </span>
                </div>
                <span className="bg-gray-300 rounded-sm block max-w-[50%] h-3 mb-2" />
                <span className="bg-gray-300 rounded-sm block max-w-[45%] h-3 mb-2" />
                <span className="bg-gray-300 rounded-sm block max-w-[40%] h-3" />
              </div>
              <div className="pt-4 w-full">
                <span className="block bg-gray-400 text-xs h-3 w-32" />
              </div>
            </li>
          ))}
        </>
      )}
      {feeds.map(feed => (
        <li
          className="py-2 px-3 md:px-6 flex flex-col justify-between"
          key={feed.link}
        >
          {!noTag && (
            <div>
              <Link href={`/feeds/${feed.provider_id}/content`}>
                <a className="bg-gray-500 rounded px-1 text-gray-300">
                  {feed.site}
                </a>
              </Link>
            </div>
          )}
          <div className="pt-2">
            <Link href={feed.link}>
              <a
                className="text-blue-300 flex items-center text-xl"
                target="_blank"
              >
                <span className="overflow-hidden">
                  <svg
                    className="w-4 h-4 mt-1 fill-current mr-1.5 float-left"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 511.997 511.997"
                  >
                    <path d="M212.26 390.24l-60.331 60.331c-25.012 25.012-65.517 25.012-90.508.005-24.996-24.996-24.996-65.505-.005-90.496l120.683-120.683c24.991-24.992 65.5-24.992 90.491 0 8.331 8.331 21.839 8.331 30.17 0 8.331-8.331 8.331-21.839 0-30.17-41.654-41.654-109.177-41.654-150.831 0L31.247 329.909c-41.654 41.654-41.654 109.177 0 150.831 41.649 41.676 109.177 41.676 150.853 0l60.331-60.331c8.331-8.331 8.331-21.839 0-30.17s-21.84-8.33-30.171.001z" />
                    <path d="M480.751 31.24c-41.654-41.654-109.199-41.654-150.853 0l-72.384 72.384c-8.331 8.331-8.331 21.839 0 30.17 8.331 8.331 21.839 8.331 30.17 0l72.384-72.384c24.991-24.992 65.521-24.992 90.513 0 24.991 24.991 24.991 65.5 0 90.491L317.845 284.638c-24.992 24.992-65.5 24.992-90.491 0-8.331-8.331-21.839-8.331-30.17 0s-8.331 21.839 0 30.17c41.654 41.654 109.177 41.654 150.831 0l132.736-132.736c41.654-41.654 41.654-109.178 0-150.832z" />
                  </svg>
                  {feed.title}
                </span>
              </a>
            </Link>
            {feed.description && (
              <span className="text-gray-300 block mt-2">
                {feed.description}
              </span>
            )}
          </div>
          <div className="pt-2">
            <span className="text-gray-400 text-xs">{feed.pubDate}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
