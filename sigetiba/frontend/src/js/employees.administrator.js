import { validateEmptyFields } from "../utils/utilities.js"

document.addEventListener('DOMContentLoaded',function(){
    let elems = document.querySelectorAll('.dropdown-trigger')
    let instances = M.Dropdown.init(elems, {hover: false})

    let elems1 = document.querySelectorAll('select')
    let instances1 = M.FormSelect.init(elems1)

    showEmployees()
})

let employeeNameTxt = document.getElementById('employee-name-txt')
let employeeLastameTxt = document.getElementById('employee-lastname-txt')
let employeeIdentificationCardTxt = document.getElementById('employee-identification-card-txt')
let employeePhoneTxt = document.getElementById('employee-phone-txt')
let employeeEmailTxt = document.getElementById('employee-email-txt')

let closeBtn = document.getElementById('close-btn')

let employeeRoleSel = document.getElementById('employee-role-sel')
let employeeUsernameTxt = document.getElementById('employee-username-txt')
let employeePasswordTxt = document.getElementById('employee-password-txt')
let employeeCreateUserBtn = document.getElementById('employee-create-user-btn')
let employeeMessageSpa = document.getElementById('employee-message-spa')
let employeeRecordsTbl = document.getElementById('employee-records-tbl')

closeBtn.addEventListener('click', () => {
    window.location.replace('http://127.0.0.1:5500/frontend/src/pages/index.html')
})

employeeCreateUserBtn.addEventListener('click', () => {
    //console.log(validateEmptyFields([employeeNameTxt, employeeLastameTxt, employeeIdentificationCardTxt, employeePhoneTxt, employeeEmailTxt, employeeUsernameTxt, employeePasswordTxt]))
    // console.log('L17')
    if(validateEmptyFields([employeeNameTxt, employeeLastameTxt, employeeIdentificationCardTxt, employeePhoneTxt, employeeEmailTxt, employeeUsernameTxt, employeePasswordTxt]) === ""){
        //console.log('L19')
        employeeMessageSpa.textContent = validateValidPassword(employeePasswordTxt.value)
    }else{
        employeeMessageSpa.textContent = validateEmptyFields([employeeNameTxt, employeeLastameTxt, employeeIdentificationCardTxt, employeePhoneTxt, employeeEmailTxt, employeeUsernameTxt, employeePasswordTxt])
        console.log('L22')
        // createEmployee()
    }    
    
})

const validateValidPassword = (pass) => {
    let message = ""
    if(pass.length < 6 ){
        message = "La contraseña debe tener minimo 6 caracteres"
    }else{
        //console.log('L34')
        createEmployee()
        showNewEmployee()
    }
    return message
}

const createEmployee = async () => {
    //console.log('LL35')
    let jsonEmployee = `{
        "name": "${employeeNameTxt.value}",
        "last_name": "${employeeLastameTxt.value}",
        "identification_card": "${employeeIdentificationCardTxt.value}",
        "phone": "${employeePhoneTxt.value}",
        "email": "${employeeEmailTxt.value}",
        "username": "${employeeUsernameTxt.value}",
        "password": "${employeePasswordTxt.value}",
        "role": "${employeeRoleSel.value}",
        "state": "1"
    }`
    let results = null
    console.log(jsonEmployee)
    try {
        const resStream = await fetch('http://localhost:5000/api/employee', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonEmployee
        })
        results = await resStream.json()
                
    } catch (error) {
        console.log(error)
    }
}

const showEmployees = async () => { 
    let results = null
    try {
        const resStream = await fetch('http://localhost:5000/api/employees')
        results = await resStream.json()
        console.log(employeeRecordsTbl.rows.length)
        for(let i=0;i<results.length;i++){
            let rowEmployee = document.createElement('tr')
            rowEmployee.setAttribute('id', results[i].id_employee)

            let fieldRole = document.createElement('td')
            fieldRole.textContent = results[i].type_e
            rowEmployee.appendChild(fieldRole)

            let fieldName = document.createElement('td')
            fieldName.textContent = `${results[i].first_name_e} ${results[i].last_name_e}`
            rowEmployee.appendChild(fieldName)

            let fieldIdentificationCard = document.createElement('td')
            fieldIdentificationCard.textContent = results[i].identification_card_e
            rowEmployee.appendChild(fieldIdentificationCard)

            let fieldPhone = document.createElement('td')
            fieldPhone.textContent = results[i].phone_e
            rowEmployee.appendChild(fieldPhone)

            let fieldState = document.createElement('td')
            let state = ''
            if(results[i].is_active_e === 1 ){
                state = 'ACTIVO'
            }else if (results[i].is_active_e === 0){
                state = 'INACTIVO'
            }
            fieldState.textContent = state
            rowEmployee.appendChild(fieldState)

            employeeRecordsTbl.appendChild(rowEmployee)            
        }
        
    } catch (error) {
        console.log(error)
    }
}

const showNewEmployee = () => {
    console.log(employeeRecordsTbl.rows.length)
    let rowNewEmployee = document.createElement('tr')
    rowNewEmployee.setAttribute('id', `${employeeRecordsTbl.rows.length + 1}`)

    let fieldRole = document.createElement('td')
    fieldRole.textContent = employeeRoleSel.value
    rowNewEmployee.appendChild(fieldRole)

    let fieldName = document.createElement('td')
    fieldName.textContent = `${employeeNameTxt.value} ${employeeLastameTxt.value}`
    rowNewEmployee.appendChild(fieldName)

    let fieldIdentificationCard = document.createElement('td')
    fieldIdentificationCard.textContent = employeeIdentificationCardTxt.value
    rowNewEmployee.appendChild(fieldIdentificationCard)

    let fieldPhone = document.createElement('td')
    fieldPhone.textContent = employeePhoneTxt.value
    rowNewEmployee.appendChild(fieldPhone)

    let fieldState = document.createElement('td')    
    fieldState.textContent = 'ACTIVO'
    rowNewEmployee.appendChild(fieldState)

    employeeRecordsTbl.appendChild(rowNewEmployee)

    cleanFields()
}

const cleanFields = () => {
    employeeNameTxt.value = ""
    employeeLastameTxt.value = ""
    employeeIdentificationCardTxt.value = ""
    employeePhoneTxt.value = ""
    employeeEmailTxt.value = ""
    employeeUsernameTxt.value = ""
    employeePasswordTxt.value = ""
}
