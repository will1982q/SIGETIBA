import { pool } from "../database/db.js";
import {firstStock} from "./stock.controller.js"

export const createProduct = async (req, res) => { 
    const {name_p, ean_p, purchase_price_p, sale_price_p, id_supplier_p} = req.body
    let sql1 = 'INSERT INTO product (name_p, ean_p, purchase_price_p, sale_price_p, id_supplier_p) VALUES (?, ?, ?, ?, ?);'
    const [rows] = await pool.query(sql1, [name_p, ean_p, purchase_price_p, sale_price_p, id_supplier_p])
    let idProduct = rows.insertId
    firstStock(idProduct)
    res.send(rows)
}

export const getAllProducts = async (req,res) => {
    const [rows] = await pool.query('SELECT * FROM product;')
    res.send(rows)
}

export const updateProduct = async (req, res) => { 
    let ean = req.params.ean
    const {purchase_price_p, sale_price_p} = req.body
    let sql2 = 'UPDATE product SET purchase_price_p = ?, sale_price_p = ? WHERE ean_p = ?;' 
    const [rows] = await pool.query(sql2, [purchase_price_p, sale_price_p, ean])
    let idProduct = rows.insertId
    console.log(idProduct)
    res.send(rows)
}

export const getProductByEan = async (req, res) => { // it's used to add old purchases or to add sales
    let ean = req.params.ean
    let sql3 = 'SELECT * FROM product WHERE ean_p = ?;'
    const [rows] = await pool.query(sql3, [ean])
    res.send(rows)
}

export const getProductByName = async (req, res) => {
    let name = req.params.name
    let sql = 'SELECT * FROM product WHERE name_p = ?;'
    const [rows] = await pool.query(sql,[name])
    res.send(rows)
}

export const getProductsBySupplier = async (req, res) => {
    let supplier = req.params.supplier
    let sql = 'SELECT id_product, id_supplier, name_p FROM product JOIN supplier ON id_supplier = id_supplier_p WHERE name_s = ?;'
    const [rows] = await pool.query(sql, [supplier])
    res.send(rows)
}