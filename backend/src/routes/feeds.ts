import {Router} from "express";
import FeedsController from '../controllers/FeedsController'
import RssReaderController from '../controllers/RssReaderController'
import AuthorizeUsers from "../middleware/AuthorizeUsers";
import cached from "../middleware/CacheResponse";

const router = Router()

router.use('/feeds', AuthorizeUsers)

// feeds CRUD
router.post('/feeds', FeedsController.store)
router.get('/feeds', FeedsController.index)
router.get('/feeds/:id', FeedsController.show)
router.put('/feeds/:id', FeedsController.update)
router.delete('/feeds/:id', FeedsController.destroy)

// RSS Reader
router.get('/feeds/:id/list', cached(1), RssReaderController.index)

export default router
