import db from '../database.js'

class FeedsController {
    store(req, res) {
        const {name, url, active} = req.body
        db.insert('feeds', {name, url, active}).then(feed => {
            res.send({feed})
        }).catch(err => {
            console.log(err)
            res.send({err})
        })
    }

    index(req, res) {
        db.all('feeds').then(feeds => {
            res.send({feeds})
        }).catch(err => {
            console.log(err)
            res.send({err})
        })
    }

    show(req, res) {
        db.find('feeds', req.params.id).then(feed => {
            res.send({feed})
        }).catch(err => {
            console.log(err)
            res.send({err})
        })
    }

    update(req, res) {
        const {name, url, active} = req.body
        db.update('feeds', req.params.id, {name, url, active}).then(feed => {
            res.send({feed})
        }).catch(err => {
            console.log(err)
            res.send({err})
        })
    }

    destroy(req, res) {
        db.delete('feeds', req.params.id).then(deleted => {
            res.send(deleted)
        }).catch(err => {
            console.log(err)
            res.send({err})
        })
    }
}

export default new FeedsController()