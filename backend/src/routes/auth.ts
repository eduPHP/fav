import { Router } from 'express'

import PasswordsResetController from '../controllers/PasswordsResetController'
import RegisterController from '../controllers/RegisterController'
import ProfileController from '../controllers/ProfileController'
import LoginController from '../controllers/LoginController'

import AuthorizeUsers from '../middleware/AuthorizeUsers'

const router = Router()

router.post('/auth/register', RegisterController.store)
router.post('/auth/login', LoginController.store)
router.post('/auth/recover', PasswordsResetController.store)
router.put('/auth/recover', PasswordsResetController.update)

router.get('/auth/user', AuthorizeUsers, ProfileController.show)

export default router
