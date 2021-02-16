import { GetServerSideProps } from 'next';
import { FeedsList } from './api/feeds';
import Link from 'next/link';

export default function Home({ feeds }: FeedsList) {
  return (
    <div>
      <h1 className="bg-green-500">RSS!</h1>
      {feeds.map(feed => (
        <div key={feed.id}>
          <span>{feed.name}</span>
          <span>{feed.url}</span>
          <Link href={`/feeds/${feed.id}`}>Edit</Link>
        </div>
      ))}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await fetch(`${process.env.API_URL}/feeds`);
  const { feeds } = await response.json();
  return {
    props: { feeds },
  };
};
