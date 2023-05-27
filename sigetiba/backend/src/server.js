import express from  'express'
import cors from 'cors'
import morgan from 'morgan'

import purchaseRoutes from './routes/purchase.routes.js' // because roter in purchase.rotes.js was default export, it's possible to give any name to the import(purchaseRotes in this case)
import productRoutes from './routes/product.routes.js'
import supplierRoutes from './routes/supplier.routes.js'
import stockRoutes from './routes/stock.routes.js'
import saleRoutes from './routes/sale.routes.js'
import cashRoutes from './routes/cash.routes.js'
import employeeRoutes from './routes/employee.routes.js'
import authRoutes from './routes/auth.routes.js'

const app = express()

// middleware
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'))

app.use(cashRoutes)
app.use(purchaseRoutes)
app.use(productRoutes)
app.use(stockRoutes)
app.use(supplierRoutes)
app.use(saleRoutes)
app.use(employeeRoutes)
app.use(authRoutes)



const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`server is runing on port ${PORT}`)
})


