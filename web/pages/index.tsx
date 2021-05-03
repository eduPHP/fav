import Link from 'next/link';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import { formatter } from '../util/dateFormatter';
import { authenticated } from '../hooks/auth';
import { AxiosInstance } from 'axios';
import api from '../services/api';
import { useRouter } from 'next/router';
import ScrollToTop from '../components/ScrollToTop';

interface FeedItem {
  title: string;
  description: string | null;
  author: string | null;
  link: string;
  pubDate: string;
  site: string;
}

const Home = () => {
  const [feeds, setFeeds] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function getFeeds() {
    const response = await api.get<FeedItem[]>(`/feeds/all`);
    setFeeds(
      response.data.map(i => {
        let domain = new URL(i.link);
        return {
          ...i,
          site: domain.hostname,
          pubDate: formatter.format(new Date(i.pubDate)),
        };
      }),
    );
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      await getFeeds();
    })();
  }, []);

  const handleRefresh = useCallback(async () => {
    setLoading(true);
    await getFeeds();
  }, []);

  return (
    <>
      <Head>
        <title>RSS</title>
      </Head>
      <div>
        <button
          className="flex items-center text-green-500"
          type="button"
          disabled={loading}
          onClick={handleRefresh}
        >
          <svg
            className={`w-4 h-4 fill-current mr-2 ${loading && 'animate-spin'}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M493.815 70.629c-11.001-1.003-20.73 7.102-21.733 18.102l-2.65 29.069C424.473 47.194 346.429 0 256 0 158.719 0 72.988 55.522 30.43 138.854c-5.024 9.837-1.122 21.884 8.715 26.908 9.839 5.024 21.884 1.123 26.908-8.715C102.07 86.523 174.397 40 256 40c74.377 0 141.499 38.731 179.953 99.408l-28.517-20.367c-8.989-6.419-21.48-4.337-27.899 4.651-6.419 8.989-4.337 21.479 4.651 27.899l86.475 61.761c12.674 9.035 30.155.764 31.541-14.459l9.711-106.53c1.004-11.001-7.1-20.731-18.1-21.734zM472.855 346.238c-9.838-5.023-21.884-1.122-26.908 8.715C409.93 425.477 337.603 472 256 472c-74.377 0-141.499-38.731-179.953-99.408l28.517 20.367c8.989 6.419 21.479 4.337 27.899-4.651 6.419-8.989 4.337-21.479-4.651-27.899l-86.475-61.761c-12.519-8.944-30.141-.921-31.541 14.459L.085 419.637c-1.003 11 7.102 20.73 18.101 21.733 11.014 1.001 20.731-7.112 21.733-18.102l2.65-29.069C87.527 464.806 165.571 512 256 512c97.281 0 183.012-55.522 225.57-138.854 5.024-9.837 1.122-21.884-8.715-26.908z" />
          </svg>
          Reload
        </button>
        <ul className="mt-6 divide-y divide-gray-500 rounded-lg shadow bg-gray-600">
          {!loading && !feeds.length && (
            <div className="py-6 text-center">
              No feeds to display, please{' '}
              <Link href="/feeds/create">
                <a className="text-blue-300">create a feed provider</a>
              </Link>{' '}
              to begin.
            </div>
          )}
          {loading && (
            <>
              {[0, 1, 2, 3, 4].map(i => (
                <li
                  className="py-2 px-3 md:px-6 flex flex-col justify-between animate-pulse"
                  key={i}
                >
                  <div className="pb-3 w-full">
                    <span className="bg-gray-500 rounded px-1 h-4 block w-32" />
                  </div>
                  <div>
                    <div>
                      <span className="text-indigo-300 flex items-center text-xl">
                        <span className="overflow-hidden flex max-w-[60%] flex-1">
                          <svg
                            className="w-4 h-4 fill-current mr-1.5 float-left"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 511.997 511.997"
                          >
                            <path d="M212.26 390.24l-60.331 60.331c-25.012 25.012-65.517 25.012-90.508.005-24.996-24.996-24.996-65.505-.005-90.496l120.683-120.683c24.991-24.992 65.5-24.992 90.491 0 8.331 8.331 21.839 8.331 30.17 0 8.331-8.331 8.331-21.839 0-30.17-41.654-41.654-109.177-41.654-150.831 0L31.247 329.909c-41.654 41.654-41.654 109.177 0 150.831 41.649 41.676 109.177 41.676 150.853 0l60.331-60.331c8.331-8.331 8.331-21.839 0-30.17s-21.84-8.33-30.171.001z" />
                            <path d="M480.751 31.24c-41.654-41.654-109.199-41.654-150.853 0l-72.384 72.384c-8.331 8.331-8.331 21.839 0 30.17 8.331 8.331 21.839 8.331 30.17 0l72.384-72.384c24.991-24.992 65.521-24.992 90.513 0 24.991 24.991 24.991 65.5 0 90.491L317.845 284.638c-24.992 24.992-65.5 24.992-90.491 0-8.331-8.331-21.839-8.331-30.17 0s-8.331 21.839 0 30.17c41.654 41.654 109.177 41.654 150.831 0l132.736-132.736c41.654-41.654 41.654-109.178 0-150.832z" />
                          </svg>
                          <span className="bg-indigo-300 rounded-sm w-full h-4 mb-4" />
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
              <div className="pb-2">
                <span className="bg-gray-500 rounded px-1 text-gray-300">
                  {feed.site}
                </span>
              </div>
              <div className="">
                <Link href={feed.link}>
                  <a
                    className="text-indigo-300 flex items-center text-xl"
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
      </div>
      <ScrollToTop />
    </>
  );
};

Home.getInitialProps = async ctx => {
  const { token } = authenticated(ctx);
  return { token };
};

export default Home;
