import { generateDatetime} from "../utils/utilities.js" 


// let saleDatetime = document.getElementById('sale-datetime')
let saleDatetimeTxt = document.getElementById('sale-datetime-txt')

let closeBtn = document.getElementById('close-btn')

let saleProductsSel = document.getElementById('sale-products-sel')
let saleFrm = document.getElementById('sale-frm')


let salePayBtn = document.getElementById('sale-pay-btn')
let saleTotalSpa = document.getElementById('sale-total-spa')
//let saleModifyRow = document.getElementById('sale-modify-row')
let saleAddRowBtn = document.getElementById('sale-add-row-btn')
let saleAvailableStockSpa = document.getElementById('sale-available-stock-spa')

let saleEanFindTxt = document.getElementById('sale-ean-find-txt')
let saleFillFieldsBtn = document.getElementById('sale-fill-fields-btn')

//let saleEanBtn = document.getElementById('sale-ean-btn')
let saleQuantityTxt = document.getElementById('sale-quantity-txt')
let saleEanTxt = document.getElementById('sale-ean-txt')
let saleNameTxt = document.getElementById('sale-name-txt')
let saleUnitValueTxt = document.getElementById('sale-unit-value-txt')
let salePartialValueTxt = document.getElementById('sale-partial-value-txt')
// let saleTable = document.getElementById('sale-table')
let saleAddingTbl = document.getElementById('sale-adding-tbl')
let saleAddedTbl = document.getElementById('sale-added-tbl')

let total = 0
let partialValue = 0
let contRows = 0
let product = null

document.addEventListener('DOMContentLoaded', async () => {
    let saleDatetime = generateDatetime()
    saleDatetimeTxt.value = saleDatetime
    //------------to fill products--------------------------
    let results = null
    try {
        const resStream = await fetch('http://localhost:5000/api/products')
        results = await resStream.json()        
    } catch (error) {
        console.log(error)
    }

    for(let i=0;i<results.length;i++){
        let opt = document.createElement('option')
        opt.text = `${results[i].name_p}`
        opt.value = `${results[i].name_p}`        
        saleProductsSel.add(opt)        
    }     
    M.FormSelect.init(saleProductsSel)
    //------------------------------------------------------
       
})

saleProductsSel.addEventListener('change', async ()=> {
    
    let name = saleProductsSel.value
    
    try {            
        const resStream = await fetch(`http://localhost:5000/api/product/name/${name}`)
        product = await resStream.json()
        product = product[0]            

        console.log('L85', product)
        if(saleProductsSel.value !== "EAN" && saleEanFindTxt.value === ""){
            fillFieldsProduct(product)
            console.log('L87') // until here ok
        }
    } catch (error) {
        console.log(error)
    }   
    
})

saleFillFieldsBtn.addEventListener('click', async () => {
    let ean = saleEanFindTxt.value
    //let product = null
    try {        
        const resStream = await fetch(`http://localhost:5000/api/product/ean/${ean}`)
        product = await resStream.json()
        product = product[0]
        
        if(saleProductsSel.value === "EAN" && saleEanFindTxt.value !== ""){
            fillFieldsProduct(product)
        }

    } catch (error) {
        console.log(error)
    }
})


saleQuantityTxt.addEventListener('change', () => { //ok
    partialValue = calculatePartialValue()
    salePartialValueTxt.value = `${partialValue}`
    //calculatePartialValue()
    //console.log('L116', salePartialValueTxt.value)
})


closeBtn.addEventListener('click', () => {
    window.location.replace('http://127.0.0.1:5500/frontend/src/pages/index.html')
})


// saleEanBtn.addEventListener('click',() => { // this would be changed by saleEanTxT.add(change) >avoid the button
//     fillFieldsProduct()
// })

saleAddRowBtn.addEventListener('click', () => {
    // addNewRowSale(product)
    addNewRowSale(product)
})

salePayBtn.addEventListener('click', async () => {
    await enterSale()
    location.reload()
})


const enterSale =  async () => {
    //--------1. create sale------------------------
    console.log('L146', saleDatetimeTxt.value)
    let idSale = null
    let jsonSale = `{
        "sale_datetime": "${saleDatetimeTxt.value}"
    }`
    
    try {
        const resStream = await fetch('http://localhost:5000/api/sale',{
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonSale
        })
        let results1 = await resStream.json()
        idSale = results1.insertId           
        
    } catch (error) {
        console.log(error)
    }
    
    //--------2. create sale details------------------------
    for(let i=1; i< saleAddedTbl.rows.length;i++){ 
        let jsonSaleDetail = `{
            "id_sale_invoice_sid": "${idSale}",
            "id_product_sid": "${saleAddedTbl.rows[i].id}",
            "quantity_sid": "${saleAddedTbl.rows[i].cells[2].innerText}",
            "partial_value": "${saleAddedTbl.rows[i].cells[4].innerText}"
        }`
        try {
            const resStream2 = await fetch('http://localhost:5000/api/sale/sale-detail', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: jsonSaleDetail
            })
            let results2 = await resStream2.json()            
            // CONTINUE HERE TO REDUCE STOCK
        } catch (error) {
            console.log(error)
        }
    }    
    
}

