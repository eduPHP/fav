import { Router } from 'express'
import FeedsController from '../controllers/FeedsController'
import RssReaderController from '../controllers/RssReaderController'
import AuthorizeUsers from '../middleware/AuthorizeUsers'

const router = Router()

router.use('/feeds', AuthorizeUsers)

// feeds CRUD
router.post('/feeds', FeedsController.store)
router.get('/feeds', FeedsController.index)
router.get('/feeds/all', RssReaderController.index)
router.get('/feeds/:id', FeedsController.show)
router.put('/feeds/:id', FeedsController.update)
router.delete('/feeds/:id', FeedsController.destroy)

// RSS Reader
router.get('/feeds/:id/list', RssReaderController.show)

export default router
