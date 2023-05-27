import { Router } from "express"
import { createProduct, getAllProducts, getProductsBySupplier, getProductByEan, getProductByName, updateProduct } from "../controllers/product.controller.js"

const router = Router()

router.post('/api/product',createProduct) // ok
router.get('/api/products', getAllProducts)
router.get('/api/product/ean/:ean',getProductByEan) // ok this end point retuns the product (*) with a specific ean
router.get('/api/products/:supplier',getProductsBySupplier)   // ok this end point returns all products of a given supplier in the param :supplier
router.get('/api/product/name/:name',getProductByName)    //- this end point retuns the product (*) with a specific name
router.put('/api/product/:ean',updateProduct) // ok

export default router