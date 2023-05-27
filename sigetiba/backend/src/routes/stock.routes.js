import { Router } from "express"

import { getStocks, getQuantityByEan } from "../controllers/stock.controller.js"

const router = Router()



router.get('/api/stocks', getStocks)
router.get('/api/stocks/:ean', getQuantityByEan)

export default router
