import { pool } from "../database/db.js";

export const createSupplier = async (req, res) => {
    
    try {
        const {nit_s, name_s, phone_s, email_s} = req.body
        let sql = 'INSERT INTO supplier (nit_s, name_s, phone_s, email_s) VALUES (?,?,?,?);'
        const [rows] = await pool.query(sql, [nit_s, name_s, phone_s, email_s])
        res.send(rows)
        console.log('L10b', rows)
    } catch (error) {
        console.log(error)
    }
}

export const getSuppliers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM dbstore.supplier;')
        //console.log(rows)
        res.send(rows)
        console.log('getSuppliers L20', rows)
    } catch (error) {
        console.log(error)
    }
}

export const getSupplier = async (req, res) => {    
    try {
        let supplierName = req.params.supplierName
        const [rows] = await pool.query('SELECT * FROM supplier WHERE name_s = ?;',[supplierName])
        res.send(rows)
    } catch (error) {
        console.log(error)
    }    
}

export const getOldSupplier = async (req) => {
    try {
        let sql6 = 'SELECT id_supplier FROM supplier WHERE name_s = ?;'
        let supplierName = req.body.purchase_supplier.purchase_supplier_name    
        const [rowsOldSupplier] = await pool.query(sql6,[supplierName])
        //console.log('rowsOldSupplier ', rowsOldSupplier[0])
        return rowsOldSupplier[0].id_supplier // because is the if obtained of a SELECT nor an INSERT
    } catch (error) {
        console.log(error)
    }    
}