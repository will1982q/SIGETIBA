import { generateDatetime, generateNumberInvoice } from "../utils/utilities.js"

let purchaseNumberTxt = document.getElementById('purchase-number-txt')
let purchaseDatetimeTxt = document.getElementById('purchase-datetime-txt')
let purchaseAddBtn = document.getElementById('purchase-buy-btn')
let purchaseTotalSpa = document.getElementById('purchase-total-spa')
let purchaseSupplierSel = document.getElementById('purchase-supplier-sel') 
let purchaseProductsSel = document.getElementById('purchase-products-sel')

let closeBtn = document.getElementById('close-btn')

let newSupplierDiv = document.getElementById('new-supplier-div')
let purchaseSupplierNameTxt = document.getElementById('purchase-supplier-name-txt')
let purchaseSupplierNitTxt = document.getElementById('purchase-supplier-nit-txt')
let purchaseSupplierPhoneTxt = document.getElementById('purchase-supplier-phone-txt')
let purchaseSupplierEmailTxt = document.getElementById('purchase-supplier-email-txt')


let purchaseEanBtn = document.getElementById('purchase-ean-btn')
let purchaseNameTd = document.getElementById('purchase-name-td') //td to old product txt to new product
let purchasePriceTd = document.getElementById('purchase-price-td')
let purchaseSalePriceTd = document.getElementById('purchase-sale-price-td')
let purchasePartialValueTd = document.getElementById('purchase-partial-value-td')
let purchaseQuantityTxt = document.getElementById('purchase-quantity-txt')

let purchaseNameTxt = document.getElementById('purchase-name-txt')
let purchaseEanTxt = document.getElementById('purchase-ean-txt')
let purchasePriceTxt = document.getElementById('purchase-price-txt')
let purchaseSalePriceTxt = document.getElementById('purchase-sale-price-txt')

let purchaseAddedTbl = document.getElementById('purchase-added-tbl')
let purchaseAddRowBtn = document.getElementById('purchase-add-row-btn')

let purchasePartialNumber = 0
let totalPurchase = 0
let contRows = 0
let rowValue = ''
let idSupplier = null
let idPurchase = null
let idOldProduct = null
let idNewProduct = null
document.addEventListener('DOMContentLoaded', async function(){
    //----------Navbar dropdown------------------
    let elems = document.querySelectorAll('.dropdown-trigger')
    let instances = M.Dropdown.init(elems, {hover: false})

    //------------to fill suppliers---------------------------
    let results = null
    try {
        const resStream = await fetch('http://localhost:5000/api/suppliers')
        results = await resStream.json()        
    } catch (error) {
        console.log(error)
    }

    for(let i=0;i<results.length;i++){
        let opt = document.createElement('option')
        opt.text = `${results[i].name_s}`
        opt.value = `${results[i].name_s}`        
        purchaseSupplierSel.add(opt)        
    }     
    M.FormSelect.init(purchaseSupplierSel)

    //------------to fill products---------------------------
    
    M.FormSelect.init(purchaseProductsSel)

    purchaseNumberTxt.value = generateNumberInvoice()
    purchaseDatetimeTxt.value = generateDatetime()    
})



purchaseSupplierSel.addEventListener('change', () => {    
    if(purchaseSupplierSel.value !== 'NUEVO'){
        fillOldSupplier()
        loadProducts()
    }
    cleanFields()
    newSupplierDiv.removeAttribute('hidden')
        
})

closeBtn.addEventListener('click', () => {
    window.location.replace('http://127.0.0.1:5500/frontend/src/pages/index.html')
})

purchaseAddRowBtn.addEventListener('click', () => {
    addNewRowPurchase()
})

purchasePriceTxt.addEventListener('change', () => {
    calculateFillPartialValuePurchase()
})

purchaseQuantityTxt.addEventListener('change', () => {
    calculateFillPartialValuePurchase()
})

purchaseProductsSel.addEventListener('change', () => {
    //console.log('fisrt call to ProductsSell')
    //fillOldProduct() //___Work here this was changed 7 may
    if(purchaseProductsSel.value !== 'NUEVO'){
        fillOldProduct()
    }
})

purchaseAddBtn.addEventListener('click', () => {
    //enterPurchase()
    createPurchase()
})

const cleanFields = () => {
    purchaseSupplierNameTxt.value = ""
    purchaseSupplierNitTxt.value = ""
    purchaseSupplierPhoneTxt.value = ""
    purchaseSupplierEmailTxt.value = ""
}

// const loadSuppliers = async () => {
//     let results = null
//     try {
//         const resStream = await fetch('http://localhost:5000/api/suppliers')
//         results = await resStream.json()        
//     } catch (error) {
//         console.log(error)
//     }  
     
// }

