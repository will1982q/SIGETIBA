import { Router } from "express"

import { createSupplier, getSupplier, getSuppliers } from "../controllers/supplier.controller.js"

const router = Router()

router.post('/api/supplier', createSupplier)
router.get('/api/suppliers', getSuppliers)
router.get('/api/supplier/:supplierName', getSupplier)

export default router
