import { authenticated } from '../../../hooks/auth';
import { FeedItem } from '../../index';
import api from '../../../services/api';
import { formatter } from '../../../util/dateFormatter';
import { useCallback, useEffect, useState } from 'react';
import FeedsList from '../../../components/FeedsList';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface ProviderDetailsResponse {
  item: FeedItem[];
  title: string;
  link: string;
}

interface ProviderDetails {
  feeds: FeedItem[];
  title: string;
  link: string;
}

const Content = () => {
  const [provider, setProvider] = useState<ProviderDetails>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const id = router.query.id;

  async function getFeeds() {
    const response = await api.get<ProviderDetailsResponse>(
      `/feeds/contents/${id}`,
    );
    setProvider({
      title: response.data.title,
      link: response.data.link,
      feeds: response.data.item.map(i => {
        let domain = new URL(i.link);
        return {
          ...i,
          site: domain.hostname,
          pubDate: formatter.format(new Date(i.pubDate)),
        };
      }),
    });

    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      if (id) {
        await getFeeds();
      }
    })();
  }, [id]);

  const handleRefresh = useCallback(async () => {
    setLoading(true);
    await getFeeds();
  }, []);

  return (
    <>
      {!loading && (
        <Head>
          <title>Feeds from {provider.title} | RSS</title>
        </Head>
      )}
      <div>
        {!loading && (
          <div className="flex items-center text-gray-300 gap-2">
            <Link href="/">
              <a className="flex items-center text-xl">RSS</a>
            </Link>
            /
            <Link href={provider.link}>
              <a
                target="_blank"
                className="text-blue-300 flex items-center text-xl"
              >
                {provider.title}
              </a>
            </Link>
          </div>
        )}
        <FeedsList feeds={provider?.feeds || []} loading={loading} noTag />
      </div>
    </>
  );
};
Content.getInitialProps = async ctx => {
  const { token } = authenticated(ctx);
  return { token };
};

export default Content;
