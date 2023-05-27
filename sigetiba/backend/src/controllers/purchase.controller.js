import { pool } from "../database/db.js"
import { firstStock, increaseStock } from "./stock.controller.js"
import {createSupplier, getOldSupplier} from "./supplier.controller.js"

export const createPurchase = async (req, res) => {
    try {
        let sql8 = 'INSERT INTO purchase_invoice (number_pi, datetime_pi, id_supplier_pi) VALUES (?, ?, ?);'
        // let {purchase_number, purchase_datetime, id_supplier, id_product, quantity} = req.body
        let {purchase_number, purchase_datetime, id_supplier} = req.body
        const [rowsPurchaseInvoice] = await pool.query(sql8,[purchase_number, purchase_datetime, id_supplier])
        let idPurchase =  rowsPurchaseInvoice.insertId        
        res.send(rowsPurchaseInvoice)
        increaseStock(id_product, quantity)
    } catch (error) {
        console.log(error)
    }
}

export const createPurchaseDetail = async (req, res) => {
    try {        
        let {idPurchase, id_product, quantity} = req.body
        let sql4 = 'INSERT INTO purchase_invoice_detail (id_purchase_invoice_pid, id_product_pid, quantity_pid) VALUES (?, ?, ?);'
        let [rowsPurchaseDetail] = await pool.query(sql4,[idPurchase,id_product,quantity]) 
        res.send(rowsPurchaseDetail)

        increaseStock(id_product, quantity)
    } catch (error) {
        console.log(error)
    }
}


const insertPurchaseWithNewSupplier = async (req, idNewSupplier) => {
    try {
        let sql8 = 'INSERT INTO purchase_invoice (number_pi, datetime_pi, id_supplier_pi) VALUES (?, ?, ?);'
        let {purchase_number, purchase_datetime} = req.body
        const [rowsPurchaseInvoice] = await pool.query(sql8,[purchase_number, purchase_datetime, idNewSupplier])
        //console.log('rowsPurchaseInvoice', rowsPurchaseInvoice)
        return rowsPurchaseInvoice.insertId 
    } catch (error) {
        console.log(error)
    }          
}



const insertPurchaseWithOldSupplier = async (req, idOldSupplier) => {
    try {
        let sql2 = 'INSERT INTO purchase_invoice (number_pi, datetime_pi, id_supplier_pi) VALUES (?, ?, ?);'
        let {purchase_number, purchase_datetime} = req.body
        const [rowsPurchaseInvoice] = await pool.query(sql2,[purchase_number, purchase_datetime, idOldSupplier])
        //console.log('rowsPurchaseInvoice', rowsPurchaseInvoice)
        return rowsPurchaseInvoice.insertId
    } catch (error) {
        console.log(error)
    }        
}   // HER HERE HERE

const insertDetailOldProduct = async (req, idPurchaseInvoice, i) => {
    try {
        let sql3 = 'SELECT id_product FROM product WHERE ean_p = ?;' //to old product
        let [rowsOldProd] = await pool.query(sql3,[req.body.purchase_details[i].purchase_ean])
        let idOldProd = rowsOldProd[0].id_product

        let sql7 = 'INSERT INTO purchase_invoice_detail (id_purchase_invoice_pid, id_product_pid, quantity_pid) VALUES (?, ?, ?);'
        let qtOldProd = req.body.purchase_details[i].purchase_quantity
        let [rowsOldDetail] = await pool.query(sql7,[idPurchaseInvoice,idOldProd, qtOldProd]) 
        //console.log(rowsOldDetail)
        increaseStock(idOldProd, qtOldProd)
    } catch (error) {
        console.log(error)
    }    
}

const insertDetailNewProduct = async (req, idPurchaseInvoice, idSupplier, i) => {
    try {
        let sql5 = 'INSERT INTO product (name_p, ean_p, purchase_price_p, sale_price_p, id_supplier_p ) VALUES(?, ?, ?, ?, ?);' //to insert new product
        let prodEan = req.body.purchase_details[i].purchase_ean
        let prodName = req.body.purchase_details[i].purchase_name
        let prodPurchase = req.body.purchase_details[i].purchase_price
        let prodSale = req.body.purchase_details[i].purchase_sale_price
        console.log('L144 prodEan ',prodEan)
        let [rowsNewProd] = await pool.query(sql5, [prodName, prodEan, prodPurchase, prodSale, idSupplier])
        let idNewProd = rowsNewProd.insertId 
        
        let sql4 = 'INSERT INTO purchase_invoice_detail (id_purchase_invoice_pid, id_product_pid, quantity_pid) VALUES (?, ?, ?);'
        let qtNewProd = req.body.purchase_details[i].purchase_quantity
        let [rowsNewDetail] = await pool.query(sql4,[idPurchaseInvoice,idNewProd,qtNewProd]) 
        //console.log('rowsNewDetail',rowsNewDetail)
        firstStock(idNewProd, qtNewProd)
    } catch (error) {
        console.log(error)
    }    
}





