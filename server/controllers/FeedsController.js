import db from '../database.js'
import { Validator } from '../util/validator.js'

const validator = new Validator({
    name: 'required',
    url: 'required|url',
    active: 'boolean'
})

class FeedsController {
    async store(req, res) {
        validator.validate(req)
        .then(data => {
            db.insert('feeds', data).then(feed => {
                res.send({feed})
            }).catch(err => {
                res.send({err})
            })
        })
        .catch(err => {
            res.send(err)
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
        validator.validate(req)
        .then(data => {
            db.update('feeds', req.params.id, data).then(feed => {
                res.send({feed})
            }).catch(err => {
                console.log(err)
                res.send({err})
            })
        })
        .catch(err => {
            res.send(err)
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