const fillFieldsProduct = (product) => {    
    saleEanTxt.value = product.ean_p    
    saleNameTxt.value = product.name_p 
    saleUnitValueTxt.value = product.sale_price_p
    // salePartialValueTxt.value = `${partialValue}`
    console.log('L191', partialValue)

}

const addNewRowSale = async (product) => { 
    let enoughStock = await checkEnoughStock(saleQuantityTxt.value, saleEanTxt.value)
    //console.log('L210', product.ean_p)
    saleAvailableStockSpa.textContent = ""
    calculatePartialValue()
    if(enoughStock === null){
        contRows++
        let rowSale = document.createElement('tr')
        //let idRow = saleAddedTbl.rows.length

        rowSale.setAttribute('id', product.id_product)    

        let fieldEanSale = document.createElement('td')
        fieldEanSale.textContent = product.ean_p
        rowSale.appendChild(fieldEanSale)
        
        let fieldNameSale = document.createElement('td')
        fieldNameSale.textContent = saleNameTxt.value
        rowSale.appendChild(fieldNameSale)

        let fieldQuantitySale = document.createElement('td')
        fieldQuantitySale.textContent = saleQuantityTxt.value
        rowSale.appendChild(fieldQuantitySale)

        let fieldUnitValueSale = document.createElement('td')
        fieldUnitValueSale.textContent = saleUnitValueTxt.value
        rowSale.appendChild(fieldUnitValueSale)

        let fieldPartialValueSale = document.createElement('td')
        fieldPartialValueSale.textContent = salePartialValueTxt.value
        rowSale.appendChild(fieldPartialValueSale)

        let fieldModifySale = document.createElement('td')
        let buttonModifySale = document.createElement('button')
        buttonModifySale.setAttribute('id',`btn-modify-${contRows}`)
        buttonModifySale.setAttribute('Type', 'button')
        buttonModifySale.textContent = 'MODIFICAR'
        buttonModifySale.addEventListener('click', () => {
            modifyRow(product.id_product)
        })
        fieldModifySale.appendChild(buttonModifySale)
        rowSale.appendChild(fieldModifySale)    
        saleAddedTbl.appendChild(rowSale)

        //saleFrm.reset() // this t reset <select> to its initial value
        saleEanTxt.value = ""
        // saleQuantityTxt.value = "0"
        saleQuantityTxt.value = ""
        saleNameTxt.value = ""
        saleUnitValueTxt.value = ""
        salePartialValueTxt.value = ""

        calculateShowTotal()
        }else{
            console.log(`Disponible unicamente ${enoughStock} ${saleNameTxt.textContent}`)
            saleAvailableStockSpa.textContent = `Disponible unicamente ${enoughStock} ${saleNameTxt.textContent}`
        }    
}

const modifyRow = (idRow) => {
    let row = document.getElementById(idRow)

    saleQuantityTxt.value = row.children.item(2).textContent
    saleEanTxt.value = row.children.item(0).textContent    
    saleNameTxt.value = row.children.item(1).textContent
    saleUnitValueTxt.value = row.children.item(3).textContent
    salePartialValueTxt.value = row.children.item(4).textContent

    let indexRow = document.getElementById(idRow).rowIndex
    console.log('L273', document.getElementById(idRow).rowIndex)
    saleAddedTbl.deleteRow(indexRow)
    calculateShowTotal()
}

const checkEnoughStock = async (qty, ean) => {  //ok
    let results = null
    try {
        const resStream = await fetch(`http://localhost:5000/api/stocks/${ean}`)
        results = await resStream.json()
        
        console.log('L283', results)
        if(qty <= results.quantity_s){
            return null
        }else{
            return results.quantity_s
        }
        
    } catch (error) {
        console.log(error)
    }
}

const calculatePartialValue = () => {
    partialValue = parseInt(saleQuantityTxt.value) * parseFloat(saleUnitValueTxt.value)
    return partialValue
    //salePartialValueTxt.innerHTML = `${salePartialNumber}`    
}

const calculateShowTotal = () => {
    total = 0
    for(let i=1;i<saleAddedTbl.rows.length;i++){
        total += parseFloat(saleAddedTbl.rows[i].cells[4].innerText)
    }
    saleTotalSpa.textContent = `${total}`
}




