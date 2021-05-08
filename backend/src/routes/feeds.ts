import { Router } from 'express'
import FeedsController from '../controllers/FeedsController'
import RssReaderController from '../controllers/RssReaderController'
import PublicRssReaderController from '../controllers/PublicRssReaderController'
import AuthorizeUsers from '../middleware/AuthorizeUsers'

const router = Router()

// public RSS Reader
router.get('/feeds/public-contents', PublicRssReaderController.index)
router.get('/feeds/public-contents/:id', PublicRssReaderController.show)

// auth
router.use('/feeds', AuthorizeUsers)

// RSS Reader
router.get('/feeds/contents', RssReaderController.index)
router.get('/feeds/contents/:id', RssReaderController.show)

// feeds CRUD
router.post('/feeds', FeedsController.store)
router.get('/feeds', FeedsController.index)
router.get('/feeds/:id', FeedsController.show)
router.put('/feeds/:id', FeedsController.update)
router.delete('/feeds/:id', FeedsController.destroy)

export default router
