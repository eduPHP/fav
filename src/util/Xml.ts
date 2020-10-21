import xml2js from 'xml2js'

const parser = new xml2js.Parser()

interface Item {
    title: string[]
    author: string[]
    link: string[]
    pubDate: string[]
}

export default {
    async parse(xml: any) {
        const parsed = await parser.parseStringPromise(xml)
        const channel = parsed.rss.channel[0]
        return {
            title: channel.title[0],
            link: channel.link[0],
            item: channel.item.map((item: Item) => {
                return {
                    title: item.title[0],
                    author: item.author ? item.author[0] : null,
                    link: item.link[0],
                    pubDate: item.pubDate[0]
                }
            })
        }
    }
}
