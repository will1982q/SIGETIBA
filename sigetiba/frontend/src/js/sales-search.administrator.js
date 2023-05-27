let closeBtn = document.getElementById('close-btn')
let cashTable = document.getElementById('cash-added-tbl')
let cashes = null

document.addEventListener('DOMContentLoaded',async () => {
    let elems = document.querySelectorAll('.dropdown-trigger')
    let instances = M.Dropdown.init(elems, {hover: false})

    cashes = await getCashes()
    addRowCash(cashes)
})

closeBtn.addEventListener('click', () => {
    window.location.replace('http://127.0.0.1:5500/frontend/src/pages/index.html')
})

const addRowCash = (cashes) => {
    
    for(let i=0; i<cashes.length; i++){
        let rowCash = document.createElement('tr')
        rowCash.setAttribute('id', `${cashes[i].id_cash}`)

        let fieldCloseDatetime = document.createElement('td')
        fieldCloseDatetime.textContent = `${cashes[i].close_datetime_c}`
        rowCash.appendChild(fieldCloseDatetime)        

        let fieldSoldValue = document.createElement('td')
        let soldValue = cashes[i].close_value_c - cashes[i].open_value_c
        fieldSoldValue.textContent = `${soldValue}`
        rowCash.appendChild(fieldSoldValue)

        cashTable.appendChild(rowCash)
    }
        
}

const getCashes = async () => {
    let results = null
    try {
        const resStream = await fetch('http://localhost:5000/api/closed-cash')
        results = await resStream.json()
        return results
        //console.log('cash.views L138 ', results)
    } catch (error) {
        console.log(error)
    }    
}