import Link from 'next/link';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import { formatter } from '../util/dateFormatter';
import { authenticated } from '../hooks/auth';
import { AxiosInstance } from 'axios';
import api from '../services/api';

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

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <Head>
        <title>RSS</title>
      </Head>
      <div>
        <ul className="mt-6 divide-y divide-gray-500 rounded-lg shadow bg-gray-600">
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
      <button
        onClick={handleScrollToTop}
        type="button"
        className="z-20 fixed text-white right-6 md:right-20 shadow-lg focus:outline-none focus:ring-gray-200 focus:ring-1 bottom-8 bg-gray-500 rounded p-3 cursor-pointer transition opacity-40 hover:opacity-60"
      >
        <svg
          className="fill-current w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 286.054 286.054"
        >
          <path d="M47.95 164.364c-7.625 12.837-1.386 23.34 13.856 23.34h36.526v80.453c0 9.887 8.01 17.896 17.878 17.896h53.635c9.869 0 17.878-8.009 17.878-17.896v-80.453h36.517c15.241 0 21.481-10.495 13.856-23.34l-81.212-83.233c-11.04-11.031-17.101-10.62-27.72 0-.002 0-81.214 83.233-81.214 83.233zM286.054 26.808v-8.939c0-9.878-8.01-17.869-17.878-17.869H17.878C8.01-.001 0 7.991 0 17.868v8.939c0 9.869 8.01 17.878 17.878 17.878h250.297c9.869.001 17.879-8.009 17.879-17.877z" />
        </svg>
      </button>
    </>
  );
};

Home.getInitialProps = async ctx => {
  const { token } = authenticated(ctx);
  return { token };
};

export default Home;
