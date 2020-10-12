import db from '../database.js'
import axios from 'axios'
import Xml from '../util/Xml.js'

class RssReaderController {
    async index(req, res) {
        let feed = await db.find('feeds', req.params.id)
        let {data} = await axios.get(feed.url)
        const channel = await Xml.parse(data)
        res.send({channel})
    }
}

export default new RssReaderController()