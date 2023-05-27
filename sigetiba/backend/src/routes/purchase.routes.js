import { Router } from "express"

import { createPurchase, createPurchaseDetail } from "../controllers/purchase.controller.js"

const router = Router()

//router.post('/api/purchase', createPurchase) // changed 14abr
router.post('/api/purchase', createPurchase)
router.post('/api/purchase-detail', createPurchaseDetail)

//router.get('/api/purchase/current-purchase', getCurrentPurchase)
//router.post('/api/purchase/purchase-detail', createPurchaseDetail)



export default router