import db from '../database.js'
import axios from 'axios'
import xml2js from 'xml2js'

class RssReaderController {
    async index(req, res) {
        let feed = await db.find('feeds', req.params.id)
        let parser = new xml2js.Parser()
        let {data: rawData} = await axios.get(feed.url)
        const parsed = await parser.parseStringPromise(rawData)
        const channel = parsed.rss.channel[0]
        res.send({
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
        })
    }
}

export default new RssReaderController()