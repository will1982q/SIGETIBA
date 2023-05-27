import { pool } from "../database/db.js"
import { updateCash } from "./cash.controller.js"
import { decreaseStock } from "./stock.controller.js"


export const createSale = async (req, res) => {  // create sale  
    try {     
        let sql = 'INSERT INTO sale_invoice (datetime_si) VALUES (?);' 
        //let datetimeSale = req.sale_datetime
        let {sale_datetime} = req.body
        console.log('L10b ', sale_datetime)
        const [rowsSaleInvoice] = await pool.query(sql,[sale_datetime])
        
        res.send(rowsSaleInvoice)
        //res.send(idSale)
        
    } catch (error) {
        console.log(error)
    } 
}

// const generateDatetime = () => {
//     let dateTime = new Date() 
//     let year = dateTime.getFullYear()
//     let month = dateTime.getMonth() + 1
//     let day = dateTime.getDate()
//     let hours = dateTime.getHours()
//     let minutes = dateTime.getMinutes()
//     let seconds = dateTime.getSeconds()
//     let datetimeFull = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
//     return datetimeFull
// }

// const insertPerson = async () => {
//     try {
//         let sql4 = "INSERT INTO person (identification_card_p, first_name_p, last_name_p, email_p, phone_p, type_p) VALUES('','','','','','CLIENTE');"
//         let [rowsPerson] = await pool.query(sql4)
//     return rowsPerson.insertId
//     } catch (error) {
//         console.log(error)
//     }    
// }

// const insertClient = async (idPerson) => {
//     try {
//         let sql5 = 'INSERT INTO client (debt_c, id_person_c) VALUES (0, ?);'
//         let [rowsClient] = await pool.query(sql5,[idPerson])
//         //console.log('id client ',idClient)
//     return rowsClient.insertId
//     } catch (error) {
//         console.log(error)
//     }        
// }

const insertSaleInvoice = async (sale_number, sale_datetime, idClient) => {
    try {
        let sql1 = 'INSERT INTO sale_invoice (number_si, datetime_si, id_client_si) VALUES (?, ?, ?);'       
        const [rowsSaleInvoice] = await pool.query(sql1,[sale_number, sale_datetime, idClient])
        return rowsSaleInvoice.insertId
    } catch (error) {
        console.log(error)
    }         
}

export const getCurrentSale = async (req, res) => { // not in use
    try {
        const [rows] = await pool.query('SELECT MAX(id_sale_invoice) AS currentId FROM sale_invoice;')
        let idSale = rows[0]
        res.send(idSale)
    } catch (error) {
        console.log(error)
    }    
}

export const createSaleDetail = async (req, res) => { 
    try {
        const {quantity_sid, id_product_sid, id_sale_invoice_sid, partial_value} = req.body // this is query from the db, could be obtained with getProductsBySupplier
        let sql = 'INSERT INTO sale_invoice_detail (quantity_sid, id_sale_invoice_sid, id_product_sid) VALUES (?, ?, ?);'
        const [rows] = await pool.query(sql, [quantity_sid, id_sale_invoice_sid, id_product_sid])
        res.send(rows)
        decreaseStock(id_product_sid, quantity_sid)
        updateCash(partial_value)
    } catch (error) {
        console.log(error)
    }    
}