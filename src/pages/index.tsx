import Link from 'next/link';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import { formatter } from '../util/dateFormatter';
import { authenticated, useAuth } from '../hooks/auth';
import api from '../services/api';
import ScrollToTop from '../components/ScrollToTop';
import FeedsList from '../components/FeedsList';

export interface FeedItem {
  provider_id: number;
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
  const [reloadAvailable, setReloadAvailable] = useState(true)
  const { authenticated } = useAuth();

  async function getFeeds() {
    const response = await api.get<FeedItem[]>(
      authenticated ? `/feeds/contents` : `feeds/public-contents`,
    );
    if (!authenticated) {
      setReloadAvailable(false);
      setTimeout(() => { setReloadAvailable(true) }, 60000)
    }
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
      setLoading(true);
      await getFeeds();
    })();
  }, [authenticated]);

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
          className={`flex items-center ${reloadAvailable ? 'text-green-500' : 'text-gray-400 cursor-not-allowed'}`}
          type="button"
          disabled={!reloadAvailable || loading}
          onClick={handleRefresh}
        >
          <svg
            className={`w-4 h-4 fill-current mr-2 ${loading ? 'animate-spin' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M493.815 70.629c-11.001-1.003-20.73 7.102-21.733 18.102l-2.65 29.069C424.473 47.194 346.429 0 256 0 158.719 0 72.988 55.522 30.43 138.854c-5.024 9.837-1.122 21.884 8.715 26.908 9.839 5.024 21.884 1.123 26.908-8.715C102.07 86.523 174.397 40 256 40c74.377 0 141.499 38.731 179.953 99.408l-28.517-20.367c-8.989-6.419-21.48-4.337-27.899 4.651-6.419 8.989-4.337 21.479 4.651 27.899l86.475 61.761c12.674 9.035 30.155.764 31.541-14.459l9.711-106.53c1.004-11.001-7.1-20.731-18.1-21.734zM472.855 346.238c-9.838-5.023-21.884-1.122-26.908 8.715C409.93 425.477 337.603 472 256 472c-74.377 0-141.499-38.731-179.953-99.408l28.517 20.367c8.989 6.419 21.479 4.337 27.899-4.651 6.419-8.989 4.337-21.479-4.651-27.899l-86.475-61.761c-12.519-8.944-30.141-.921-31.541 14.459L.085 419.637c-1.003 11 7.102 20.73 18.101 21.733 11.014 1.001 20.731-7.112 21.733-18.102l2.65-29.069C87.527 464.806 165.571 512 256 512c97.281 0 183.012-55.522 225.57-138.854 5.024-9.837 1.122-21.884-8.715-26.908z" />
          </svg>
          Reload
        </button>
        {!loading && !feeds.length && (
          <div className="mt-6 divide-y divide-gray-500 rounded-lg shadow bg-gray-600">
            <p className="py-6 text-center">
              No feeds to display, please{' '}
              <Link href="/feeds/create">
                <a className="text-blue-300">create a feed provider</a>
              </Link>{' '}
              to begin.
            </p>
          </div>
        )}
        {!authenticated && (
          <div className="bg-gray-600 rounded px-6 py-2 mt-4 flex items-center">
            <svg
              className="w-10 h-10 text-blue-300 fill-current mr-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 330 330"
            >
              <path d="M165 0C74.019 0 0 74.02 0 165.001 0 255.982 74.019 330 165 330s165-74.018 165-164.999S255.981 0 165 0zm0 300c-74.44 0-135-60.56-135-134.999S90.56 30 165 30s135 60.562 135 135.001C300 239.44 239.439 300 165 300z" />
              <path d="M164.998 70c-11.026 0-19.996 8.976-19.996 20.009 0 11.023 8.97 19.991 19.996 19.991 11.026 0 19.996-8.968 19.996-19.991 0-11.033-8.97-20.009-19.996-20.009zM165 140c-8.284 0-15 6.716-15 15v90c0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15v-90c0-8.284-6.716-15-15-15z" />
            </svg>
            <span className="gap-1">
              <Link href="/login">
                <a className="text-blue-300">Sign In</a>
              </Link>
              {' or '}
              <Link href="/register">
                <a className="text-blue-300">Sign Up</a>
              </Link>
              {' to register your own RSS.'}
            </span>
          </div>
        )}
        <FeedsList feeds={feeds} loading={loading} />
      </div>
      <ScrollToTop />
    </>
  );
};

Home.getInitialProps = async ctx => {
  const { token } = authenticated(ctx, { redirect: false });

  return { token };
};

export default Home;
