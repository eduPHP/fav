import { Db, MongoClient } from 'mongodb';

const client = new MongoClient(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

interface MongodbConnect {
  db: Db;
  client: MongoClient;
}

export async function connect(): Promise<MongodbConnect> {
  if (!client.isConnected()) {
    await client.connect();
  }

  const db = client.db('rss-reader-test');

  return { db, client };
}
