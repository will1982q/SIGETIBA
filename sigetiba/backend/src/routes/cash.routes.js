import { Router } from "express"

import { getCashes, openCash, closeCash, getCurrentCash, getClosedCashes} from "../controllers/cash.controller.js"

const router = Router()

router.get('/api/cash', getCashes) //cashCloseBtn
router.get('/api/closed-cash', getClosedCashes) //cashCloseBtn
router.post('/api/cash/open', openCash) //cashOpenBtn
router.post('/api/cash/close',closeCash)// cashCloseBtn -> update close_datetime -< to continue here here
router.get('/api/cash/current', getCurrentCash)
//router.get('/api/cash/verify-open', verifyOpenCash)

export default router