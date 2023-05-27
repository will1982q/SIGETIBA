import { pool } from "../database/db.js"

export const getStocks = async (req, res) => {
    try {
        let sql = 'SELECT id_stock, ean_p, name_p, quantity_s, purchase_price_p, sale_price_p FROM dbstore.product INNER JOIN dbstore.stock ON id_product = id_product_s;'
        const [rows] = await pool.query(sql)
        res.send(rows)
    } catch (error) {
        console.log(error)
    }    
}

export const firstStock = async (idProd) => { // modified 14ap
    try {
        let sql = 'INSERT INTO stock (id_product_s) VALUES(?);' // changed
        const [rows] = await pool.query(sql,[idProd])
        //console.log('id first stock',rows.insertId)
    } catch (error) {
        console.log(error)
    }
    
} /// CONTINUE HERE HERE HERE

const getQuantityByIdProduct = async (idProd) => {
    try {
        let sql = 'SELECT quantity_s FROM stock WHERE id_product_s = ?;'
        const [rows1] = await pool.query(sql,[idProd])
        //console.log('L23 ',rows1)
        let qtStock = rows1[0].quantity_s
        //console.log('L25 ',qtStock)
        return parseInt(qtStock)
    } catch (error) {
        console.log(error)
    }
}

export const getQuantityByEan = async (req, res) => {
    try {
        let sql =  `SELECT quantity_s FROM stock INNER JOIN product
        ON id_product_s = id_product
        WHERE ean_p = ?;`
        let ean = req.params.ean
        const [rows] = await pool.query(sql, [ean])
        console.log('L44b ',rows)
        res.send(rows[0])
    } catch (error) {
        console.log(error)
    }
}

export const updateStock = async (idProd, qtProd) => {
    try {
        //console.log('L34 idProd:',idProd,'L34 qtProd:',qtProd)
        let sql2 = 'UPDATE stock SET quantity_s = ? WHERE id_product_s = ?;'
        const [rows2] = await pool.query(sql2,[qtProd, idProd])

        //console.log('updated stock',rows2)
    } catch (error) {
        console.log(error)
    }
}

export const increaseStock =  async (idProd, qtProd) => {
    try {
        let qtInStock = await getQuantityByIdProduct(idProd)        
        //let newStock = qtInStock + parseInt(qtProd)        //was changed
        let newStock = qtInStock + parseInt(qtProd)        
        await updateStock(idProd, newStock)
        
    } catch (error) {
        console.log(error)
    }
}

export const decreaseStock = async (idProd, qtProd) => {
    try {
        let qtInStock = await getQuantityByIdProduct(idProd)
        let newStock = qtInStock - parseInt(qtProd)     // was changed   
        await updateStock(idProd, newStock)        

    } catch (error) {
        console.log(error)
    }
}