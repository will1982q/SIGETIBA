import { validateEmptyFields } from "../utils/utilities.js"

document.addEventListener('DOMContentLoaded', function(){
    let elems = document.querySelectorAll('select')
    let instances = M.FormSelect.init(elems)
})

let roleSel = document.getElementById('role-sel')
let userTxt = document.getElementById('username-txt')
let passwordTxt = document.getElementById('password-txt')
let loginBtn = document.getElementById('login-btn')
let messageSpa = document.getElementById('messages-spa')


loginBtn.addEventListener('click', async () => {

    if(validateEmptyFields([userTxt, passwordTxt])){
        messageSpa.textContent = validateEmptyFields([userTxt, passwordTxt])
    }else{ 
        if(await validateCredentials()){ 
            let activeUser = await validateActiveUser()
            if(activeUser === 1){
                if(roleSel.value === 'ADMINISTRADOR')                    {
                    window.location.replace('http://127.0.0.1:5500/frontend/src/pages/cash.administrator.html')
                }else if(roleSel.value === 'VENDEDOR'){
                    if(await verifyOpenCash()){
                        window.location.replace('http://127.0.0.1:5500/frontend/src/pages/sales.seller.html')
                    }else{
                        messageSpa.textContent = 'Abra caja para poder facturar'
                    }
                    
                }                
            }else if(activeUser === 0){
                messageSpa.textContent = 'El usuario esta inactivo'
            }
        }else{
            messageSpa.textContent = 'Credenciales Incorrectas'
        }
    }    
})

const validateCredentials = async () => {
    let results = null
    let jsonCredentials = `{
        "username": "${userTxt.value}",
        "password": "${passwordTxt.value}",
        "role": "${roleSel.value}"
    }`
    console.log(jsonCredentials)
    try {
        const resStream = await fetch('http://localhost:5000/api/auth/credentials', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonCredentials
        })
        results = await resStream.json()
        if(results.length === 0){
            return 0
        }else{
            return 1
        }
    } catch (error) {
        console.log(error)
    }    
}

const validateActiveUser = async () => {    
    let results = null
    try {
        const resStream = await fetch(`http://localhost:5000/api/auth/active/${userTxt.value}`)
        results = await resStream.json()
        let isActive = results[0].is_active_e
        return isActive               
        
    } catch (error) {
        console.log(error)
    }
}

const verifyOpenCash = async () => {
    let results = null
    try {
        const resStream = await fetch('http://localhost:5000/api/cash/current')
        results = await resStream.json()
        console.log('L80',results.state_c)
        if(results.state_c === 'ABIERTA'){ 
            return 1
        }else if(results.state_c === 'CERRADA'){ 
            return 0
        }
    } catch (error) {
        console.log(error)
    }
}