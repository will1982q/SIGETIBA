import { Router } from "express"

import {createSale, getCurrentSale, createSaleDetail} from '../controllers/sale.controller.js'

const router = Router()

router.post('/api/sale', createSale)
router.get('/api/sale/current-sale',getCurrentSale) //not in use
router.post('/api/sale/sale-detail', createSaleDetail) 

export default router