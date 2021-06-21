import xml2js from 'xml2js'
import parseIsoDate from 'yup/lib/util/isodate';

const parser = new xml2js.Parser({ explicitArray: false })

interface AtomFeedItem {
  title: string
  summary: string | null
  author: string | null
  link: { $: { href: string } }
  updated: string
}

interface RssFeedItem {
  title: string
  description: string | null
  author: string | null
  link: string
  pubDate: string
}

interface AtomFeed {
  feed: {
    entry: AtomFeedItem[]
    title: string
    link: { $: { href: string } }
  }
}

interface RssFeed {
  rss: {
    channel: {
      title: string
      link: string
      item: RssFeedItem[]
    }
  }
}

export interface FeedItem {
  title: string
  description: string | null
  author: string | null
  link: string | { $: { href: string } }
  pubDate: Date
  icon?: string
}

export interface FeedListInterface {
  title: string
  link: string
  updatedAt: string
  item: FeedItem[]
}

export default {
  async parse(xml: string): Promise<FeedListInterface> {
    const parsed = await parser.parseStringPromise(xml)

    if (!parsed.rss) {
      return this.parseAtom(parsed)
    }

    return this.parseRss(parsed)
  },

  parseAtom(parsed: AtomFeed): FeedListInterface {
    const channel = parsed.feed
    const items = channel.entry

    return {
      title: channel.title,
      link: channel.link.$.href,
      updatedAt: new Date().toLocaleString(),
      item: items.map((item: AtomFeedItem) => {
        const description = this.normalizeDescription(item.summary)
        return {
          title: item.title,
          author: item.author || null,
          description,
          link: item.link.$.href,
          pubDate: new Date(parseIsoDate(item.updated)),
        }
      }),
    }
  },

  parseRss(parsed: RssFeed): FeedListInterface {
    const { channel } = parsed.rss
    const items = channel.item

    return {
      title: channel.title,
      link: channel.link,
      updatedAt: new Date().toLocaleString(),
      item: items.map((item: RssFeedItem) => {
        const description = this.normalizeDescription(item.description)

        return {
          title: item.title,
          author: item.author || null,
          description,
          link: item.link,
          pubDate: new Date(parseIsoDate(item.pubDate)),
        }
      }),
    }
  },

  normalizeDescription(description: string | null): string | null {
    let result = ''

    if (!description) {
      return null
    }

    result = description.replace(/<\/?[^>]+(>|$)/g, '')

    if (result.length > 200) {
      result = result.substring(0, 200).trim().concat('...')
    }

    return result
  },
}
