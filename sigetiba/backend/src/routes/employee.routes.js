import { Router } from "express"

import {createEmployee, getEmployees} from '../controllers/employee.controller.js'

const router = Router()

router.post('/api/employee', createEmployee)
router.get('/api/employees', getEmployees)

export default router