import xml2js from 'xml2js'

const parser = new xml2js.Parser({ explicitArray: false })

interface Item {
  title: string
  author: string | null
  link: string
  pubDate: string
}

export interface FeedListInterface {
  title: string
  link: string
  updatedAt: string
  item: Item[]
}

export default {
  async parse(xml: string): Promise<FeedListInterface> {
    const parsed = await parser.parseStringPromise(xml)
    const { channel } = parsed.rss
    return {
      title: channel.title,
      link: channel.link,
      updatedAt: new Date().toLocaleString(),
      item: channel.item.map((item: Item) => {
        return {
          title: item.title,
          author: item.author ? item.author : null,
          link: item.link,
          pubDate: item.pubDate,
        }
      }),
    }
  },
}
