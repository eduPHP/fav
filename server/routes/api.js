import FeedsController from '../controllers/FeedsController.js'

export default app => {
    app.post('/feeds', FeedsController.store)

    app.get('/feeds', FeedsController.index)

    app.get('/feeds/:id', FeedsController.show)

    app.put('/feeds/:id', FeedsController.update)

    app.delete('/feeds/:id', FeedsController.destroy)
}