const loadProducts = async () => {  //// ok
    let results = null
    let supplier = purchaseSupplierSel.value
    
    if(purchaseProductsSel.length > 2){        
        let length = purchaseProductsSel.length
        for(let i=0;i < length-1;i++){
            purchaseProductsSel.remove(purchaseProductsSel.length-1)
        }
    }    
    try {
        const resStream = await fetch(`http://localhost:5000/api/products/${supplier}`)
        results = await  resStream.json()
        console.log('L129', results, purchaseProductsSel.length)
        console.log('L130', purchaseSupplierSel.length)
    } catch (error) {
        console.log(error)
    }
    for(let i=0;i<results.length;i++){
        let opt = document.createElement('option')

        opt.text = `${results[i].name_p}`
        opt.value = `${results[i].name_p}`
        purchaseProductsSel.add(opt)

        // opt.appendChild(document.createTextNode(`${results[i].name_p}`))
        // opt.setAttribute('id',`${results[i].name_p}`)
        // purchaseProductsSel.appendChild(opt)
        M.FormSelect.init(purchaseProductsSel)
    }   
}

const fillOldProduct = async () => {
    let results = null
    let name = purchaseProductsSel.value 
    try {
       const resStream = await fetch(`http://localhost:5000/api/product/name/${name}`)
       results = await resStream.json()
       idOldProduct = results[0].id_product 
    } catch (error) {
        console.log(error)
    }
    console.log('l163F OLD PRODUCT',results[0].id_product)
    purchaseNameTxt.value = results[0].name_p
    purchaseEanTxt.value = results[0].ean_p
    purchasePriceTxt.value = results[0].purchase_price_p
    purchaseSalePriceTxt.value = results[0].sale_price_p
    calculateFillPartialValuePurchase()    
}

const fillOldSupplier = async () => {
    let results = null 
    let supplierName = purchaseSupplierSel.value
    try {
        const resStream = await fetch(`http://localhost:5000/api/supplier/${supplierName}`)
        results = await resStream.json()
        idSupplier = results[0].id_supplier
        console.log('L171', results)
    } catch (error) {
        console.log(error)
    }
    //console.log(results)
    purchaseSupplierNameTxt.value = results[0].name_s
    purchaseSupplierNitTxt.value = results[0].nit_s
    purchaseSupplierPhoneTxt.value = results[0].phone_s
    purchaseSupplierEmailTxt.value = results[0].email_s
}

const createNewSupplier = async () => {
    try {
        const resStream = await fetch(`http://localhost:5000/api/supplier`)
        results = await resStream.json()
        idSupplier = results[0].id_supplier
        console.log('L171', results)
    } catch (error) {
        console.log(error)
    }
}

const addNewRowPurchase = () => {
    contRows++
    let rowPurchase = document.createElement('tr')
        
    if(rowValue === ''){
        if(purchaseProductsSel.value === 'NUEVO'){
            rowValue = '0'
        }else{
            rowValue = idOldProduct
        }
    }    

    let idRow = `${rowValue}-${purchaseAddedTbl.rows.length}`
    //let idRow = purchaseAddedTbl.rows.length
    rowPurchase.setAttribute('id', idRow)    
    let fieldEanPurchase = document.createElement('td')
    fieldEanPurchase.textContent = purchaseEanTxt.value
    rowPurchase.appendChild(fieldEanPurchase)

    let fieldNamePurchase = document.createElement('td')
    fieldNamePurchase.textContent = purchaseNameTxt.value
    rowPurchase.appendChild(fieldNamePurchase)
    
    let fieldQuantityPurchase = document.createElement('td')
    fieldQuantityPurchase.textContent = purchaseQuantityTxt.value
    rowPurchase.appendChild(fieldQuantityPurchase)

    let fieldPricePurchase = document.createElement('td')
    fieldPricePurchase.textContent = purchasePriceTxt.value
    rowPurchase.appendChild(fieldPricePurchase)

    let fieldSalePricePurchase = document.createElement('td')
    fieldSalePricePurchase.textContent = purchaseSalePriceTxt.value
    rowPurchase.appendChild(fieldSalePricePurchase)

    let fieldPartialValuePurchase = document.createElement('td')
    fieldPartialValuePurchase.textContent = purchasePartialValueTd.textContent
    rowPurchase.appendChild(fieldPartialValuePurchase)

    let fieldModifyPurchase = document.createElement('td')
    let buttonModifyPurchase = document.createElement('button')
    let idBtn = `modify-btn${contRows}`
    buttonModifyPurchase.setAttribute('id', idBtn)//'purchase-modify-row'
    buttonModifyPurchase.textContent = 'MODIFICAR'
    buttonModifyPurchase.setAttribute('type', 'button')
    buttonModifyPurchase.addEventListener('click', () => {
        modifyRow(idRow)
    })
    fieldModifyPurchase.appendChild(buttonModifyPurchase)
    rowPurchase.appendChild(fieldModifyPurchase)
    purchaseAddedTbl.appendChild(rowPurchase)

    purchaseEanTxt.value = ""
    purchaseNameTxt.value = ""
    purchaseQuantityTxt.value = "1"
    purchasePriceTxt.value = ""
    purchaseSalePriceTxt.value = ""
    purchasePartialValueTd.textContent = ""
    //purchaseProductsSel.value = "NUEVO"
    rowValue = ""

    calculateTotalPurchase()
}

