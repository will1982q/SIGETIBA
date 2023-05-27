let closeBtn = document.getElementById('close-btn')
let stockTable = document.getElementById('stock-added-tbl')
let stocks = null

document.addEventListener('DOMContentLoaded', async () => {
    let elems = document.querySelectorAll('.dropdown-trigger')
    let instances = M.Dropdown.init(elems, {hover: false})

    stocks = await getStocks()
    addRowStock(stocks)
})

closeBtn.addEventListener('click', () => {
    window.location.replace('http://127.0.0.1:5500/frontend/src/pages/index.html')
})

const getStocks = async () => {
    let results = null
    try {
        const resStream = await fetch('http://localhost:5000/api/stocks')
        results = await resStream.json()
        return results
    } catch (error) {
        console.log(error)
    }
}

const addRowStock = (stocks) => {
    for(let i=0; i < stocks.length; i++){
        let rowStock = document.createElement('tr')
        rowStock.setAttribute('id', `${stocks[i].id_stock}`)

        let fieldEan = document.createElement('td')
        fieldEan.textContent = `${stocks[i].ean_p}`
        rowStock.appendChild(fieldEan)

        let fieldName = document.createElement('td')
        fieldName.textContent = `${stocks[i].name_p}`
        rowStock.appendChild(fieldName)

        let fieldQuantity = document.createElement('td')
        fieldQuantity.textContent = `${stocks[i].quantity_s}`
        rowStock.appendChild(fieldQuantity)

        let fieldPurchasePrice = document.createElement('td')
        fieldPurchasePrice.textContent = `${stocks[i].purchase_price_p}`
        rowStock.appendChild(fieldPurchasePrice)

        let fieldSalePrice = document.createElement('td')
        fieldSalePrice.textContent = `${stocks[i].sale_price_p}`
        rowStock.appendChild(fieldSalePrice)

        stockTable.appendChild(rowStock)        
    }
}