import { GetStaticPaths, GetStaticProps } from 'next';

export default function Edit({ feed }) {
  return <div>Olá {feed.name}</div>;
}
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [{ params: { id: '1' } }, { params: { id: '15' } }],
  fallback: 'blocking',
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params;
  const response = await fetch(`${process.env.API_URL}/feeds/${id}`);
  const { feed } = await response.json();
  return {
    props: { feed },
    revalidate: 10,
  };
};
