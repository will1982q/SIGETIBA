import { pool } from "../database/db.js"

export const createEmployee = async (req, res) => {
    try {
        let sql = 'INSERT INTO employee (first_name_e, last_name_e, identification_card_e, username_e, password_e, type_e, email_e, phone_e, is_active_e) VALUES (?,?,?,?,?,?,?,?,?);'
        let {name, last_name, identification_card, phone, email, username, password, role, state} = req.body
        const [rows] = await pool.query(sql, [name, last_name, identification_card, username, password, role, email, phone, state])
        return rows
    } catch (error) {
        console.log(error)
    } 
}

export const getEmployees = async (req, res) => {
    try {
        let sql = `SELECT id_employee, type_e, is_active_e, identification_card_e, first_name_e, last_name_e, phone_e FROM employee;`
        const [rows] = await pool.query(sql)
        res.send(rows)
    } catch (error) {
        console.log(error)
    }
}