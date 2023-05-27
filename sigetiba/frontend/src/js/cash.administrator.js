import {generateDatetime} from '../utils/utilities.js'

let cashOpenBtn = document.getElementById('cash-open-btn')
let cashOpenValueTxt = document.getElementById('cash-open-value-txt') //there is

let closeBtn = document.getElementById('close-btn')
let cashStateTxt = document.getElementById('cash-state-txt')

let cashOpenDatetimeTxt = document.getElementById('cash-open-datetime-txt')

let cashCloseValueTxt= document.getElementById('cash-close-value-txt')
let cashCloseBtn = document.getElementById('cash-close-btn')
let cashTable = document.getElementById('cash-added-tbl')

let closeValue = 0
let contRows = 0
let currentState = ''
let cashes = null


document.addEventListener('DOMContentLoaded', async () => {
    let elems = document.querySelectorAll('.dropdown-trigger')
    let instances = M.Dropdown.init(elems, {hover: false})

    let currentCash = await getCurrentCash()
    console.log('L24 currenCash',currentCash)
    //currentCash = currentCash[0]
    currentState = currentCash.state_c
    cashStateTxt.value = currentState
    console.log('L20 currenCash',currentState)    
    
    if (currentState === 'ABIERTA'){
        cashOpenValueTxt.value = currentCash.open_value_c
        cashOpenDatetimeTxt.value = currentCash.open_datetime_c
        cashCloseValueTxt.value = currentCash.close_value_c
        cashStateTxt.value = currentState
    }
    cashes = await getCashes()
    addRowCash(cashes)
    console.log('l58 cashes',cashes)
    
})

closeBtn.addEventListener('click', () => {
    window.location.replace('http://127.0.0.1:5500/frontend/src/pages/index.html')
})

cashOpenBtn.addEventListener('click', async () => {
    // cashStateTxt.value = 'ABIERTA'
    cashCloseValueTxt.value = ""


    if(cashOpenValueTxt.value !== ""){
        if(currentState === "ABIERTA"){
            currentState= 'ABIERTA'
            cashStateTxt.value = currentState
        }else if(currentState === "CERRADA"){
            await openCash()
            //currentState= 'ABIERTA'
            // cashStateTxt.value = 'ABIERTA'
            cashStateTxt.value = 'ABIERTA'
        }else{
            await openCash()
            //currentState= 'ABIERTA'
            cashStateTxt.value = 'ABIERTA'
        }
    }   

    // if(cashOpenValueTxt.value !== "" && currentState === 'CERRADA'){        
    //     await openCash()
    //     cashStateTxt.value = 'ABIERTA'              
    // } 

    // if(cashOpenValueTxt.value !== "" && currentState === 'CERRADA'){        
    //     await openCash()
    //     cashStateTxt.value = 'ABIERTA'              
    // } 
    //currentState = 'ABIERTA'
           
})

cashCloseBtn.addEventListener('click', async () => {
    let closeDatetime = generateDatetime()
    console.log('L43 closeDatetime',closeDatetime)    
    await closeCash(closeDatetime)
    cashes = await getCurrentCash()
    addRowCash(cashes)
    //cleanFields()
    // cashStateTxt.value = 'CERRADA' 
    currentState = 'CERRADA'   
    cashStateTxt.value = currentState
    
    console.log('l90 cashes',cashes)       
})

const openCash = async () => {
    let results = null
    let openDatetime = generateDatetime()
    cashOpenDatetimeTxt.value = openDatetime
    let jsonCash = `{
        "openValue": "${cashOpenValueTxt.value}",
        "openDatetime": "${openDatetime}"        
    }`
    try {
        const resStream = await fetch('http://localhost:5000/api/cash/open', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonCash
        })
        console.log(jsonCash)
        results = await resStream.json()
        console.log('results',results)
        // currentState = 'ABIERTA'
        // cashStateTxt.value = currentState
        // cashCloseValueTxt.value = ""
    } catch (error) {
        console.log(error)
    }
}

const closeCash = async (closeDatetime) => {
    let results = null
    console.log('L94')
    let jsonClose = `{"closeDatetime" : "${closeDatetime}"}`
    try {
        const resStream = await fetch('http://localhost:5000/api/cash/close', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonClose
        })
        results = await resStream.json()
        closeValue = results.closeValue
        console.log('results cash.views L86',results.closeValue)
        currentState = 'CERRADA'
        cashStateTxt.value = currentState        
        cleanFields()
        
    } catch (error) {
        console.log(error)
    }
}

const addRowCash = (cashes) => {    
    for(let i=0; i<cashes.length; i++){
        let rowCash = document.createElement('tr')
        rowCash.setAttribute('id', `${cashes[i].id_cash}`)

        let fieldCloseDatetime = document.createElement('td')
        fieldCloseDatetime.textContent = `${cashes[i].close_datetime_c}`
        rowCash.appendChild(fieldCloseDatetime) 

        let fieldOpenValue = document.createElement('td')
        fieldOpenValue.textContent = `${cashes[i].open_value_c}`
        rowCash.appendChild(fieldOpenValue)

        let fieldCloseValue = document.createElement('td')
        fieldCloseValue.textContent = `${cashes[i].close_value_c}`
        rowCash.appendChild(fieldCloseValue)

        let fieldSoldValue = document.createElement('td')
        let soldValue = cashes[i].close_value_c - cashes[i].open_value_c
        fieldSoldValue.textContent = `${soldValue}`
        rowCash.appendChild(fieldSoldValue)

        cashTable.appendChild(rowCash)
    }
        
}

const cleanFields = () => {
    cashOpenDatetimeTxt.value = "" 
    cashOpenValueTxt.value = ""
    closeValue = 0    
}

const getCurrentCash = async () => {
    let results = null
    try {
        const resStream = await fetch('http://localhost:5000/api/cash/current')
        results = await resStream.json()
        console.log('L161 ',results)
        return results

    } catch (error) {
        console.log(error)
    }
}

const getCashes = async () => {
    let results = null
    try {
        const resStream = await fetch('http://localhost:5000/api/cash')
        results = await resStream.json()
        return results
        console.log('cash.views L138 ', results)
    } catch (error) {
        console.log(error)
    }    
}