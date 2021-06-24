import axios from 'axios';
import { isAfter, isEqual } from 'date-fns';
import ParseXmlFeedContent, {
  FeedItem,
  FeedListInterface,
} from './ParseXmlFeedContent';
import { FeedInterface } from '@repositories/FeedRepository';

interface ResponseFeedItem extends FeedItem {
  provider_id: string;
}

interface ResponseFeedListInterface extends Omit<FeedListInterface, 'item'> {
  item: ResponseFeedItem[];
}

export default class {
  async handle(feed: FeedInterface): Promise<ResponseFeedListInterface> {
    try {
      const response = await axios.get(feed.url);
      const content = await ParseXmlFeedContent.parse(response.data);
      return {
        ...content,
        item: content.item.map(i => ({
          ...i,
          provider_id: feed._id.toHexString(),
        })),
      };
    } catch (err) {
      return {
        item: [],
        link: feed.url,
        title: 'Not Found',
        updatedAt: new Date().toISOString(),
      };
    }
  }

  async handleMany(feeds: FeedInterface[]): Promise<ResponseFeedItem[]> {
    try {
      const allItems = await feeds.reduce(async (acc, feed) => {
        const list = await this.handle(feed);
        return acc.then(agregator => agregator.concat(list.item));
      }, Promise.resolve<ResponseFeedItem[]>([]));

      allItems.sort((a, b) => {
        const aDate = a.pubDate;
        const bDate = b.pubDate;

        if (isEqual(aDate, bDate)) {
          return 0;
        }

        if (isAfter(aDate, bDate)) {
          return -1;
        }

        return 1;
      });

      return allItems;
    } catch {
      return [];
    }
  }
}
