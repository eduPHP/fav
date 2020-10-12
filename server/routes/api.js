import FeedsController from '../controllers/FeedsController.js'
import RssReaderController from '../controllers/RssReaderController.js'

export default app => {
    // feeds CRUD
    app.post('/feeds', FeedsController.store)
    app.get('/feeds', FeedsController.index)
    app.get('/feeds/:id', FeedsController.show)
    app.put('/feeds/:id', FeedsController.update)
    app.delete('/feeds/:id', FeedsController.destroy)

    // RSS Reader
    app.get('/feeds/:id/list', RssReaderController.index)
}