const calculateFillPartialValuePurchase = () => {
    purchasePartialNumber = 0
    if(purchasePriceTxt.value !== "" && purchaseQuantityTxt.value !== ""){
        purchasePartialNumber = parseFloat(purchasePriceTxt.value) * parseInt(purchaseQuantityTxt.value)
    }    
    purchasePartialValueTd.innerHTML = `${purchasePartialNumber}`
}

const calculateTotalPurchase = () => {
    totalPurchase = 0

    for(let i=1;i<purchaseAddedTbl.rows.length;i++){
        totalPurchase += parseFloat(purchaseAddedTbl.rows[i].cells[5].innerText)    
    }
    purchaseTotalSpa.textContent = `${totalPurchase}`
}

const createPurchase = async () => {
    //--------1.create supplier if supplier = NUEVO    
    if(purchaseSupplierSel.value === "NUEVO"){
        let jsonSupplier = `{
            "nit_s": "${purchaseSupplierNitTxt.value}",
            "name_s": "${purchaseSupplierNameTxt.value}",            
            "phone_s": "${purchaseSupplierPhoneTxt.value}",
            "email_s": "${purchaseSupplierEmailTxt.value}"
        }`
        try {
            const resStream = await fetch('http://localhost:5000/api/supplier',{
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: jsonSupplier
            })
            let results = await resStream.json()
            idSupplier = results.insertId
            console.log('L330 id new supplier', results.insertId)   
            
        } catch (error) {
            console.log(error)
        }
    }

    //--------2.create purchase----------  
    let jsonPurchase = `{
        "purchase_number": "${purchaseNumberTxt.value}",
        "purchase_datetime": "${purchaseDatetimeTxt.value}",            
        "id_supplier": "${idSupplier}"
    }`
    try {
        const resStream = await fetch('http://localhost:5000/api/purchase',{
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonPurchase
        })
        let results1 = await resStream.json()
        idPurchase = results1.insertId
        console.log('L383f id new purchase', results1.insertId)   
        
    } catch (error) {
        console.log(error)
    }
    
    //--------3.create purchase detail----------
    for(let i=1;i<purchaseAddedTbl.rows.length;i++){
        if(purchaseAddedTbl.rows[i].id[0] === "0" ){ //insert detail with new product
            //------------3.1 insert new product
            let jsonNewProduct = `{
                "ean_p": "${purchaseAddedTbl.rows[i].cells[0].innerText}", 
                "name_p": "${purchaseAddedTbl.rows[i].cells[1].innerText}",                           
                "purchase_price_p": "${purchaseAddedTbl.rows[i].cells[3].innerText}",
                "sale_price_p": "${purchaseAddedTbl.rows[i].cells[4].innerText}",
                "id_supplier_p": "${idSupplier}"
            }`            
            try {
                const resStream = await fetch('http://localhost:5000/api/product',{
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: jsonNewProduct
                })
                let results2 = await resStream.json()
                idNewProduct = results2.insertId

            //------------3.1.1 insert detail with new product
                let jsonDetailNewProduct = `{
                    "idPurchase": "${idPurchase}", 
                    "id_product": "${idNewProduct}",                           
                    "quantity": "${purchaseAddedTbl.rows[i].cells[2].innerText}"
                }`            
            
                const resStream3 = await fetch('http://localhost:5000/api/purchase-detail',{
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: jsonDetailNewProduct
                })                
                let results3 = await resStream3.json()             
                
            } catch (error) {
                console.log(error)
            }           
            
        }else{  //insert detail with old product
            //------------3.2 insert detail with old product
            let jsonDetailOldProduct = `{
                "idPurchase": "${idPurchase}", 
                "id_product": "${purchaseAddedTbl.rows[i].id[0]}",                           
                "quantity": "${purchaseAddedTbl.rows[i].cells[2].innerText}"
            }`
                        
            try {
                const resStream4 = await fetch('http://localhost:5000/api/purchase-detail',{
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: jsonDetailOldProduct
                })                
                let results4 = await resStream4.json()                  
                
            } catch (error) {
                console.log(error)
            }
        }
    }    
    try {
        const resStream = await fetch('http://localhost:5000/api/purchase',{
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonPurchase
        })
        let results1 = await resStream.json()
        idPurchase = results1.insertId
        console.log('L383f id new purchase', results1.insertId)   
        
    } catch (error) {
        console.log(error)
    }
}

const modifyRow = (idRow) => { // continue here
    let row = document.getElementById(idRow)
    
    purchaseEanTxt.value = row.children.item(0).textContent
    purchaseNameTxt.value = row.children.item(1).textContent    
    purchaseQuantityTxt.value = row.children.item(2).textContent
    purchasePriceTxt.value = row.children.item(3).textContent
    purchaseSalePriceTxt.value = row.children.item(4).textContent
    purchasePartialValueTd.textContent = row.children.item(5).textContent
    //rowValue = idRow.slice(0,1)
    let index = row.rowIndex
    //let index = idRow.slice(2) // before with this
    purchaseAddedTbl.deleteRow(index)
    calculateTotalPurchase()
}