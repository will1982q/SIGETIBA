import { pool } from "../database/db.js";

export const getCashes = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM cash;')
        res.send(rows)
    } catch (error) {
        console.log(error)
    }     
}

export const getClosedCashes = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM dbstore.cash WHERE state_c = "CERRADA";')
        res.send(rows)
    } catch (error) {
        console.log(error)
    }     
}

export const openCash = async (req, res) => {    
    try {
        const {openValue, openDatetime} = req.body
        let sql = "INSERT INTO cash (open_datetime_c, open_value_c, close_datetime_c, close_value_c, state_c) VALUES (?,?,?,?,'ABIERTA');"
        const [rows] = await pool.query(sql, [openDatetime, openValue, openDatetime, openValue])        
    } catch (error) {
        console.log(error)
    }    
}

export const updateCash = async (partial) => { // updated with each product not with the invoice total
    try {
        //console.log('getCloseValue() L30',getCloseValue())
        let closeValue = await getCloseValue()
        // closeValue += partial
        closeValue += parseFloat(partial)
        
        let sql1 = 'UPDATE cash SET close_value_c = ? WHERE state_c = "ABIERTA";'
        let [rows2] = await pool.query(sql1,[closeValue])       

    } catch (error) {
        console.log(error)
    }
}

export const closeCash = async (req, res) => {
    try {
        let closeValue = await getCloseValue()
        const closeDatetime = req.body.closeDatetime
        let sql = 'UPDATE cash SET close_datetime_c = ?, state_c = "CERRADA" WHERE state_c = "ABIERTA";'
        let [rows] = await pool.query(sql,[closeDatetime])
        //res.send({"closeValue" : `${closeValue}`})
        res.send({closeValue})
        console.log('close Value L44', rows)
    } catch (error) {
        console.log(error)
    }    
}

const getCloseValue = async () => {
        let sql = 'SELECT close_value_c FROM cash WHERE state_c = "ABIERTA";'
        let [rows] = await pool.query(sql)
        let closeValue = rows[0].close_value_c  
        //console.log('close value L60', closeValue)      
        return closeValue
}

export const getCurrentCash = async (req, res) => {
    try {
        
        let sql = 'SELECT * FROM cash ORDER BY id_cash DESC LIMIT 1;'
        let[rows] = await pool.query(sql)
        //let currentState = rows[0].state_c
        console.log('rows L64:',rows)
        // res.send(rows[0])
        res.send(rows[0])
        console.log('L66', rows)
        
    } catch (error) {
        console.log(error)
    }     
}

// export const verifyOpenCash = async (req, res) => {
//     try {
//         let sql = ''
//     } catch (error) {
//         console.log(error)
//     }
// }