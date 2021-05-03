import Link from 'next/link';
import api from '../../services/api';
import Head from 'next/head';
import { useToast } from '../../hooks/toasts';
import { useCallback, useEffect, useState } from 'react';
import { useDialog } from '../../hooks/dialog';
import { authenticated } from '../../hooks/auth';

type FeedsList = {
  feeds: Feed[];
};

const ProvidersList = () => {
  const { addToast } = useToast();
  const { showDialog } = useDialog();
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const response = await api.get<FeedsList>(`/feeds`);
      setFeeds(response.data.feeds);
      setLoading(false);
    })();
  }, []);

  const handleDeleteRss = useCallback(
    async (id: number) => {
      showDialog({
        title: 'Delete RSS Feed',
        description:
          'If you choose to continue, this action will be permanent.',
        type: 'danger',
        options: {
          confirm: 'Delete',
        },
        async action() {
          await api.delete(`/feeds/${id}`);
          setFeeds(state => [...state.filter(feed => feed.id !== id)]);
          addToast({
            title: 'Success',
            type: 'success',
            description: `Feed removed successfully.`,
          });
        },
      });
    },
    [addToast],
  );

  return (
    <>
      <Head>
        <title>RSS</title>
      </Head>
      <div>
        <Link href={'/feeds/create'}>
          <a className="rounded bg-blue-400 px-6 py-2 text-gray-200">Create</a>
        </Link>
        <ul className="mt-6 divide-y divide-gray-500 rounded-lg shadow bg-gray-600">
          {!loading && !feeds.length && (
            <div className="py-6 text-center">
              No feeds to display, please{' '}
              <Link href="/feeds/create">
                <a className="text-blue-300">create a feed resource</a>
              </Link>{' '}
              to begin.
            </div>
          )}
          {loading && (
            <>
              <li className="py-6 px-8 flex items-center justify-between animate-pulse">
                <span className="flex-1 max-w-[80%]">
                  <span className="bg-indigo-300 rounded-sm block max-w-[30%] h-4 mb-4" />
                  <span className="bg-gray-300 rounded-sm block max-w-xs h-4" />
                </span>
                <div className="flex flex-col justify-between items-end">
                  <span className="bg-indigo-300 rounded-sm h-3 w-8 mb-3" />
                  <span className="bg-indigo-300 rounded-sm h-3 w-14" />
                </div>
              </li>
              <li className="py-6 px-8 flex items-center justify-between animate-pulse">
                <span className="flex-1 max-w-[80%]">
                  <span className="bg-indigo-300 rounded-sm block max-w-[30%] h-4 mb-4" />
                  <span className="bg-gray-300 rounded-sm block max-w-xs h-4" />
                </span>
                <div className="flex flex-col justify-between items-end">
                  <span className="bg-indigo-300 rounded-sm h-3 w-8 mb-3" />
                  <span className="bg-indigo-300 rounded-sm h-3 w-14" />
                </div>
              </li>
            </>
          )}
          {feeds.map(feed => (
            <li
              className="py-6 px-8 flex items-center justify-between"
              key={feed.id}
            >
              <span className="flex-1 max-w-[80%]">
                <span className="text-indigo-300 block mb-2 text-xl">
                  {feed.name}
                </span>
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 fill-current mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 511.997 511.997"
                  >
                    <path d="M212.26 390.24l-60.331 60.331c-25.012 25.012-65.517 25.012-90.508.005-24.996-24.996-24.996-65.505-.005-90.496l120.683-120.683c24.991-24.992 65.5-24.992 90.491 0 8.331 8.331 21.839 8.331 30.17 0 8.331-8.331 8.331-21.839 0-30.17-41.654-41.654-109.177-41.654-150.831 0L31.247 329.909c-41.654 41.654-41.654 109.177 0 150.831 41.649 41.676 109.177 41.676 150.853 0l60.331-60.331c8.331-8.331 8.331-21.839 0-30.17s-21.84-8.33-30.171.001z" />
                    <path d="M480.751 31.24c-41.654-41.654-109.199-41.654-150.853 0l-72.384 72.384c-8.331 8.331-8.331 21.839 0 30.17 8.331 8.331 21.839 8.331 30.17 0l72.384-72.384c24.991-24.992 65.521-24.992 90.513 0 24.991 24.991 24.991 65.5 0 90.491L317.845 284.638c-24.992 24.992-65.5 24.992-90.491 0-8.331-8.331-21.839-8.331-30.17 0s-8.331 21.839 0 30.17c41.654 41.654 109.177 41.654 150.831 0l132.736-132.736c41.654-41.654 41.654-109.178 0-150.832z" />
                  </svg>
                  <span className=" table-cell overflow-hidden">
                    {feed.url}
                  </span>
                </span>
              </span>
              <div className="flex flex-col justify-between items-end">
                <Link href={`/feeds/${feed.id}`}>
                  <a className="text-indigo-300 hover:underline">Edit</a>
                </Link>
                <button
                  onClick={() => handleDeleteRss(feed.id)}
                  className="text-indigo-300 hover:underline"
                  type="button"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

ProvidersList.getInitialProps = async ctx => {
  const { token } = await authenticated(ctx);
  return { token };
};

export default ProvidersList;
