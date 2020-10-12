import xml2js from 'xml2js'

const parser = new xml2js.Parser()

export default {
    async parse(xml) {
        const parsed = await parser.parseStringPromise(xml)
        const channel = parsed.rss.channel[0]
        return {
            title: channel.title[0],
            link: channel.link[0],
            item: channel.item.map(iten => {
                return {
                    title: iten.title[0],
                    author: iten.author ? iten.author[0] : null, 
                    link: iten.link[0], 
                    pubDate: iten.pubDate[0]
                }
            })
        }
    }
}