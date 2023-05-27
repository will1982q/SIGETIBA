import { pool } from "../database/db.js"

export const verifyActive = async (req, res) => {
    try {
        let sql = 'SELECT is_active_e FROM employee WHERE username_e = ?;'
        let username = req.params.username
        const [rows] = await pool.query(sql, [username])
        res.send(rows)
        console.log('rows L8:',rows)
    } catch (error) {
        console.log(error)
    }
}

export const validateCredentials = async (req, res) => {
    try {
        //let sql = 'SELECT * FROM employee WHERE username_e = ? AND password_e = ?;'
        let sql = 'SELECT * FROM employee WHERE username_e = ? AND password_e = ? AND type_e = ?;'
        let {username, password, role} = req.body
        //console.log('username: ',username, 'password:',password)
        const [rows] = await pool.query(sql, [username, password, role])
        res.send(rows)
        console.log(rows)
    } catch (error) {
        console.log(error)
    }
}