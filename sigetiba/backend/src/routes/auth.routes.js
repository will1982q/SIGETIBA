import { Router } from "express"

import {verifyActive, validateCredentials} from '../controllers/auth.controller.js'
//import {verifyOpenCash} from '../controllers/cash.controller.js'

const router = Router()

router.get('/api/auth/active/:username', verifyActive)
router.post('/api/auth/credentials', validateCredentials)
//router.get('/api/auth/open-cash', verifyOpenCash)

export default router